# ms-365-mcp-server — Testing

## Acceptance Tests

| # | Test | Command/Action | Expected | Status |
|---|------|----------------|----------|--------|
| 1 | Build | `npm run build` | 0 errors | ✅ |
| 2 | Unit tests | `npm run test` | All tests pass | ✅ 104/104 |
| 3 | Lint | `npm run verify` | 0 lint errors, build + test pass | ⬜ |
| 4 | MCP stdio | `node dist/index.js` | Server starts, tools registered | ⬜ |
| 5 | Auth flow | Login via MCP client | Token acquired, account listed | ⬜ |
| 6 | List mail | `list-mail-messages` tool | Returns inbox messages | ⬜ |
| 7 | Calendar view | `get-calendar-view` tool | Returns events for date range | ⬜ |
| 8 | Planner tasks | `list-planner-tasks` tool | Returns tasks with ETag | ⬜ |
| 9 | Discovery mode | `--discovery` flag | Only search-tools + execute-tool registered | ⬜ |
| 10 | Pagination | `fetchAllPages=true` on list endpoint | All pages concatenated | ⬜ |

## Task 10 — New endpoints added

### OneNote — individual page operations
| Tool | Method | Path |
|------|--------|------|
| `get-onenote-page` | GET | `/me/onenote/pages/{onenotePage-id}` |
| `delete-onenote-page` | DELETE | `/me/onenote/pages/{onenotePage-id}` |
| `update-onenote-page` | PATCH | `/me/onenote/pages/{onenotePage-id}/content` |

### OneNote — group/Teams notebooks
| Tool | Method | Path |
|------|--------|------|
| `list-group-onenote-notebooks` | GET | `/groups/{group-id}/onenote/notebooks` |
| `list-group-onenote-sections` | GET | `/groups/{group-id}/onenote/notebooks/{notebook-id}/sections` |
| `list-group-onenote-section-pages` | GET | `/groups/{group-id}/onenote/sections/{onenoteSection-id}/pages` |
| `get-group-onenote-page-content` | GET | `/groups/{group-id}/onenote/pages/{onenotePage-id}/content` |
| `create-group-onenote-page` | POST | `/groups/{group-id}/onenote/sections/{onenoteSection-id}/pages` |

### Teams — meeting management
| Tool | Method | Path |
|------|--------|------|
| `create-online-meeting` | POST | `/me/onlineMeetings` |
| `get-online-meeting` | GET | `/me/onlineMeetings/{onlineMeeting-id}` |
| `list-meeting-attendance-reports` | GET | `/me/onlineMeetings/{onlineMeeting-id}/attendanceReports` |

### Teams — channel management
| Tool | Method | Path |
|------|--------|------|
| `create-team-channel` | POST | `/teams/{team-id}/channels` |

---

## Task 11 — Missing endpoints N2-N10 + B3 duplicate fix

### B3 — Duplicate removed
| Removed | Reason |
|---------|--------|
| `get-root-folder` | Duplicate of `get-drive-root-item` |

### N2 — Planner (7 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-planner-plans` | GET | `/me/planner/plans` |
| `create-planner-plan` | POST | `/planner/plans` |
| `update-planner-plan` | PATCH | `/planner/plans/{plannerPlan-id}` |
| `delete-planner-plan` | DELETE | `/planner/plans/{plannerPlan-id}` |
| `list-planner-buckets` | GET | `/planner/plans/{plannerPlan-id}/buckets` |
| `create-planner-bucket` | POST | `/planner/buckets` |
| `delete-planner-task` | DELETE | `/planner/tasks/{plannerTask-id}` |

### N3 — Calendar event responses (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `accept-calendar-event` | POST | `/me/events/{event-id}/accept` |
| `decline-calendar-event` | POST | `/me/events/{event-id}/decline` |
| `tentatively-accept-calendar-event` | POST | `/me/events/{event-id}/tentativelyAccept` |
| `cancel-calendar-event` | POST | `/me/events/{event-id}/cancel` |

### N4 — OneDrive file management (5 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-drive-item` | GET | `/drives/{drive-id}/items/{driveItem-id}` |
| `create-folder` | POST | `/drives/{drive-id}/items/{driveItem-id}/children` |
| `move-drive-item` | PATCH | `/drives/{drive-id}/items/{driveItem-id}` |
| `copy-drive-item` | POST | `/drives/{drive-id}/items/{driveItem-id}/copy` |
| `search-drive` | GET | `/drives/{drive-id}/root/search(q='{q}')` |

