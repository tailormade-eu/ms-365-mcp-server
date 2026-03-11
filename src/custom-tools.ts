/**
 * Tailormade custom MCP tools — NOT part of upstream softeria/ms-365-mcp-server.
 *
 * These are compound/workflow tools that combine multiple Graph API calls
 * or have Tailormade-specific output formats (e.g. local file writes).
 *
 * Do NOT submit these to upstream. Upstream contributions go via graph-tools.ts / endpoints.json.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { writeFileSync } from 'fs';
import GraphClient from './graph-client.js';
import AuthManager from './auth.js';
import logger from './logger.js';

// ─── helpers ────────────────────────────────────────────────────────────────

async function fetchAllPages(
  graphClient: GraphClient,
  endpoint: string,
  accessToken: string | undefined,
  extraHeaders: Record<string, string> = {}
): Promise<unknown[]> {
  let items: unknown[] = [];
  let nextEndpoint: string | null = endpoint;

  while (nextEndpoint) {
    const result = (await graphClient.makeRequest(nextEndpoint, {
      accessToken,
      headers: extraHeaders,
    })) as Record<string, unknown>;

    if (Array.isArray(result.value)) {
      items = items.concat(result.value);
    }

    const nextLink = result['@odata.nextLink'] as string | undefined;
    if (nextLink) {
      const url = new URL(nextLink);
      nextEndpoint = url.pathname.replace('/v1.0', '') + url.search;
    } else {
      nextEndpoint = null;
    }
  }

  return items;
}

function normalizeSubject(s: string | undefined): string {
  if (!s) return '';
  return s
    .replace(/^(Re|FW|Fwd|TR|AW):\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// ─── tool registration ───────────────────────────────────────────────────────

export function registerCustomTools(
  server: McpServer,
  graphClient: GraphClient,
  authManager?: AuthManager
): void {
  // ── update-todo-cache ──────────────────────────────────────────────────────
  server.tool(
    'update-todo-cache',
    `Fetch all flagged todo tasks + flagged mail messages from Microsoft Graph,
join them on normalized subject, and write a structured JSON cache to disk.

Use this to keep a local cache of flagged/actionable items for use in status overviews.

Returns: { updated, counts: { flaggedEmails, matched, unmatched, total } }

⚠️ NOTE: Graph API uses two incompatible ID formats (OWA AAMk vs REST AAkA),
so the join uses normalized subject matching. Emails in non-standard folders
(junk, archive) may not match — they are included as tasks without mail metadata.`,
    {
      account: z
        .string()
        .describe(
          'Microsoft account email to use. Required when multiple accounts are configured.'
        )
        .optional(),
      outputPath: z
        .string()
        .describe('Absolute path where todo-cache.json will be written.'),
    },
    {
      title: 'update-todo-cache',
      readOnlyHint: false, // writes a local file
      openWorldHint: true,
    },
    async ({ account, outputPath }) => {
      try {
        // Resolve token
        let accessToken: string | undefined;
        if (authManager && !authManager.isOAuthModeEnabled()) {
          accessToken = await authManager.getTokenForAccount(account);
        }

        // 1. Get flaggedEmails list ID
        logger.info('update-todo-cache: fetching todo lists');
        const listsResult = (await graphClient.makeRequest('/me/todo/lists', {
          accessToken,
        })) as { value: Array<{ id: string; wellknownListName: string; displayName: string }> };

        const flaggedList = listsResult.value?.find(
          (l) => l.wellknownListName === 'flaggedEmails'
        );
        if (!flaggedList) {
          throw new Error('Flagged Emails todo list not found');
        }

        // 2. Fetch all flagged todo tasks (paginated)
        logger.info('update-todo-cache: fetching flagged todo tasks');
        const tasks = (await fetchAllPages(
          graphClient,
          `/me/todo/lists/${flaggedList.id}/tasks?$filter=status ne 'completed'&$top=999`,
          accessToken
        )) as Array<{
          id: string;
          title: string;
          status: string;
          importance: string;
          categories: string[];
          createdDateTime: string;
          dueDateTime?: { dateTime: string };
          linkedResources?: Array<{ externalId?: string; webUrl?: string }>;
        }>;
        logger.info(`update-todo-cache: ${tasks.length} flagged tasks fetched`);

        // 3. Fetch flagged mail messages (paginated)
        // ConsistencyLevel: eventual required for flag/flagStatus filter
        logger.info('update-todo-cache: fetching flagged mail messages');
        const mails = (await fetchAllPages(
          graphClient,
          `/me/messages?$filter=flag/flagStatus eq 'flagged'&$select=id,subject,from,receivedDateTime,bodyPreview,categories&$top=999&$count=true`,
          accessToken,
          { 'ConsistencyLevel': 'eventual' }
        )) as Array<{
          id: string;
          subject: string;
          from: { emailAddress: { address: string; name: string } };
          receivedDateTime: string;
          bodyPreview: string;
          categories: string[];
        }>;
        logger.info(`update-todo-cache: ${mails.length} flagged mails fetched`);

        // 4. Join on normalized subject (most recent mail wins on collision)
        const mailBySubject = new Map<string, (typeof mails)[0]>();
        for (const mail of mails) {
          mailBySubject.set(normalizeSubject(mail.subject), mail);
        }

        const items = tasks.map((task) => {
          const mail = mailBySubject.get(normalizeSubject(task.title));
          const lr = task.linkedResources?.[0];
          return {
            taskId: task.id,
            title: task.title,
            categories: task.categories ?? [],
            date: mail?.receivedDateTime ?? task.createdDateTime,
            from: mail?.from?.emailAddress?.address ?? null,
            fromName: mail?.from?.emailAddress?.name ?? null,
            summary: mail?.bodyPreview?.replace(/\s+/g, ' ').trim() ?? null,
            extId: lr?.externalId ?? null,
            dueDate: task.dueDateTime?.dateTime ?? null,
            importance: task.importance,
          };
        });

        const matched = items.filter((i) => i.from !== null).length;

        // 5. Write cache
        const cache = {
          updated: new Date().toISOString(),
          counts: {
            flaggedEmails: items.length,
            matched,
            unmatched: items.length - matched,
            total: items.length,
          },
          flaggedEmails: items,
        };

        writeFileSync(outputPath, JSON.stringify(cache, null, 2), 'utf8');
        logger.info(`update-todo-cache: cache written to ${outputPath}`);

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                { success: true, updated: cache.updated, counts: cache.counts },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        logger.error(`update-todo-cache failed: ${error}`);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ error: (error as Error).message }),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
