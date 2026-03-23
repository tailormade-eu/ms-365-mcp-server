import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock fs before any imports that use it
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return { ...actual, writeFileSync: vi.fn() };
});

import { normalizeSubject, registerCustomTools } from '../src/custom-tools.js';
import { writeFileSync } from 'fs';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Capture tool handlers registered via server.tool() */
function createMockServer() {
  const handlers = new Map<string, { handler: Function; schema: Record<string, unknown> }>();
  const server = {
    tool: vi.fn(
      (
        name: string,
        _description: string,
        schema: Record<string, unknown>,
        _annotations: unknown,
        handler: Function
      ) => {
        handlers.set(name, { handler, schema });
      }
    ),
  } as unknown as McpServer;
  return { server, handlers };
}

function createMockGraphClient(makeRequestFn: Function = vi.fn()) {
  return {
    makeRequest: makeRequestFn,
    graphRequest: vi.fn(async (endpoint: string, options: Record<string, unknown> = {}) => {
      const result = await makeRequestFn(endpoint, options);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }),
  } as any;
}

function createMockAuthManager(opts?: {
  oauthEnabled?: boolean;
  token?: string | undefined;
}) {
  return {
    isOAuthModeEnabled: vi.fn().mockReturnValue(opts?.oauthEnabled ?? false),
    getTokenForAccount: vi.fn().mockResolvedValue(opts?.token ?? undefined),
  } as any;
}

// ─── normalizeSubject ─────────────────────────────────────────────────────

describe('normalizeSubject', () => {
  it.each([
    ['', ''],
    [undefined, ''],
    ['Re: Invoice', 'invoice'],
    ['FW: Invoice', 'invoice'],
    ['Fwd: Invoice', 'invoice'],
    ['TR: Invoice', 'invoice'],
    ['AW: Invoice', 'invoice'],
    ['invoice', 'invoice'],
    ['  Multiple   Spaces  ', 'multiple spaces'],
    ['re: Invoice', 'invoice'],
    ['Re: Re: Invoice', 'invoice'],
    ['FW: Re: Invoice', 'invoice'],
    ['Re: FW: Re: Invoice', 'invoice'],
  ])('normalizeSubject(%j) → %j', (input, expected) => {
    expect(normalizeSubject(input as string | undefined)).toBe(expected);
  });
});

// ─── get-archive-messages ─────────────────────────────────────────────────

describe('get-archive-messages', () => {
  const originalFetch = global.fetch;
  let handler: Function;

  beforeEach(() => {
    global.fetch = vi.fn();
    delete process.env.EWS_CLIENT_ID;
    delete process.env.EWS_CLIENT_SECRET;
    delete process.env.EWS_TENANT_ID;

    const { server, handlers } = createMockServer();
    registerCustomTools(server, createMockGraphClient());
    handler = handlers.get('get-archive-messages')!.handler;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('missing env vars → isError', async () => {
    const result = await handler({});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('EWS_CLIENT_ID');
  });

  it('EWS token fetch fails → isError', async () => {
    process.env.EWS_CLIENT_ID = 'id';
    process.env.EWS_CLIENT_SECRET = 'secret';
    process.env.EWS_TENANT_ID = 'tenant';
    (global.fetch as any).mockResolvedValue({
      ok: false,
      text: async () => 'Unauthorized',
    });
    const result = await handler({ account: 'user@test.com' });
    expect(result.isError).toBe(true);
  });

  it('FindFolder returns no folders → isError', async () => {
    process.env.EWS_CLIENT_ID = 'id';
    process.env.EWS_CLIENT_SECRET = 'secret';
    process.env.EWS_TENANT_ID = 'tenant';

    let callCount = 0;
    (global.fetch as any).mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        // Token fetch
        return { ok: true, json: async () => ({ access_token: 'tok123' }) };
      }
      // FindFolder — no folder IDs
      return { ok: true, text: async () => '<soap:Body><m:FindFolderResponse></m:FindFolderResponse></soap:Body>' };
    });

    const result = await handler({ account: 'user@test.com' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('archive folders');
  });

  it('successful flow returns items array', async () => {
    process.env.EWS_CLIENT_ID = 'id';
    process.env.EWS_CLIENT_SECRET = 'secret';
    process.env.EWS_TENANT_ID = 'tenant';

    let callCount = 0;
    (global.fetch as any).mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return { ok: true, json: async () => ({ access_token: 'tok123' }) };
      }
      if (callCount === 2) {
        // FindFolder
        return {
          ok: true,
          text: async () => '<t:FolderId Id="AAA123"/>',
        };
      }
      // FindItem
      return {
        ok: true,
        text: async () =>
          `<t:Message>
            <t:ItemId Id="MSG1"/>
            <t:Subject>Test Subject</t:Subject>
            <t:EmailAddress>sender@test.com</t:EmailAddress>
            <t:DateTimeReceived>2026-01-15T10:00:00Z</t:DateTimeReceived>
          </t:Message>`,
      };
    });

    const result = await handler({ account: 'user@test.com' });
    expect(result.isError).toBeUndefined();
    const items = JSON.parse(result.content[0].text);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: 'MSG1',
      subject: 'Test Subject',
      from: 'sender@test.com',
      received: '2026-01-15T10:00:00Z',
    });
  });
});