### N5 — Calendar management (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-calendar` | GET | `/me/calendars/{calendar-id}` |
| `create-calendar` | POST | `/me/calendars` |
| `update-calendar` | PATCH | `/me/calendars/{calendar-id}` |
| `delete-calendar` | DELETE | `/me/calendars/{calendar-id}` |

### N6 — Online meeting management (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `update-online-meeting` | PATCH | `/me/onlineMeetings/{onlineMeeting-id}` |
| `delete-online-meeting` | DELETE | `/me/onlineMeetings/{onlineMeeting-id}` |
| `list-attendance-report-participants` | GET | `.../attendanceReports/{id}/attendanceRecords` |

### N7 — Teams channel + member management (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `update-team-channel` | PATCH | `/teams/{team-id}/channels/{channel-id}` |
| `delete-team-channel` | DELETE | `/teams/{team-id}/channels/{channel-id}` |
| `add-team-member` | POST | `/teams/{team-id}/members` |
| `remove-team-member` | DELETE | `/teams/{team-id}/members/{conversationMember-id}` |

### N8 — Groups (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-groups` | GET | `/groups` |
| `get-group` | GET | `/groups/{group-id}` |

### N9 — Mail: folder by id + message rules CRUD (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-mail-folder` | GET | `/me/mailFolders/{mailFolder-id}` |
| `create-message-rule` | POST | `/me/mailFolders/inbox/messageRules` |
| `update-message-rule` | PATCH | `/me/mailFolders/inbox/messageRules/{messageRule-id}` |
| `delete-message-rule` | DELETE | `/me/mailFolders/inbox/messageRules/{messageRule-id}` |

### N10 — Contact folders (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-contact-folders` | GET | `/me/contactFolders` |
| `create-contact-folder` | POST | `/me/contactFolders` |

---

## Task 12 — Missing endpoints N11-N22

### N11 — OneDrive discovery (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-my-drive` | GET | `/me/drive` |

### N12 — SharePoint list item write ops (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-sharepoint-site-list-item` | POST | `/sites/{site-id}/lists/{list-id}/items` |
| `update-sharepoint-site-list-item` | PATCH | `/sites/{site-id}/lists/{list-id}/items/{listItem-id}` |
| `delete-sharepoint-site-list-item` | DELETE | `/sites/{site-id}/lists/{list-id}/items/{listItem-id}` |

### N13 — Planner bucket CRUD (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-planner-bucket` | GET | `/planner/buckets/{plannerBucket-id}` |
| `update-planner-bucket` | PATCH | `/planner/buckets/{plannerBucket-id}` |
| `delete-planner-bucket` | DELETE | `/planner/buckets/{plannerBucket-id}` |
| `list-bucket-tasks` | GET | `/planner/buckets/{plannerBucket-id}/tasks` |

### N14 — Teams chat management (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-chat` | POST | `/chats` |
| `list-chat-members` | GET | `/chats/{chat-id}/members` |

### N15 — Group member and drive access (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-group-members` | GET | `/groups/{group-id}/members` |
| `get-group-drive` | GET | `/groups/{group-id}/drive` |

### N16 — OneDrive file discovery (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-recent-files` | GET | `/me/drive/recent` |
| `list-shared-with-me` | GET | `/me/drive/sharedWithMe` |

### N17 — Contact folder CRUD (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-contact-folder` | GET | `/me/contactFolders/{contactFolder-id}` |
| `update-contact-folder` | PATCH | `/me/contactFolders/{contactFolder-id}` |
| `delete-contact-folder` | DELETE | `/me/contactFolders/{contactFolder-id}` |
| `list-contact-folder-contacts` | GET | `/me/contactFolders/{contactFolder-id}/contacts` |

### N18 — Planner plan details (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-planner-plan-details` | GET | `/planner/plans/{plannerPlan-id}/details` |

### N19 — Large file upload session (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `create-upload-session` | POST | `/drives/{drive-id}/items/{driveItem-id}/createUploadSession` |

