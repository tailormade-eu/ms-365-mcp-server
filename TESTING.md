# ms-365-mcp-server — Testing

## Acceptance Tests

| # | Test | Command/Action | Expected | Status |
|---|------|----------------|----------|--------|
| 1 | Build | `npm run build` | 0 errors | ✅ |
| 2 | Unit tests | `npm run test` | All 83 tests pass | ✅ (83/83) |
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

**Score: 2/10**

---

**Legend:** ✅ pass | ❌ fail | ⬜ not tested | 🔄 flaky
