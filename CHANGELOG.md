# Changelog — ms-365-mcp-server

## [fork-1.16.0] - 2026-03-23

### Added
- 13 new endpoints across 7 groups (total: 429 endpoints, up from 416)
  - Presence: clear-me-presence — revert to automatic presence detection (1)
  - Calendar: get-default-calendar — default calendar metadata (1)
  - User Settings: get/update-item-insights-settings, get/update-work-hours — privacy + work schedule (4)
  - Directory: list-transitive-member-of — nested/transitive group memberships (1)
  - Teams: list-associated-teams, send-me-activity-notification — cross-org teams + activity feed (2)
  - Bookings: list-booking-businesses, create-booking-business, list-booking-currencies — Microsoft Bookings management (3)
  - Places: list-buildings — organization building directory (1)

### Fixed
- **CRITICAL: `get-default-calendar` missing scopes** — had empty `workScopes: []` and no `scopes`, making it unreachable. Added `scopes: ["Calendars.Read"]` and `workScopes: ["Calendars.Read"]`

## [fork-1.15.0] - 2026-03-23

### Added
- 12 new endpoints across 7 groups (total: 416 endpoints, up from 404)
  - Mailbox: get-mailbox-settings, update-mailbox-settings — OOF, timezone, language prefs (2)
  - Directory: list-member-of, check-member-groups, change-password, revoke-sign-in-sessions — membership + security (4)
  - Presence: set-status-message, set-preferred-presence, clear-preferred-presence — Teams status control (3)
  - Teams Apps: list-personal-apps, install-personal-app — personal app management (2)
  - Meetings: create-or-get-online-meeting — idempotent meeting creation via externalId (1)

### Fixed
- **CRITICAL: 3 duplicate insights endpoints removed** — `get-insights-used`, `get-insights-trending`, `get-insights-shared` duplicated existing `list-used-files`, `list-trending-files`, `list-shared-insights`
- `revoke-sign-in-sessions` removed unnecessary `contentType: "application/json"` (no body required)

## [fork-1.14.0] - 2026-03-23

### Added
- 8 new endpoints across 6 groups (total: 404 endpoints, up from 396)
  - Calendar: get-calendar-permission, create-calendar-permission — calendar sharing management (2)
  - Rooms: list-rooms-in-list — rooms within a specific room list (1)
  - Teams: send-team-activity-notification, update-channel-member — notifications + member role changes (2)
  - Teams Apps: get-teams-app-catalog-app — single app catalog lookup (1)
  - SharePoint: get-sharepoint-site-analytics — site activity stats (1)
  - Directory: assign-user-license — license assignment for users (1)

### Fixed
- **CRITICAL: `list-rooms-in-list` pathPattern** — corrected from `/places/roomlists/{roomList-id}/rooms` to `/places/{roomList-emailAddress}/microsoft.graph.roomList/rooms` (Graph API v1.0 correct path)

## [fork-1.13.0] - 2026-03-23

### Added
- 18 new endpoints across 7 groups (total: 396 endpoints, up from 378)
  - Calendar: list-event-instances, get/update/delete-event-exception — recurring event instance management (4)
  - Mail: list/create/get/update/delete-search-folder — virtual search folder CRUD (5)
  - Teams: get-team-primary-channel — direct primary channel access (1)
  - OneDrive: checkout/checkin/preview-drive-item — file lock and preview (3)
  - Groups: renew-group, list-group-settings — group lifecycle management (2)
  - Presence: set-user-presence, clear-user-presence — admin presence control (2)
  - Directory: assign-user-manager — set user's manager (1)

### Fixed
- **CRITICAL: `{instanceId}` path param** — changed to `{instance-id}` for kebab-case consistency with all other path params
- `set-user-presence` llmTip listed `Offline` as valid availability — removed (Graph API returns 400 for Offline)
- Winston `stderrLevels` now includes all levels (verbose, silly) — prevents stdout leakage at any LOG_LEVEL
- `get-subscription` path param fixed: `{subscriptionId}` → `{subscription-id}`
- `follow-site` expected status code corrected: 204 → 200

## [fork-1.12.0] - 2026-03-23