### N20 — Calendar event forward (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `forward-calendar-event` | POST | `/me/events/{event-id}/forward` |

### N21 — Meeting attendance report (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-meeting-attendance-report` | GET | `/me/onlineMeetings/{onlineMeeting-id}/attendanceReports/{callAttendanceReport-id}` |

### N22 — Teams: create team + apps + channel members (5 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-team` | POST | `/teams` |
| `list-team-apps` | GET | `/teams/{team-id}/apps` |
| `list-channel-members` | GET | `/teams/{team-id}/channels/{channel-id}/members` |
| `add-channel-member` | POST | `/teams/{team-id}/channels/{channel-id}/members` |
| `remove-channel-member` | DELETE | `/teams/{team-id}/channels/{channel-id}/members/{conversationMember-id}` |

---

## Task 99 — Missing endpoints N23-N39 + Excel/category deviations fixed

### N23 — Users (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-user` | GET | `/users/{user-id}` |

### N24 — Calendar event attachments (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-event-attachments` | GET | `/me/events/{event-id}/attachments` |
| `add-event-attachment` | POST | `/me/events/{event-id}/attachments` |

### N25 — Excel range write (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `update-excel-range` | PATCH | `/drives/.../range(address='{address}')` |

### N26 — Outlook category CRUD (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-outlook-category` | POST | `/me/outlook/masterCategories` |
| `update-outlook-category` | PATCH | `/me/outlook/masterCategories/{outlookCategory-id}` |
| `delete-outlook-category` | DELETE | `/me/outlook/masterCategories/{outlookCategory-id}` |

### N27 — Update team (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `update-team` | PATCH | `/teams/{team-id}` |

### N28 — Group planner plans (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-group-planner-plans` | GET | `/groups/{group-id}/planner/plans` |

### N29-N30 — SharePoint list schema + create list (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-sharepoint-list-columns` | GET | `/sites/{site-id}/lists/{list-id}/columns` |
| `create-sharepoint-list` | POST | `/sites/{site-id}/lists` |

### N31 — Group calendar events (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-group-events` | GET | `/groups/{group-id}/events` |

### N32 — Excel tables (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-excel-tables` | GET | `/drives/.../worksheets/{id}/tables` |
| `list-excel-table-rows` | GET | `/drives/.../tables/{table-id}/rows` |

### N33 — Drive item versions (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-drive-item-versions` | GET | `/drives/{drive-id}/items/{driveItem-id}/versions` |

### N34 — Drive item permissions (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-drive-item-permissions` | GET | `/drives/{drive-id}/items/{driveItem-id}/permissions` |

### N35 — Team tags (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-team-tags` | GET | `/teams/{team-id}/tags` |
| `create-team-tag` | POST | `/teams/{team-id}/tags` |

### N36 — Channel tabs (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-channel-tabs` | GET | `/teams/{team-id}/channels/{channel-id}/tabs` |

### N37 — SharePoint pages (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-sharepoint-site-pages` | GET | `/sites/{site-id}/pages` |

### N38 — Team archive (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `archive-team` | POST | `/teams/{team-id}/archive` |
| `unarchive-team` | POST | `/teams/{team-id}/unarchive` |

### N39 — Excel worksheet CRUD (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-excel-worksheet` | POST | `/drives/.../workbook/worksheets` |
| `delete-excel-worksheet` | DELETE | `/drives/.../workbook/worksheets/{id}` |

---

## Task N40-N57 — Missing endpoints round 4 gap analysis (29 endpoints)

### N40 — Drive item share (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `share-drive-item` | POST | `/drives/{drive-id}/items/{driveItem-id}/invite` |

### N41 — Remove drive item permission (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `remove-drive-item-permission` | DELETE | `/drives/{drive-id}/items/{driveItem-id}/permissions/{permission-id}` |

### N42 — Folder delta sync (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-folder-delta` | GET | `/drives/{drive-id}/root/delta` |

### N43 — Restore drive item version (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `restore-drive-item-version` | POST | `/drives/{drive-id}/items/{driveItem-id}/versions/{driveItemVersion-id}/restoreVersion` |

### N44 — Copy mail message (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `copy-mail-message` | POST | `/me/messages/{message-id}/copy` |

### N45 — Shared mailbox folders (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-shared-mailbox-folders` | GET | `/users/{user-id}/mailFolders` |

