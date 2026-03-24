import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

/**
 * Mail-folder MCP tool tests.
 * Strategy: same as graph-tools.test.ts — mock GraphClient.graphRequest,
 * register tools via registerGraphTools, invoke handlers directly.
 */

// Mock logger
vi.mock('../logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// Mock generated client
const mockEndpoints: any[] = [];
vi.mock('../generated/client.js', () => ({
  api: {
    get endpoints() {
      return mockEndpoints;
    },
  },
}));

// Mock endpoints.json
let mockEndpointsJson: any[] = [];
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    readFileSync: (filePath: string, encoding?: string) => {
      if (typeof filePath === 'string' && filePath.includes('endpoints.json')) {
        return JSON.stringify(mockEndpointsJson);
      }
      return actual.readFileSync(filePath, encoding as any);
    },
  };
});

// Mock tool-categories
vi.mock('../tool-categories.js', () => ({
  TOOL_CATEGORIES: {},
}));

// ---------- helpers ----------

function makeEndpoint(overrides: Partial<any> = {}) {
  return {
    method: 'get',
    path: '/me/mailFolders',
    alias: 'list-mail-folders',
    description: 'List mail folders',
    requestFormat: 'json' as const,
    parameters: [
      { name: 'filter', type: 'Query', schema: z.string().optional() },
      { name: 'top', type: 'Query', schema: z.number().optional() },
      { name: 'select', type: 'Query', schema: z.string().optional() },
    ],
    response: z.any(),
    ...overrides,
  };
}

function makeConfig(overrides: Partial<any> = {}) {
  return {
    pathPattern: '/me/mailFolders',
    method: 'get',
    toolName: 'list-mail-folders',
    scopes: ['Mail.Read'],
    ...overrides,
  };
}

function createMockGraphClient(responses?: any[]) {
  const responseQueue = [...(responses || [])];
  return {
    graphRequest: vi.fn().mockImplementation(async () => {
      if (responseQueue.length > 0) return responseQueue.shift();
      return { content: [{ type: 'text', text: JSON.stringify({ value: [] }) }] };
    }),
  };
}

async function loadModule() {
  vi.resetModules();
  return await import('../graph-tools.js');
}

function createMockServer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools = new Map<
    string,
    { description: string; schema: any; handler: (...args: unknown[]) => unknown }
  >();
  return {
    tool: vi.fn(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (
        name: string,
        description: string,
        schema: any,
        annotations: any,
        handler: (...args: unknown[]) => unknown
      ) => {
        tools.set(name, { description, schema, handler });
      }
    ),
    tools,
  };
}

// ========== TESTS ==========

describe('mail-folders MCP tools', () => {
  beforeEach(() => {
    mockEndpoints.length = 0;
    mockEndpointsJson = [];
    vi.clearAllMocks();
  });

  // ---- 1. Happy path: list mail folders ----
  describe('list-mail-folders — happy path', () => {
    it('should call graphRequest with correct path and return folders', async () => {
      const endpoint = makeEndpoint();
      const config = makeConfig();
      mockEndpoints.push(endpoint);
      mockEndpointsJson = [config];

      const folders = {
        value: [
          { id: 'inbox-id', displayName: 'Inbox' },
          { id: 'drafts-id', displayName: 'Drafts' },
        ],
      };
      const graphClient = createMockGraphClient([
        { content: [{ type: 'text', text: JSON.stringify(folders) }] },
      ]);

      const server = createMockServer();
      const { registerGraphTools } = await loadModule();
      registerGraphTools(server as any, graphClient as any);

      const tool = server.tools.get('list-mail-folders');
      expect(tool).toBeDefined();

      const result = await tool!.handler({ top: 10, select: 'id,displayName' });

      expect(graphClient.graphRequest).toHaveBeenCalledTimes(1);
      const [url] = graphClient.graphRequest.mock.calls[0];
      expect(url).toContain('/me/mailFolders');
      expect(url).toContain('$top=10');
      expect(url).toContain('$select=id,displayName');

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.value).toHaveLength(2);
      expect(parsed.value[0].displayName).toBe('Inbox');
    });

    it('should pass OData $filter through to the request', async () => {
      const endpoint = makeEndpoint();
      const config = makeConfig();
      mockEndpoints.push(endpoint);
      mockEndpointsJson = [config];

      const graphClient = createMockGraphClient([
        {
          content: [
            { type: 'text', text: JSON.stringify({ value: [{ id: 'f1', displayName: 'Work' }] }) },
          ],
        },
      ]);

      const server = createMockServer();
      const { registerGraphTools } = await loadModule();
      registerGraphTools(server as any, graphClient as any);

      const tool = server.tools.get('list-mail-folders');
      await tool!.handler({ filter: "displayName eq 'Work'" });

      const [url] = graphClient.graphRequest.mock.calls[0];
      expect(url).toContain('$filter=');
      expect(url).toContain('displayName');
      expect(url).toContain('Work');
    });
  });

  // ---- 2. Path parameter interpolation ----
  describe('list-mail-child-folders — path param interpolation', () => {
    it('should interpolate mailFolder-id into the request path', async () => {
      const endpoint = makeEndpoint({
        alias: 'list-mail-child-folders',
        path: '/me/mailFolders/:mailFolderId/childFolders',
        parameters: [
          { name: 'mailFolderId', type: 'Path', schema: z.string() },
          { name: 'top', type: 'Query', schema: z.number().optional() },
        ],
      });
      const config = makeConfig({
        toolName: 'list-mail-child-folders',
        pathPattern: '/me/mailFolders/{mailFolder-id}/childFolders',
      });
      mockEndpoints.push(endpoint);
      mockEndpointsJson = [config];

      const graphClient = createMockGraphClient([
        {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ value: [{ id: 'child-1', displayName: 'Sub' }] }),
            },
          ],
        },
      ]);

      const server = createMockServer();
      const { registerGraphTools } = await loadModule();
      registerGraphTools(server as any, graphClient as any);

      const tool = server.tools.get('list-mail-child-folders');
      expect(tool).toBeDefined();

      await tool!.handler({ 'mailFolder-id': 'parent-folder-123', top: 5 });

      const [url] = graphClient.graphRequest.mock.calls[0];
      expect(url).toContain('parent-folder-123');
      expect(url).toContain('/childFolders');
      expect(url).not.toContain(':mailFolderId');
      expect(url).not.toContain('{mailFolder-id}');
    });
  });

  // ---- 3. Error response ----
  describe('error responses', () => {
    it('should return isError: true when graphRequest returns an error', async () => {
      const endpoint = makeEndpoint();
      const config = makeConfig();
      mockEndpoints.push(endpoint);
      mockEndpointsJson = [config];

      const graphClient = createMockGraphClient([
        {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: { code: 'ErrorAccessDenied', message: 'Access is denied.' },
              }),
            },
          ],
          isError: true,
        },
      ]);

      const server = createMockServer();
      const { registerGraphTools } = await loadModule();
      registerGraphTools(server as any, graphClient as any);

      const tool = server.tools.get('list-mail-folders');
      const result = await tool!.handler({});

      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.error.code).toBe('ErrorAccessDenied');
    });
  });
});
