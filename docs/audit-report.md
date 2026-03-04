# Endpoint Audit Report — 2026-03-04

## 1. Total Tool Count

**111 tools** defined in `endpoints.json`

---

## 2. Tools WITH llmTip (18)

| # | Tool | Tip (first 80 chars) |
|---|------|---------------------|
| 1 | list-mail-messages | CRITICAL: When searching emails, the $search parameter value MUST be wrapped in |
| 2 | list-mail-folder-messages | CRITICAL: When searching emails, the $search parameter value MUST be wrapped in |
| 3 | send-mail | CRITICAL: Do not try to guess the email address of the recipients. Use the list |
| 4 | list-shared-mailbox-messages | CRITICAL: When searching emails, the $search parameter value MUST be wrapped in |
| 5 | list-shared-mailbox-folder-messages | CRITICAL: When searching emails, the $search parameter value MUST be wrapped in |
| 6 | send-shared-mailbox-mail | CRITICAL: Do not try to guess the email address of the recipients. Use the list |
| 7 | list-users | CRITICAL: This request requires the ConsistencyLevel header set to eventual. Whe |
| 8 | create-calendar-event | CRITICAL: Do not try to guess the email address of the recipients. Use the list |
| 9 | update-calendar-event | CRITICAL: Do not try to guess the email address of the recipients. Use the list |
| 10 | get-calendar-view | Returns expanded recurring event instances (not just seriesMaster) within a date |
| 11 | get-specific-calendar-view | Returns expanded recurring event instances (not just seriesMaster) within a date |
| 12 | list-calendar-event-instances | Expand a recurring event into individual instances within a date range. Requires |
| 13 | create-specific-calendar-event | CRITICAL: Do not try to guess the email address of the recipients. Use the list |
| 14 | update-specific-calendar-event | CRITICAL: Do not try to guess the email address of the recipients. Use the list |
| 15 | forward-mail-message | Forward an email preserving full HTML formatting and attachments. The 'comment' |
| 16 | reply-mail-message | Reply to an email preserving full HTML formatting. The 'comment' field is your r |
| 17 | reply-all-mail-message | Reply-all preserving full HTML formatting. The 'comment' field is your reply tex |
| 18 | create-forward-draft | Create a forward draft (does not send). Useful when user wants to review before |

---

## 3. Tools WITHOUT llmTip (93) — by category

### Mail (15)
| Tool | Method |
|------|--------|
| list-mail-folders | GET |
| list-mail-child-folders | GET |
| get-mail-message | GET |
| create-draft-email | POST |
| delete-mail-message | DELETE |
| move-mail-message | POST |
| update-mail-message | PATCH |
| add-mail-attachment | POST |
| list-mail-attachments | GET |
| get-mail-attachment | GET |
| delete-mail-attachment | DELETE |
| create-reply-draft | POST |
| create-reply-all-draft | POST |
| send-draft-message | POST |
| get-shared-mailbox-message | GET |

### Calendar (8)
| Tool | Method |
|------|--------|
| list-calendar-events | GET |
| get-calendar-event | GET |
| delete-calendar-event | DELETE |
| list-specific-calendar-events | GET |
| get-specific-calendar-event | GET |
| delete-specific-calendar-event | DELETE |
| list-calendars | GET |
| find-meeting-times | POST |

### Files/Excel (12)
| Tool | Method |
|------|--------|
| list-drives | GET |
| get-drive-root-item | GET |
| get-root-folder | GET |
| list-folder-files | GET |
| download-onedrive-file-content | GET |
| delete-onedrive-file | DELETE |
| upload-file-content | PUT |
| create-excel-chart | POST |
| format-excel-range | PATCH |
| sort-excel-range | PATCH |
| get-excel-range | GET |
| list-excel-worksheets | GET |

### Contacts (5)
| Tool | Method |
|------|--------|
| list-outlook-contacts | GET |
| get-outlook-contact | GET |
| create-outlook-contact | POST |
| update-outlook-contact | PATCH |
| delete-outlook-contact | DELETE |