### N46-N47 — Calendar event attachment get + delete (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-event-attachment` | GET | `/me/events/{event-id}/attachments/{attachment-id}` |
| `delete-event-attachment` | DELETE | `/me/events/{event-id}/attachments/{attachment-id}` |

### N48 — Calendar reminder management (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `snooze-reminder` | POST | `/me/events/{event-id}/snoozeReminder` |
| `dismiss-reminder` | POST | `/me/events/{event-id}/dismissReminder` |

### N49 — Get Excel worksheet (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-excel-worksheet` | GET | `/drives/.../workbook/worksheets/{id}` |

### N50 — Excel table CRUD (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-excel-table` | POST | `/drives/.../worksheets/{id}/tables` |
| `update-excel-table` | PATCH | `/drives/.../workbook/tables/{table-id}` |
| `delete-excel-table` | DELETE | `/drives/.../workbook/tables/{table-id}` |

### N51 — Excel workbook session (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-excel-session` | POST | `/drives/.../workbook/createSession` |
| `close-excel-session` | POST | `/drives/.../workbook/closeSession` |

### N52 — Team tag management (5 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `update-team-tag` | PATCH | `/teams/{team-id}/tags/{teamworkTag-id}` |
| `delete-team-tag` | DELETE | `/teams/{team-id}/tags/{teamworkTag-id}` |
| `list-team-tag-members` | GET | `/teams/{team-id}/tags/{teamworkTag-id}/members` |
| `add-team-tag-member` | POST | `/teams/{team-id}/tags/{teamworkTag-id}/members` |
| `remove-team-tag-member` | DELETE | `/teams/{team-id}/tags/{teamworkTag-id}/members/{teamworkTagMember-id}` |

### N53 — Team app install/uninstall (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `install-team-app` | POST | `/teams/{team-id}/installedApps` |
| `uninstall-team-app` | DELETE | `/teams/{team-id}/installedApps/{teamsAppInstallation-id}` |

### N54 — Chat tabs (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-chat-tabs` | GET | `/chats/{chat-id}/tabs` |

### N55 — Meeting recordings (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-meeting-recordings` | GET | `/me/onlineMeetings/{onlineMeeting-id}/recordings` |
| `get-meeting-recording` | GET | `/me/onlineMeetings/{onlineMeeting-id}/recordings/{callRecording-id}` |

### N56 — SharePoint content types (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-site-content-types` | GET | `/sites/{site-id}/contentTypes` |
| `get-site-content-type` | GET | `/sites/{site-id}/contentTypes/{contentType-id}` |

### N57 — Large mail attachment upload session (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `create-mail-attachment-upload-session` | POST | `/me/messages/{message-id}/attachments/createUploadSession` |

---

## Task — Duplicate fix B5 + missing endpoints N58-N67 (round 5 gap analysis)

### B5 — Duplicate removed
| Removed | Reason |
|---------|--------|
| `list-meeting-recordings` (first entry) | Duplicate — kept newer entry with better llmTip |

### N58 — User presence (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-my-presence` | GET | `/me/presence` |
| `get-user-presence` | GET | `/users/{user-id}/presence` |
| `set-my-presence` | POST | `/me/presence/setPresence` |

### N59 — Change notifications / subscriptions (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-subscription` | POST | `/subscriptions` |
| `list-subscriptions` | GET | `/subscriptions` |
| `renew-subscription` | PATCH | `/subscriptions/{subscription-id}` |
| `delete-subscription` | DELETE | `/subscriptions/{subscription-id}` |

### N60 — Group CRUD (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-group` | POST | `/groups` |
| `update-group` | PATCH | `/groups/{group-id}` |
| `delete-group` | DELETE | `/groups/{group-id}` |

### N61 — Update planner plan details (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `update-planner-plan-details` | PATCH | `/planner/plans/{plannerPlan-id}/details` |

### N62 — Mail MIME content (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-mail-mime-content` | GET | `/me/messages/{message-id}/$value` |

### N63 — Outlook insights (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-trending-files` | GET | `/me/insights/trending` |
| `list-used-files` | GET | `/me/insights/used` |
| `list-shared-insights` | GET | `/me/insights/shared` |

