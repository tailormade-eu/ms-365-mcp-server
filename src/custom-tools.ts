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
  // ── get-archive-messages ──────────────────────────────────────────────────
  server.tool(
    'get-archive-messages',
    `Search or list messages in the In-Place Archive (Online Archive) mailbox.

Uses EWS (Exchange Web Services) — the only API that can access the In-Place Archive.
Graph API /me/mailFolders cannot reach archive mailboxes.

How it works:
1. Fetches an app-only EWS token (outlook.office365.com scope)
2. FindFolder(Shallow) on archivemsgfolderroot → real folder IDs
3. FindItem(Shallow) on all folders with optional subject Restriction

Returns: [{id, subject, from, received}]

⚠️ Requires env vars: EWS_CLIENT_ID, EWS_CLIENT_SECRET, EWS_TENANT_ID
⚠️ Azure app needs "full_access_as_app" on Office 365 Exchange Online (not just Graph)
💡 search filters on subject substring — not full-text body search`,
    {
      account: z
        .string()
        .describe('Mailbox email address to impersonate (e.g. jara@tailormade.eu).')
        .optional(),
      search: z
        .string()
        .describe('Subject substring filter, e.g. "hoy.be". Optional.')
        .optional(),
      top: z
        .number()
        .describe('Max results per folder (default 25, max 999).')
        .optional(),
    },
    {
      title: 'get-archive-messages',
      readOnlyHint: true,
      openWorldHint: true,
    },
    async ({ account, search, top }) => {
      try {
        const clientId = process.env.EWS_CLIENT_ID;
        const clientSecret = process.env.EWS_CLIENT_SECRET;
        const tenantId = process.env.EWS_TENANT_ID;

        if (!clientId || !clientSecret || !tenantId) {
          throw new Error('EWS_CLIENT_ID, EWS_CLIENT_SECRET and EWS_TENANT_ID env vars required');
        }

        const userEmail = account ?? 'jara@tailormade.eu';
        const limit = top ?? 25;

        // EWS token — different scope from Graph
        const tokenBody = new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'https://outlook.office365.com/.default',
        });

        const tokenRes = await fetch(
          `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
          { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: tokenBody.toString() }
        );
        if (!tokenRes.ok) throw new Error(`EWS token failed: ${await tokenRes.text()}`);
        const { access_token } = (await tokenRes.json()) as { access_token: string };

        const ewsHeaders = {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'text/xml; charset=utf-8',
          'X-AnchorMailbox': userEmail,
        };

        const soapHeader = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
               xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages">
  <soap:Header>
    <t:RequestServerVersion Version="Exchange2013_SP1"/>
    <t:ExchangeImpersonation>
      <t:ConnectingSID>
        <t:PrimarySmtpAddress>${userEmail}</t:PrimarySmtpAddress>
      </t:ConnectingSID>
    </t:ExchangeImpersonation>
  </soap:Header>`;

        // Step 1: FindFolder (Shallow) on archivemsgfolderroot → real folder IDs
        const findFolderSoap = `${soapHeader}
  <soap:Body>
    <m:FindFolder Traversal="Shallow">
      <m:FolderShape><t:BaseShape>IdOnly</t:BaseShape></m:FolderShape>
      <m:ParentFolderIds>
        <t:DistinguishedFolderId Id="archivemsgfolderroot"/>
      </m:ParentFolderIds>
    </m:FindFolder>
  </soap:Body>
</soap:Envelope>`;

        const ffRes = await fetch('https://outlook.office365.com/EWS/Exchange.asmx', {
          method: 'POST',
          headers: { ...ewsHeaders, 'SOAPAction': '"http://schemas.microsoft.com/exchange/services/2006/messages/FindFolder"' },
          body: findFolderSoap,
        });
        const ffText = await ffRes.text();
        if (!ffRes.ok) throw new Error(`FindFolder failed (${ffRes.status}): ${ffText}`);

        // Extract folder IDs from FindFolder response
        const folderIds: string[] = [];
        const folderIdRegex = /<t:FolderId Id="([^"]+)"/g;
        let fm;
        while ((fm = folderIdRegex.exec(ffText)) !== null) {
          folderIds.push(fm[1]);
        }
        if (folderIds.length === 0) throw new Error(`No archive folders found. FindFolder response:\n${ffText}`);

        // Step 2: FindItem (Deep) on real folder IDs
        const restriction = search
          ? `<m:Restriction>
              <t:Contains ContainmentMode="Substring" ContainmentComparison="IgnoreCase">
                <t:FieldURI FieldURI="item:Subject"/>
                <t:Constant Value="${search.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}"/>
              </t:Contains>
            </m:Restriction>`
          : '';

        const parentFolders = folderIds
          .map(id => `<t:FolderId Id="${id}"/>`)
          .join('\n        ');

        const findItemSoap = `${soapHeader}
  <soap:Body>
    <m:FindItem Traversal="Shallow">
      <m:ItemShape>
        <t:BaseShape>IdOnly</t:BaseShape>
        <t:AdditionalProperties>
          <t:FieldURI FieldURI="item:Subject"/>
          <t:FieldURI FieldURI="item:DateTimeReceived"/>
          <t:FieldURI FieldURI="message:From"/>
        </t:AdditionalProperties>
      </m:ItemShape>
      <m:IndexedPageItemView MaxEntriesReturned="${limit}" Offset="0" BasePoint="Beginning"/>
      ${restriction}
      <m:ParentFolderIds>
        ${parentFolders}
      </m:ParentFolderIds>
    </m:FindItem>
  </soap:Body>
</soap:Envelope>`;

        const ewsRes = await fetch('https://outlook.office365.com/EWS/Exchange.asmx', {
          method: 'POST',
          headers: { ...ewsHeaders, 'SOAPAction': '"http://schemas.microsoft.com/exchange/services/2006/messages/FindItem"' },
          body: findItemSoap,
        });

        const ewsText = await ewsRes.text();
        if (!ewsRes.ok) throw new Error(`FindItem failed (${ewsRes.status}): ${ewsText}`);

        // Parse XML response — extract Message items
        const items: Array<{ id: string; subject: string; from: string; received: string }> = [];
        const itemRegex = /<t:Message>([\s\S]*?)<\/t:Message>/g;
        let match;
        while ((match = itemRegex.exec(ewsText)) !== null) {
          const block = match[1];
          const id = (/<t:ItemId Id="([^"]+)"/.exec(block) ?? [])[1] ?? '';
          const subject = (/<t:Subject>(.*?)<\/t:Subject>/.exec(block) ?? [])[1] ?? '';
          const from = (/<t:EmailAddress>(.*?)<\/t:EmailAddress>/.exec(block) ?? [])[1] ?? '';
          const received = (/<t:DateTimeReceived>(.*?)<\/t:DateTimeReceived>/.exec(block) ?? [])[1] ?? '';
          items.push({ id, subject, from, received });
        }

        return {
          content: [{ type: 'text' as const, text: JSON.stringify(items, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: (error as Error).message }) }],
          isError: true,
        };
      }
    }
  );

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

  // ── beta-get (temporary debug tool) ─────────────────────────────────────────
  server.tool(
    'beta-get',
    `Debug tool: GET any Graph endpoint using the /beta API version instead of v1.0.
Returns the raw JSON response — useful for discovering undocumented properties.`,
    {
      endpoint: z
        .string()
        .describe('Graph endpoint path, e.g. /me/todo/lists/{id}/tasks/{id}'),
      account: z
        .string()
        .describe('Account email')
        .optional(),
    },
    async ({ endpoint, account }) => {
      try {
        const accessToken = account
          ? await authManager?.getTokenForAccount(account)
          : undefined;

        const result = await graphClient.makeRequest(endpoint, {
          accessToken,
          useBeta: true,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
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
