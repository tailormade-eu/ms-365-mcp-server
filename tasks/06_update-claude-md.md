---
title: Create CLAUDE.md with architecture and patterns
output: CLAUDE.md
depends_on: 05_improve-parameter-describes, 07_fix-silent-catches
verify: test -f CLAUDE.md
---

Read `src/endpoints.json`, `src/graph-tools.ts`, `src/server.ts`, `docs/audit-report.md`.

Create `CLAUDE.md` in the project root documenting:

## Architecture
- How endpoints.json → graph-tools.ts → MCP tools pipeline works
- Role of llmTip, EndpointConfig fields (scopes, workScopes, returnDownloadUrl, supportsTimezone, llmTip)
- Auto-pagination via @odata.nextLink (up to 100 pages)
- How $count=true enables advanced query mode

## Adding/improving a tool
- How to add llmTip to endpoints.json
- How to add parameter describe() override in graph-tools.ts
- Always run `npm run build` after changes

## Known Graph API quirks (summary)
- $filter + $search cannot combine
- $count=true required for complex filters
- flaggedItems folderId + $search = unreliable flag status
- update-mail-message: body wrapper required
- Special folder IDs list

## Development
- Build: `npm run build`
- Entry: src/server.ts → src/graph-tools.ts → src/endpoints.json