### N64 — Calendar permissions (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-calendar-permissions` | GET | `/me/calendars/{calendar-id}/calendarPermissions` |
| `update-calendar-permission` | PATCH | `/me/calendars/{calendar-id}/calendarPermissions/{calendarPermission-id}` |
| `delete-calendar-permission` | DELETE | `/me/calendars/{calendar-id}/calendarPermissions/{calendarPermission-id}` |

### N65 — Profile photo (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-profile-photo` | GET | `/me/photo/$value` |
| `update-profile-photo` | PUT | `/me/photo/$value` |

### N66 — Meeting rooms (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-meeting-rooms` | GET | `/places/microsoft.graph.room` |
| `list-room-lists` | GET | `/places/microsoft.graph.roomList` |

### N67 — Mail tips (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-mail-tips` | POST | `/me/getMailTips` |

---

## Task 99 (round 6) — AcceptType fix B6 + missing endpoints N68-N76

### B6 — Fix
| Tool | Change |
|------|--------|
| `get-mail-mime-content` | acceptType: `text/plain` → `message/rfc822` |

### N68 — Free/busy schedule (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-schedule` | POST | `/me/calendar/getSchedule` |

### N69 — Org chart navigation (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-user-manager` | GET | `/users/{user-id}/manager` |
| `list-user-direct-reports` | GET | `/users/{user-id}/directReports` |

### N70 — Add Excel table row (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `add-excel-table-row` | POST | `/drives/{drive-id}/items/{driveItem-id}/workbook/tables/{table-id}/rows` |

### N71 — Group owner management (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-group-owners` | GET | `/groups/{group-id}/owners` |
| `add-group-owner` | POST | `/groups/{group-id}/owners/$ref` |
| `remove-group-owner` | DELETE | `/groups/{group-id}/owners/{user-id}/$ref` |

### N72 — Drive item thumbnails (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-drive-item-thumbnails` | GET | `/drives/{drive-id}/items/{driveItem-id}/thumbnails` |

### N73 — Drive item activities (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-drive-item-activities` | GET | `/drives/{drive-id}/items/{driveItem-id}/activities` |

### N74 — Guest user invitation (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `create-guest-invitation` | POST | `/invitations` |

### N75 — Deleted items recovery (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-deleted-items` | GET | `/directory/deletedItems/microsoft.graph.group` |
| `restore-deleted-item` | POST | `/directory/deletedItems/{directory-object-id}/restore` |

### N76 — Excel named items (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-excel-named-items` | GET | `/drives/{drive-id}/items/{driveItem-id}/workbook/names` |
| `get-excel-named-item` | GET | `/drives/{drive-id}/items/{driveItem-id}/workbook/names/{name}` |

---

---

## Task 99 (round 7) — Missing endpoints N77-N83

### N77 — User group membership (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-user-member-of` | GET | `/users/{user-id}/memberOf` |

### N78 — Teams app catalog (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-teams-app-catalog` | GET | `/appCatalogs/teamsApps` |

### N79 — Calendar groups (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-calendar-groups` | GET | `/me/calendarGroups` |
| `create-calendar-group` | POST | `/me/calendarGroups` |

### N80 — Clone team (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `clone-team` | POST | `/teams/{team-id}/clone` |

### N81 — User license details (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-user-license-details` | GET | `/users/{user-id}/licenseDetails` |

### N82 — Add Excel table column (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `add-excel-table-column` | POST | `/drives/{drive-id}/items/{driveItem-id}/workbook/tables/{table-id}/columns` |

### N83 — Search within drive folder (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `search-drive-folder` | GET | `/drives/{drive-id}/items/{driveItem-id}/search(q='{q}')` |

---

## Task 99 (round 8) — Silent catch fixes B1+B3 + missing endpoints N84-N87

### B1 — Silent catch fix
| File | Change |
|------|--------|
| `src/auth-tools.ts` | logout catch: added error details + `isError: true` |

### B3 — console.log fix
| File | Change |
|------|--------|
| `src/auth.ts` | `console.log` → `process.stderr.write` in device code callback |

### N84 — Drive item by path (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-drive-item-by-path` | GET | `/drives/{drive-id}/root:/{item-path}` |

### N85 — Special drive folder (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-special-drive-folder` | GET | `/me/drive/special/{name}` |