### Tasks (13)
| Tool | Method |
|------|--------|
| list-todo-task-lists | GET |
| list-todo-tasks | GET |
| get-todo-task | GET |
| create-todo-task | POST |
| update-todo-task | PATCH |
| delete-todo-task | DELETE |
| list-planner-tasks | GET |
| get-planner-plan | GET |
| list-plan-tasks | GET |
| get-planner-task | GET |
| create-planner-task | POST |
| update-planner-task | PATCH |
| update-planner-task-details | PATCH |

### OneNote (6)
| Tool | Method |
|------|--------|
| list-onenote-notebooks | GET |
| list-onenote-notebook-sections | GET |
| list-onenote-section-pages | GET |
| get-onenote-page-content | GET |
| create-onenote-page | POST |
| create-onenote-section-page | POST |

### Users (1)
| Tool | Method |
|------|--------|
| get-current-user | GET |

### Search (1)
| Tool | Method |
|------|--------|
| search-query | POST |

### Other — Teams/Chat (17)
| Tool | Method |
|------|--------|
| list-chats | GET |
| get-chat | GET |
| list-chat-messages | GET |
| get-chat-message | GET |
| send-chat-message | POST |
| list-joined-teams | GET |
| get-team | GET |
| list-team-channels | GET |
| get-team-channel | GET |
| list-channel-messages | GET |
| get-channel-message | GET |
| send-channel-message | POST |
| reply-to-channel-message | POST |
| list-channel-message-replies | GET |
| list-team-members | GET |
| list-chat-message-replies | GET |
| reply-to-chat-message | POST |

### Other — SharePoint (12)
| Tool | Method |
|------|--------|
| search-sharepoint-sites | GET |
| get-sharepoint-site | GET |
| list-sharepoint-site-drives | GET |
| get-sharepoint-site-drive-by-id | GET |
| list-sharepoint-site-items | GET |
| get-sharepoint-site-item | GET |
| list-sharepoint-site-lists | GET |
| get-sharepoint-site-list | GET |
| list-sharepoint-site-list-items | GET |
| get-sharepoint-site-list-item | GET |
| get-sharepoint-site-by-path | GET |
| get-sharepoint-sites-delta | GET |

### Other — Groups (3)
| Tool | Method |
|------|--------|
| list-group-conversations | GET |
| list-group-threads | GET |
| reply-to-group-thread | POST |

---

## 4. Parameters with custom `.describe()` in graph-tools.ts

### Injected by graph-tools.ts at registration time
| Parameter | Description (first 80 chars) |
|-----------|------------------------------|
| fetchAllPages | Automatically fetch all pages of results |
| $count | Include count of items in response. IMPORTANT: Set to true to enable advanced qu... |
| account | Microsoft account email to use for this request. Required when multiple accounts... |
| includeHeaders | Include response headers (including ETag) in the response metadata |
| excludeResponse | Exclude the full response body and only return success or failure indication |
| timezone | IANA timezone name (e.g., "America/New_York", "Europe/London") for calendar even... |
| expandExtendedProperties | When true, expands singleValueExtendedProperties on each event. Use this to retr... |

### From generated client (OData standard params — all endpoints)
| Parameter | Description |
|-----------|-------------|
| $select | Select properties to be returned |
| $expand | Expand related entities |
| $top | Show only the first n items |
| $skip | Skip the first n items |
| $search | Search items by search phrases |
| $filter | Filter items by property values |
| $orderby | Order items by property values |
| $format | Format of the content |
| ConsistencyLevel | Indicates the requested consistency level |
| startDateTime | The start date and time of the time range |
| endDateTime | The end date and time of the time range |
| If-Match | ETag |

### Auto-generated by hack.ts (generic)
All path parameters (e.g., `message-id`, `drive-id`, `event-id`) get: `"Path parameter: {name}"` — **no Graph-specific guidance**.

