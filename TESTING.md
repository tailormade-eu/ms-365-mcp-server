# ms-365-mcp-server — Testing

## Acceptance Tests

| # | Test | Command/Action | Expected | Status |
|---|------|----------------|----------|--------|
| 1 | Build | `npm run build` | 0 errors | ✅ |
| 2 | Unit tests | `npm run test` | All tests pass | ✅ (83/83) |
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

**Score: 2/10**

---

**Legend:** ✅ pass | ❌ fail | ⬜ not tested | 🔄 flaky