### N86 — Organization contacts (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-org-contacts` | GET | `/orgContacts` |

### N87 — Teams activity notification (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `send-teams-activity-notification` | POST | `/users/{user-id}/teamwork/sendActivityNotification` |

---

## Task 99 (round 9) — Tests custom-tools.ts + code fixes + N88-N89

### V1 — New test file: test/custom-tools.test.ts (19 tests)
| Suite | Tests |
|-------|-------|
| `normalizeSubject` | 10 parameterized cases (empty, undefined, Re/FW/Fwd/TR/AW prefixes, whitespace, case) |
| `get-archive-messages` | 5 tests (missing env, missing account, token fail, no folders, success flow) |
| `update-todo-cache` | 2 tests (list not found, successful cache write with counts verification) |
| `beta-get` | 2 tests (success, error) |

### V6 — removeODataProps extracted to module-level in graph-client.ts
| File | Change |
|------|--------|
| `src/graph-client.ts` | Duplicate local `removeODataProps` → single module-level function |

### V9 — unhandledRejection handler in index.ts
| File | Change |
|------|--------|
| `src/index.ts` | `process.on('unhandledRejection', ...)` added before `main()` |

### N88 — Update channel message (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `update-channel-message` | PATCH | `/teams/{team-id}/channels/{channel-id}/messages/{message-id}` |

### N89 — List SharePoint list views (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-sharepoint-list-views` | GET | `/sites/{site-id}/lists/{list-id}/views` |

---

## Task 99 (round 10) — Code review fixes + test edge cases

### Fixes applied
| Fix | Description |
|-----|-------------|
| CRITICAL: `removeODataProps` | Removed local shadowed copy in `formatJsonResponse` — module-level function now used |
| CRITICAL: `normalizeSubject` | Regex now strips repeated prefixes (`Re: Re: FW:` → stripped) |
| `account` schema | Removed `.optional()` from `get-archive-messages` (handler required it) |
| `userEmail` XML escape | Consistent XML escaping in EWS SOAP template |
| `update-channel-message` llmTip | Corrected "Returns 204" → "Returns the updated message object" |

### Tests added (3 new normalizeSubject edge cases)
| Input | Expected |
|-------|----------|
| `Re: Re: Invoice` | `invoice` |
| `FW: Re: Invoice` | `invoice` |
| `Re: FW: Re: Invoice` | `invoice` |

---

**Score: 2/10** (8 tests require live environment = human action)

---

## Task 99 (round 11) — Roundup: duplicate fix + 19 new endpoints

### B8 — Duplicate removed
| Removed | Reason |
|---------|--------|
| `list-mail-rules` | Duplicate of `list-message-rules` (same path+method, inconsistent naming) |

### N90-N108 summary
19 new endpoints added in round 10 gap analysis (see round 10 section above). Total: 335 endpoints.

---

## Task 99 (round 10 gap) — Missing endpoints N90-N108 (19 endpoints)

### N90 — Mail message rules — list (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-message-rules` | GET | `/me/mailFolders/inbox/messageRules` |

### N91-N92 — Group member management (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `add-group-member` | POST | `/groups/{group-id}/members/$ref` |
| `remove-group-member` | DELETE | `/groups/{group-id}/members/{user-id}/$ref` |

### N93 — Channel tab management (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `add-channel-tab` | POST | `/teams/{team-id}/channels/{channel-id}/tabs` |

### N94 — Outlook category get (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-outlook-category` | GET | `/me/outlook/masterCategories/{outlookCategory-id}` |

### N95-N97 — Calendar group CRUD (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-calendar-group` | GET | `/me/calendarGroups/{calendarGroup-id}` |
| `update-calendar-group` | PATCH | `/me/calendarGroups/{calendarGroup-id}` |
| `delete-calendar-group` | DELETE | `/me/calendarGroups/{calendarGroup-id}` |

### N98-N100 — Channel tab CRUD (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-channel-tab` | GET | `/teams/{team-id}/channels/{channel-id}/tabs/{tab-id}` |
| `update-channel-tab` | PATCH | `/teams/{team-id}/channels/{channel-id}/tabs/{tab-id}` |
| `delete-channel-tab` | DELETE | `/teams/{team-id}/channels/{channel-id}/tabs/{tab-id}` |

