# Changelog — ms-365-mcp-server

## [fork-1.8.0] - 2026-03-23

### Added
- 4 new endpoints (total: 315 endpoints, up from 312)
  - OneDrive: get-drive-item-by-path — navigate by path instead of item ID (1)
  - OneDrive: get-special-drive-folder — access special folders (documents, photos, etc.) (1)
  - Directory: list-org-contacts — Exchange GAL organization contacts (1)
  - Teams: send-teams-activity-notification — send in-app Teams notifications (1)

### Fixed
- B1: `login` tool catch block now returns `isError: true` (was silently failing)
- B1: `logout` catch block now includes error details + `isError: true`
- B3: `console.log` in auth.ts device code callback replaced with `process.stderr.write` (was breaking MCP stdio protocol)
- `verify-login` tool now has try/catch with `isError: true` on failure
- Removed company name from custom-tools.ts comments (public repo)

## [fork-1.7.0] - 2026-03-23

### Added
- 9 new endpoints across 7 groups (total: 312 endpoints, up from 303)
  - Users: list-user-member-of — group membership lookup (1)
  - Teams: list-teams-app-catalog, clone-team (2)
  - Calendar: list-calendar-groups, create-calendar-group (2)
  - Users: list-user-license-details (1)
  - Excel: add-excel-table-column (1)
  - OneDrive: search-drive-folder — search within specific folder (1)

## [fork-1.6.0] - 2026-03-23

### Added
- 14 new endpoints across 9 groups (total: 303 endpoints, up from 289)
  - Calendar: get-schedule — free/busy schedule lookup (1)
  - Org chart: get-user-manager, list-user-direct-reports (2)
  - Excel: add-excel-table-row, list-excel-named-items, get-excel-named-item (3)
  - Groups: list/add/remove-group-owner (3)
  - OneDrive: list-drive-item-thumbnails, list-drive-item-activities (2)
  - Directory: create-guest-invitation, list-deleted-items, restore-deleted-item (3)

### Fixed
- B6: `get-mail-mime-content` acceptType corrected from `text/plain` to `message/rfc822`
- 5 endpoints with empty `workScopes: []` now have proper `scopes` (add-excel-table-row, list-drive-item-thumbnails, list-drive-item-activities, list-excel-named-items, get-excel-named-item)
- `get-schedule` changed from `workScopes` to `scopes` (is a `/me/` endpoint, works with personal accounts)
- 15 endpoints with empty `workScopes` fixed in prior commit (proper scopes added)

## [fork-1.5.0] - 2026-03-23

### Added
- 23 new endpoints across 10 groups (total: 289 endpoints, up from 267)
  - User presence: get-my-presence, get-user-presence, set-my-presence (3)
  - Change notifications: create/list/renew/delete-subscription (4)
  - Group CRUD: create/update/delete-group (3)
  - Planner: update-planner-plan-details (1)
  - Mail: get-mail-mime-content (1)
  - Outlook insights: list-trending-files, list-used-files, list-shared-insights (3)
  - Calendar permissions: list/update/delete-calendar-permission (3)
  - Profile photo: get/update-profile-photo (2)
  - Meeting rooms: list-meeting-rooms, list-room-lists (2)
  - Mail tips: get-mail-tips (1)

### Fixed
- Removed duplicate `list-meeting-recordings` entry (B5)
- 1 endpoint missing llmTip (delete-subscription)

## [fork-1.4.0] - 2026-03-23

### Added
- 29 new endpoints across 18 groups (total: 267 endpoints, up from 238)
  - OneDrive: share-drive-item, remove-drive-item-permission, get-folder-delta, restore-drive-item-version (4)
  - Mail: copy-mail-message, list-shared-mailbox-folders, create-mail-attachment-upload-session (3)
  - Calendar: get/delete-event-attachment, snooze/dismiss-reminder (4)
  - Excel: get-excel-worksheet, create/update/delete-excel-table, create/close-excel-session (6)
  - Teams: update/delete-team-tag, team tag members CRUD, install/uninstall-team-app, list-chat-tabs (8)
  - Meetings: list/get-meeting-recording (2)
  - SharePoint: list/get-site-content-type (2)

### Fixed
- 4 endpoints missing llmTip (delete-event-attachment, delete-team-tag, get-meeting-recording, get-site-content-type)

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

## [0.1.0] - 2026-03-23

---