---

## 5. Known Graph API Quirks NOT Yet in Any llmTip

### HIGH PRIORITY — causes errors or data loss

| # | Quirk | Affected Tools |
|---|-------|----------------|
| 1 | **Planner PATCH requires If-Match ETag** — update-planner-task and update-planner-task-details return 412 without it. Must GET first, extract @odata.etag, pass as If-Match header. | update-planner-task, update-planner-task-details |
| 2 | **$orderby ignored when $search is used** — Messages sorted by relevance, not by $orderby. LLMs frequently try `$search=X&$orderby=receivedDateTime desc`. | list-mail-messages, list-mail-folder-messages |
| 3 | **File upload PUT limited to 4MB** — Larger files need createUploadSession (not exposed). No error guidance. | upload-file-content |
| 4 | **Attachment POST limited to 3MB** — Larger attachments need upload session. | add-mail-attachment |
| 5 | **move-mail-message requires folder ID, not name** — Body: `{"destinationId": "folder-id"}`. LLMs try folder names like "Archive". | move-mail-message |
| 6 | **find-meeting-times body format** — Requires specific JSON with attendees array, timeConstraint, meetingDuration. No guidance on structure. | find-meeting-times |
| 7 | **create-draft-email body format** — Requires proper message object with `subject`, `body.contentType`, `body.content`, `toRecipients`. No guidance. | create-draft-email |
| 8 | **search-query body format** — Requires `requests` array with `entityTypes`, `query.queryString`. Complex structure not documented. | search-query |
| 9 | **OneNote page creation requires HTML** — Must include `<html><head><title>Title</title></head><body>content</body></html>`. Partial HTML fails silently. | create-onenote-page, create-onenote-section-page |
| 10 | **Teams/Chat messages use HTML body** — `body: {contentType: "html", content: "<p>text</p>"}`. Plain text gets mangled. | send-chat-message, send-channel-message, reply-to-channel-message, reply-to-chat-message |

### MEDIUM PRIORITY — causes confusion or suboptimal behavior

| # | Quirk | Affected Tools |
|---|-------|----------------|
| 11 | **list-calendar-events only returns non-recurring + seriesMasters** — Does NOT expand recurring instances. LLMs should use get-calendar-view instead for "what's on my calendar this week". | list-calendar-events |
| 12 | **$select on calendar events can silently drop properties** — Some nested properties (attendees, location) need exact property names. (Already fixed in code but no tip.) | list-calendar-events, get-calendar-event |
| 13 | **Contacts $filter very limited** — Only supports `startswith()` on givenName, surname, displayName. No `contains()`, no `eq` on email. | list-outlook-contacts |
| 14 | **Todo task body is HTML** — `body: {contentType: "html", content: "..."}`. Not text. | create-todo-task, update-todo-task |
| 15 | **Planner task assignment format** — Assignments is an object like `{"user-id": {"@odata.type": "#microsoft.graph.plannerAssignment", "orderHint": " !"}}`. | create-planner-task, update-planner-task |
| 16 | **SharePoint list items need $expand=fields** — Without `$expand=fields`, list items return only metadata, no column values. | list-sharepoint-site-list-items, get-sharepoint-site-list-item |
| 17 | **get-drive-root-item and get-root-folder are duplicates** — Same path, same method. Confuses LLM tool selection. | get-drive-root-item, get-root-folder |
| 18 | **download-onedrive-file-content returns download URL, not content** — Due to `returnDownloadUrl: true`, the tool strips `/content` and returns the `@microsoft.graph.downloadUrl` field. Not obvious from tool name. | download-onedrive-file-content |
| 19 | **Excel operations need workbook session** — For multiple sequential Excel ops, a session prevents conflicts. Not exposed. | all excel tools |
| 20 | **Group conversations are legacy** — Microsoft recommends Teams channels instead. Groups API may not work for all M365 groups. | list-group-conversations, list-group-threads, reply-to-group-thread |
