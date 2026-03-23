# Changelog — ms-365-mcp-server

## [fork-1.3.0] - 2026-03-23

### Added
- 25 new endpoints across 17 groups (total: 238 endpoints, up from 214)
  - Users: get-user by ID (1)
  - Calendar event attachments: list + add (2)
  - Excel: update-excel-range, list tables + table rows, create/delete worksheets (5)
  - Outlook categories: create/update/delete (3)
  - Teams: update-team, team tags, channel tabs, archive/unarchive (6)
  - Groups: list-group-planner-plans, list-group-events (2)
  - SharePoint: list columns, create list, list site pages (3)
  - OneDrive: drive item versions + permissions (2)
  - OneDrive search: search-drive (1)

### Fixed
- **CRITICAL: 108 endpoints were dead config** — registration loop only iterated over generated client (130 entries), silently ignoring all endpoints.json-only entries. Added second registration loop for synthetic tool objects.
- 2 endpoints missing llmTip (delete-outlook-category, unarchive-team)

## [fork-1.2.0] - 2026-03-23

### Added
- 62 new endpoints across 22 categories (total: 214 endpoints, up from 153)
  - Planner: full CRUD for plans, buckets, tasks + plan details (12 endpoints)
  - Calendar: accept/decline/tentative/cancel/forward event + calendar CRUD (9 endpoints)
  - OneDrive: get-my-drive, get/move/copy/search drive items, create folder, upload session, recent files, shared-with-me (10 endpoints)
  - Teams: create team, chat management, channel members CRUD, team apps (9 endpoints)
  - SharePoint: list item CRUD (create/update/delete) (3 endpoints)
  - Groups: list/get groups, list members, get group drive (4 endpoints)
  - Mail: get-mail-folder, message rules CRUD (4 endpoints)
  - Contacts: full contact folder CRUD + list contacts in folder (6 endpoints)
  - Online meetings: update/delete meeting, attendance reports + participants (4 endpoints)
- 12 new pathParamDescriptions with actionable guidance (groupId, channelId, plannerPlanId, etc.)
- Removed duplicate `get-root-folder` endpoint (kept `get-drive-root-item` as canonical)

### Fixed
- 4 endpoints missing llmTip (delete-sharepoint-site-list-item, get-planner-bucket, get/delete-contact-folder)
- update-sharepoint-site-list-item llmTip referenced non-existent tool
- update-planner-plan llmTip referenced non-existent GET endpoint

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