### Added
- 23 new endpoints across 10 groups (total: 378 endpoints, up from 355)
  - Group calendar: update-group-calendar-event, delete-group-calendar-event — complete group calendar CRUD (2)
  - Focused Inbox: list/create/update/delete-focused-inbox-override — sender classification rules (4)
  - Subscriptions: get-subscription — single subscription lookup (1)
  - Contacts: get/create/update/delete-contact-in-folder — full contact-in-folder CRUD (4)
  - Teams apps: get-team-app, list/install/uninstall-chat-app — app management for teams and chats (4)
  - Groups: get-group-conversation, get-group-thread — single conversation/thread lookup (2)
  - Teams: list-channel-messages-delta — delta sync for channel messages (1)
  - OneNote: copy-onenote-page, copy-onenote-section — copy operations (2)
  - SharePoint: list-followed-sites, follow-site, unfollow-site — site following (3)

## [fork-1.11.0] - 2026-03-23

### Added
- 20 new endpoints across 11 groups (total: 355 endpoints, up from 335)
  - People: list-people — relevant people suggestions based on collaboration patterns (1)
  - OneDrive: create-drive-item-link — create shareable links (view/edit/embed) (1)
  - OneDrive: get-drive-item-version, get-drive-item-permission — single version/permission lookup (2)
  - Group calendar: create-group-calendar-event, get-group-calendar-event, list-group-calendars (3)
  - Teams: get-team-member, update-team-member, upgrade-team-app — member management + app upgrade (3)
  - SharePoint: get-sharepoint-list-column — single column definition (1)
  - SharePoint: get/create/update/delete/publish-sharepoint-site-page — full site pages CRUD (5)
  - User settings: get-user-settings, update-user-settings — people insights config (2)
  - Excel: get-excel-table — single table definition (1)
  - Chat: update-chat — rename group chat topic (1)

### Fixed
- **4 endpoints missing scopes** — create-drive-item-link (Files.ReadWrite), get-drive-item-version (Files.Read), get-drive-item-permission (Files.Read), get-excel-table (Files.Read) all had empty scopes
- **list-people missing scopes** — added People.Read scope alongside workScopes (is /me endpoint)
- **create-link renamed** to `create-drive-item-link` for consistency with drive-item naming convention

## [fork-1.10.0] - 2026-03-23

### Added
- 19 new endpoints across 9 groups (total: 335 endpoints, up from 317)
  - Mail: list-message-rules — list inbox rules with conditions/actions (1)
  - Groups: add-group-member, remove-group-member — manage group membership (2)
  - Teams: add-channel-tab, get-channel-tab, update-channel-tab, delete-channel-tab — channel tab CRUD (4)
  - Outlook: get-outlook-category — get single category by id (1)
  - Calendar: get-calendar-group, update-calendar-group, delete-calendar-group — calendar group CRUD (3)
  - SharePoint: update-sharepoint-list, delete-sharepoint-list — list management (2)
  - SharePoint: create/update/delete-sharepoint-list-column — column management (3)
  - OneDrive: get-drive — get drive by ID (1)
  - Users: create-user, update-user — user admin (2)

### Fixed
- **CRITICAL: Duplicate endpoint `list-mail-rules`** — removed in favor of `list-message-rules` (consistent naming with update-message-rule/delete-message-rule)

## [fork-1.9.0] - 2026-03-23

### Added
- 2 new endpoints (total: 317 endpoints, up from 315)
  - Teams: update-channel-message — PATCH channel messages (soft-delete/restore, bot message updates) (1)
  - SharePoint: list-sharepoint-list-views — list view definitions for SharePoint lists (1)
- 19 new tests for custom-tools.ts: normalizeSubject (13), get-archive-messages (4), update-todo-cache (2), beta-get (2). Total tests: 83→104

### Fixed
- **CRITICAL: `removeODataProps` duplicate** — module-level function was shadowed by local copy in `formatJsonResponse`. Removed local duplicate so refactored function is actually used
- **CRITICAL: `normalizeSubject` now strips repeated prefixes** — `Re: Re: FW: Invoice` → `invoice` (was only stripping first prefix)
- `get-archive-messages` account parameter now required in schema (was `.optional()` but handler threw on missing)
- `userEmail` in EWS SOAP XML now XML-escaped (consistent with `search` param escaping)
- `update-channel-message` llmTip: corrected "Returns 204" → "Returns the updated message object"
- `removeODataProps` extracted to module-level function in graph-client.ts (V6)
- `process.on('unhandledRejection')` handler added in index.ts (V9)

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


## [0.2.0] - 2026-03-23

---


## [0.3.0] - 2026-03-23

---


## [0.4.0] - 2026-03-23

---



## [0.7.0] - 2026-03-23

---


## [0.8.0] - 2026-03-23

---