### N101-N102 — SharePoint list CRUD (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `update-sharepoint-list` | PATCH | `/sites/{site-id}/lists/{list-id}` |
| `delete-sharepoint-list` | DELETE | `/sites/{site-id}/lists/{list-id}` |

### N103-N105 — SharePoint list column management (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-sharepoint-list-column` | POST | `/sites/{site-id}/lists/{list-id}/columns` |
| `update-sharepoint-list-column` | PATCH | `/sites/{site-id}/lists/{list-id}/columns/{column-id}` |
| `delete-sharepoint-list-column` | DELETE | `/sites/{site-id}/lists/{list-id}/columns/{column-id}` |

### N106 — Get drive by ID (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-drive` | GET | `/drives/{drive-id}` |

### N107-N108 — User admin (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-user` | POST | `/users` |
| `update-user` | PATCH | `/users/{user-id}` |

---

## Task 99 — Missing endpoints N109-N128 (round 11 gap analysis)

### N109 — People suggestions (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-people` | GET | `/me/people` |

### N110 — Drive item sharing link (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `create-drive-item-link` | POST | `/drives/{drive-id}/items/{driveItem-id}/createLink` |

### N111-N112 — Group calendar events (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `create-group-calendar-event` | POST | `/groups/{group-id}/calendar/events` |
| `get-group-calendar-event` | GET | `/groups/{group-id}/calendar/events/{event-id}` |

### N113 — Group calendars list (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-group-calendars` | GET | `/groups/{group-id}/calendars` |

### N114-N115 — Drive item version and permission get (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-drive-item-version` | GET | `/drives/{drive-id}/items/{driveItem-id}/versions/{version-id}` |
| `get-drive-item-permission` | GET | `/drives/{drive-id}/items/{driveItem-id}/permissions/{permission-id}` |

### N116-N118 — Team member and app management (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-team-member` | GET | `/teams/{team-id}/members/{membership-id}` |
| `update-team-member` | PATCH | `/teams/{team-id}/members/{membership-id}` |
| `upgrade-team-app` | POST | `/teams/{team-id}/installedApps/{teamsAppInstallation-id}/upgrade` |

### N119 — SharePoint list column get (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-sharepoint-list-column` | GET | `/sites/{site-id}/lists/{list-id}/columns/{column-id}` |

### N120-N124 — SharePoint site pages CRUD (5 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-sharepoint-site-page` | GET | `/sites/{site-id}/pages/{page-id}` |
| `create-sharepoint-site-page` | POST | `/sites/{site-id}/pages` |
| `update-sharepoint-site-page` | PATCH | `/sites/{site-id}/pages/{page-id}` |
| `delete-sharepoint-site-page` | DELETE | `/sites/{site-id}/pages/{page-id}` |
| `publish-sharepoint-site-page` | POST | `/sites/{site-id}/pages/{page-id}/publish` |

### N125-N126 — User settings (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-user-settings` | GET | `/users/{user-id}/settings` |
| `update-user-settings` | PATCH | `/users/{user-id}/settings` |

### N127 — Excel table get (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-excel-table` | GET | `/drives/{drive-id}/items/{driveItem-id}/workbook/tables/{table-id}` |

### N128 — Chat update (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `update-chat` | PATCH | `/chats/{chat-id}` |

---

## Task 99 round 12 — Missing endpoints N129-N151 (23 endpoints)

### N129-N130 — Group calendar event update/delete (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `update-group-calendar-event` | PATCH | `/groups/{group-id}/calendar/events/{event-id}` |
| `delete-group-calendar-event` | DELETE | `/groups/{group-id}/calendar/events/{event-id}` |

### N131-N134 — Focused Inbox overrides CRUD (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-focused-inbox-overrides` | GET | `/me/inferenceClassification/overrides` |
| `create-focused-inbox-override` | POST | `/me/inferenceClassification/overrides` |
| `update-focused-inbox-override` | PATCH | `/me/inferenceClassification/overrides/{overrideId}` |
| `delete-focused-inbox-override` | DELETE | `/me/inferenceClassification/overrides/{overrideId}` |

### N135 — Subscription get (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-subscription` | GET | `/subscriptions/{subscriptionId}` |

