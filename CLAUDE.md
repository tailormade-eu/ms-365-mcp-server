# MS-365 MCP Server

MCP server that exposes Microsoft Graph API as LLM-callable tools.

## Architecture

### Pipeline: endpoints.json → graph-tools.ts → MCP tools

1. **`src/endpoints.json`** — Declarative config for all 111 Graph API tools. Each entry defines:
   - `pathPattern` — Graph API path (e.g. `/me/messages`)
   - `method` — HTTP method
   - `toolName` — MCP tool name (e.g. `list-mail-messages`)
   - `scopes` — Required Microsoft Graph delegated permissions (personal accounts)
   - `workScopes` — Work/org account scopes (tool skipped in non-org mode if only workScopes)
   - `returnDownloadUrl` — Strips `/content` suffix and returns `@microsoft.graph.downloadUrl` instead of raw bytes
   - `supportsTimezone` — Injects `timezone` parameter, sets `Prefer: outlook.timezone=` header
   - `supportsExpandExtendedProperties` — Injects `expandExtendedProperties` parameter
   - `llmTip` — Free-text guidance appended to tool description as `💡 TIP:`. This is the primary way to teach LLMs about Graph API quirks, required formats, and best practices
   - `skipEncoding` — Parameter names to skip URL-encoding (for function-style API calls)
   - `contentType` — Override Content-Type header (e.g. `text/html` for OneNote)

2. **`src/graph-tools.ts`** — Registration engine. For each endpoint:
   - Builds Zod parameter schema from generated client + custom `.describe()` overrides
   - Injects control parameters: `fetchAllPages`, `includeHeaders`, `excludeResponse`, `account`, `timezone`, `expandExtendedProperties`
   - Appends `llmTip` to tool description
   - Handles OData parameter normalization (`filter` ↔ `$filter`)
   - Registers tool on MCP server with `executeGraphTool()` handler

3. **`src/server.ts`** — Entry point. Creates MCP server, initializes auth + GraphClient, calls `registerGraphTools()`. Supports stdio and HTTP/OAuth transport modes.

### Auto-pagination

`fetchAllPages=true` triggers automatic pagination via `@odata.nextLink`. Follows up to **100 pages**, concatenating `.value` arrays. Results returned as single combined response.

### Advanced query mode ($count=true)

Setting `$count=true` adds `ConsistencyLevel: eventual` header, which enables:
- Complex `$filter` expressions (e.g. `flag/flagStatus`, `contains()`, sender address)
- Without it, many filters return `InefficientFilter` errors

### Discovery mode

`--discovery` flag registers only 2 tools: `search-tools` + `execute-tool`. The LLM searches the registry first, then executes by name. Useful for clients with tool count limits.

## Adding / improving a tool

### Add or update llmTip in endpoints.json

Find the tool entry in `src/endpoints.json` and add/edit the `llmTip` field:
```json
{
  "toolName": "my-tool",
  "llmTip": "CRITICAL: Describe the quirk or required format here. Keep it actionable."
}
```
Tips appear in the tool description. Use `CRITICAL:` prefix for must-know info. Include examples.

### Add parameter describe() override in graph-tools.ts

In `registerGraphTools()`, add a block after the existing OData overrides (~line 478):
```typescript
if (paramSchema['myParam'] !== undefined) {
  paramSchema['myParam'] = z.string().describe('Your guidance here').optional();
}
```

### Add a new endpoint

1. Add entry to `src/endpoints.json` with all required fields
2. Run `npm run generate` if the Graph API path needs a new generated client endpoint
3. Run `npm run build` to verify

### After any change

Always run `npm run build` after changes. Full verification: `npm run verify`.

## Known Graph API quirks

### Query limitations
- `$filter` + `$search` **cannot combine** — use one or the other
- `$orderby` is **ignored** when `$search` is used (results sorted by relevance)
- `$count=true` **required** for complex filters (flag/flagStatus, contains(), sender address)
- Contacts `$filter` only supports `startswith()` on givenName/surname/displayName

### Mail
- `flaggedItems` folderId + `$search` = **unreliable flag status** — use `$filter` with `$count=true` instead
- `update-mail-message`: body requires wrapper `{ body: { contentType: "text", content: "..." } }`
- `move-mail-message` requires folder **ID**, not name — use `list-mail-folders` first
- Well-known folder IDs: `inbox`, `drafts`, `sentitems`, `deleteditems`, `junkemail`, `archive`
- Attachments limited to 3MB (larger needs upload session, not exposed)

### Calendar
- `list-calendar-events` returns seriesMasters only, NOT expanded recurring instances — use `get-calendar-view` for "what's on my calendar"
- DateTime format: ISO 8601 with `timeZone` object

### Files
- `upload-file-content` PUT limited to **4MB** (larger needs createUploadSession, not exposed)
- `download-onedrive-file-content` returns download URL, not actual content (due to `returnDownloadUrl: true`)
- `get-drive-root-item` and `get-root-folder` are duplicates

### Planner
- `update-planner-task` and `update-planner-task-details` require **If-Match ETag header** — GET first, extract `@odata.etag`, pass as If-Match. Returns 412 without it.

### Teams/Chat
- All message bodies require HTML contentType: `{ body: { contentType: "html", content: "<p>text</p>" } }`

### OneNote
- Page creation requires full HTML structure: `<html><head><title>Title</title></head><body>content</body></html>`

### SharePoint
- List items need `$expand=fields` to get column values (without it, only metadata returned)

## Development

```
npm run build        # Build with tsup
npm run test         # Run tests (vitest)
npm run verify       # Full: generate + lint + format check + build + test
npm run dev          # Dev mode (tsx)
npm run dev:http     # Dev HTTP mode with watch
npm run inspector    # MCP inspector
```

**Entry point flow:** `src/server.ts` → `src/graph-tools.ts` → `src/endpoints.json`

**Key files:**
- `src/endpoints.json` — Tool definitions (111 tools)
- `src/graph-tools.ts` — Tool registration + parameter schema + execution
- `src/server.ts` — Server bootstrap (stdio + HTTP/OAuth)
- `src/graph-client.ts` — Graph API HTTP client
- `src/auth.ts` / `src/auth-tools.ts` — Authentication (multi-account, OAuth)
- `src/generated/client.js` — Auto-generated from Graph API OpenAPI spec
- `docs/audit-report.md` — Full audit of all 111 tools with known quirks
