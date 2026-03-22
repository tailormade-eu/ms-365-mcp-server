# Changelog — ms-365-mcp-server

## [Unreleased]

### Fixed
- Test assertions: URL encoding expectations aligned with actual Graph API behavior ($expand not %24expand)
- Hardcoded email removed from custom-tools.ts — account param now required
- XML injection: added missing `&` escape in EWS search parameter
- beta-get tool: added missing readOnlyHint annotation
- Removed external URL reference from list-users llmTip (self-containment)

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