// ─── update-todo-cache ────────────────────────────────────────────────────

describe('update-todo-cache', () => {
  let handler: Function;
  let makeRequestMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.mocked(writeFileSync).mockReset();
    makeRequestMock = vi.fn();
    const graphClient = createMockGraphClient(makeRequestMock);
    const authManager = createMockAuthManager();
    const { server, handlers } = createMockServer();
    registerCustomTools(server, graphClient, authManager);
    handler = handlers.get('update-todo-cache')!.handler;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('flaggedEmails list not found → isError', async () => {
    makeRequestMock.mockResolvedValue({ value: [] });
    const result = await handler({ outputPath: './todo-cache.json' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Flagged Emails todo list not found');
  });

  it('successful cache write', async () => {
    makeRequestMock.mockImplementation(async (endpoint: string) => {
      if (endpoint === '/me/todo/lists') {
        return {
          value: [
            { id: 'list1', wellknownListName: 'flaggedEmails', displayName: 'Flagged' },
          ],
        };
      }
      if (endpoint.startsWith('/me/todo/lists/list1/tasks')) {
        return {
          value: [
            {
              id: 't1',
              title: 'Invoice ABC',
              status: 'notStarted',
              importance: 'normal',
              categories: [],
              createdDateTime: '2026-01-01T10:00:00Z',
            },
          ],
        };
      }
      if (endpoint.startsWith('/me/messages')) {
        return {
          value: [
            {
              id: 'm1',
              subject: 'Invoice ABC',
              from: { emailAddress: { address: 'test@example.com', name: 'Test' } },
              receivedDateTime: '2026-01-01T09:00:00Z',
              bodyPreview: 'Preview text',
              categories: [],
            },
          ],
        };
      }
      return { value: [] };
    });

    const result = await handler({ outputPath: './todo-cache.json' });
    expect(result.isError).toBeUndefined();
    expect(writeFileSync).toHaveBeenCalledOnce();

    const writtenJson = JSON.parse((writeFileSync as any).mock.calls[0][1]);
    expect(writtenJson.counts).toMatchObject({
      flaggedEmails: 1,
      matched: 1,
      unmatched: 0,
      total: 1,
    });
  });
});

// ─── beta-get ────────────────────────────────────────────────────────────

describe('beta-get', () => {
  let handler: Function;
  let makeRequestMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    makeRequestMock = vi.fn();
    const graphClient = createMockGraphClient(makeRequestMock);
    const authManager = createMockAuthManager();
    const { server, handlers } = createMockServer();
    registerCustomTools(server, graphClient, authManager);
    handler = handlers.get('beta-get')!.handler;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successful GET returns parsed JSON', async () => {
    makeRequestMock.mockResolvedValue({ displayName: 'Test User' });
    const result = await handler({ endpoint: '/me/profile' });
    expect(result.isError).toBeUndefined();
    expect(JSON.parse(result.content[0].text)).toEqual({ displayName: 'Test User' });
  });

  it('makeRequest throws → isError', async () => {
    makeRequestMock.mockRejectedValue(new Error('Graph error'));
    const result = await handler({ endpoint: '/me/profile' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Graph error');
  });
});