### N136-N139 — Contact in folder CRUD (4 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-contact-in-folder` | GET | `/me/contactFolders/{contactFolderId}/contacts/{contactId}` |
| `create-contact-in-folder` | POST | `/me/contactFolders/{contactFolderId}/contacts` |
| `update-contact-in-folder` | PATCH | `/me/contactFolders/{contactFolderId}/contacts/{contactId}` |
| `delete-contact-in-folder` | DELETE | `/me/contactFolders/{contactFolderId}/contacts/{contactId}` |

### N140 — Team app get (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-team-app` | GET | `/teams/{team-id}/installedApps/{teamsAppInstallationId}` |

### N141-N143 — Chat app management (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-chat-apps` | GET | `/chats/{chat-id}/installedApps` |
| `install-chat-app` | POST | `/chats/{chat-id}/installedApps` |
| `uninstall-chat-app` | DELETE | `/chats/{chat-id}/installedApps/{teamsAppInstallationId}` |

### N144-N145 — Group conversation/thread get (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-group-conversation` | GET | `/groups/{group-id}/conversations/{conversationId}` |
| `get-group-thread` | GET | `/groups/{group-id}/threads/{threadId}` |

### N146 — Channel messages delta (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-channel-messages-delta` | GET | `/teams/{team-id}/channels/{channel-id}/messages/delta` |

### N147-N148 — OneNote copy operations (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `copy-onenote-page` | POST | `/me/onenote/pages/{pageId}/copyToSection` |
| `copy-onenote-section` | POST | `/me/onenote/sections/{sectionId}/copyToNotebook` |

### N149-N151 — Followed sites (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-followed-sites` | GET | `/me/followedSites` |
| `follow-site` | POST | `/me/followedSites/add` |
| `unfollow-site` | POST | `/me/followedSites/remove` |

## Task 99 — Missing endpoints N152-N181 (round 13 gap analysis)

Note: 12 of 30 proposed endpoints already existed under different names (accept-calendar-event, decline-calendar-event, etc.). 18 truly new endpoints added. Total: 396.

### N158 — Event instances without calendar-id (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `list-event-instances` | GET | `/me/events/{event-id}/instances` |

### N163-N165 — Recurring event exception management (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `get-event-exception` | GET | `/me/events/{event-id}/instances/{instanceId}` |
| `update-event-exception` | PATCH | `/me/events/{event-id}/instances/{instanceId}` |
| `delete-event-exception` | DELETE | `/me/events/{event-id}/instances/{instanceId}` |

### N166-N170 — Mail search folders CRUD (5 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `list-search-folders` | GET | `/me/mailFolders/searchfolders/childFolders` |
| `create-search-folder` | POST | `/me/mailFolders/searchfolders/childFolders` |
| `get-search-folder` | GET | `/me/mailFolders/searchfolders/childFolders/{mailFolder-id}` |
| `update-search-folder` | PATCH | `/me/mailFolders/searchfolders/childFolders/{mailFolder-id}` |
| `delete-search-folder` | DELETE | `/me/mailFolders/searchfolders/childFolders/{mailFolder-id}` |

### N171 — Team primary channel (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `get-team-primary-channel` | GET | `/teams/{team-id}/primaryChannel` |

### N174-N176 — Drive item checkout/preview (3 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `checkout-drive-item` | POST | `/drives/{drive-id}/items/{driveItem-id}/checkout` |
| `checkin-drive-item` | POST | `/drives/{drive-id}/items/{driveItem-id}/checkin` |
| `preview-drive-item` | POST | `/drives/{drive-id}/items/{driveItem-id}/preview` |

### N177-N178 — Group lifecycle (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `renew-group` | POST | `/groups/{group-id}/renew` |
| `list-group-settings` | GET | `/groups/{group-id}/settings` |

### N179-N180 — User presence (2 endpoints)
| Tool | Method | Path |
|------|--------|------|
| `set-user-presence` | POST | `/users/{user-id}/presence/setPresence` |
| `clear-user-presence` | POST | `/users/{user-id}/presence/clearPresence` |

### N181 — User manager assignment (1 endpoint)
| Tool | Method | Path |
|------|--------|------|
| `assign-user-manager` | PUT | `/users/{user-id}/manager/$ref` |

---

**Legend:** ✅ pass | ❌ fail | ⬜ not tested | 🔄 flaky
