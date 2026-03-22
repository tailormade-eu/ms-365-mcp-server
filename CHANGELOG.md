# Changelog — ms-365-mcp-server

## [fork-1.1.0] - 2026-03-22

### Added
- 12 new endpoints: OneNote individual page ops (get/delete/update), group/Teams notebook ops (5), meeting management (create/get/attendance), channel creation
- `acceptType: "text/html"` for get-onenote-page-content
- `workScopes` for all 6 existing OneNote endpoints (org-only access)
- OData param fixes: kebab-case path params, auto-inject missing path params, comma preservation, key encoding

### Fixed
- Test assertions: URL encoding expectations aligned with actual Graph API behavior ($expand not %24expand)
- Hardcoded email removed from custom-tools.ts — account param now required
- XML injection: added missing `&` escape in EWS search parameter
- beta-get tool: added missing readOnlyHint annotation
- Removed external URL reference from list-users llmTip (self-containment)
- list-online-meetings llmTip: warns about Teams-client meetings limitation
- Removed client name from create-todo-task-list llmTip example (public repo)

## [fork-1.0.0] - 2026-03-22

### Added
- Planner task details endpoint (get-planner-task-details)
- Meeting recording endpoints
- llmTips for all 111 Graph API tools
- Parameter describe() overrides for OData and path parameters
- Unit tests for critical Graph API tool logic (83 tests)
- CLAUDE.md with architecture documentation
- Path param describe() lookup map (17 known params with actionable guidance)
- get-archive-messages (EWS), beta-get, update-todo-cache custom tools

### Fixed
- Silent catch blocks in graph-tools.ts now log properly
- llmTip deduplication — removed redundant $select/pagination from mail tools
- Self-containment gaps in planner and sharepoint llmTips
