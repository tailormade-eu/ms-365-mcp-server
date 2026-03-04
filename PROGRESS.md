# CodingMachine Progress

## Task 01 - Audit current state of all endpoints (2026-03-04)
- Built `docs/audit-report.md` with full audit of 111 tools in endpoints.json
- 18 tools have llmTip, 93 do not (biggest gaps: Teams/Chat 17, Mail 15, Tasks 13, Files/Excel 12, SharePoint 12)
- Identified 7 custom `.describe()` params injected by graph-tools.ts + 12 from generated client; path params only get generic descriptions
- Documented 20 known Graph API quirks not yet in any llmTip (10 high priority, 10 medium)
- Key insight: highest-impact llmTip additions would be Planner (ETag requirement), move-mail (folder ID), search-query (body format), and create-draft-email (body format)

## Task 02 - Improve llmTips for mail endpoints (2026-03-04)
- Added/improved llmTip for 18 mail-related tools in endpoints.json
- New tips added to 10 tools that had none: get-mail-message, update-mail-message, create-draft-email, list-mail-folders, list-mail-child-folders, list-mail-attachments, move-mail-message, delete-mail-message, delete-mail-attachment
- Improved existing tips for 8 tools: list-mail-messages, list-mail-folder-messages, send-mail, forward-mail-message, reply-mail-message, reply-all-mail-message, list-shared-mailbox-messages, list-shared-mailbox-folder-messages, send-shared-mailbox-mail
- Key quirks now documented: $search/$filter cannot combine, $orderby ignored with $search, $count=true required for flag/flagStatus filters, well-known folder IDs (inbox/drafts/sentitems/etc.), move requires folder ID not name, update-mail-message body format, flag status values, $select recommendations, pagination via @odata.nextLink
- Build verified successfully

## Task 03 - Improve llmTips for calendar and files endpoints (2026-03-04)
- Added/improved llmTip for 12 tools: 5 calendar + 7 file/OneDrive
- Calendar tools updated: list-calendar-events (new), create-calendar-event (improved), update-calendar-event (improved), create-specific-calendar-event (improved), update-specific-calendar-event (improved)
- Calendar tips cover: recurring events warning (seriesMaster only, use get-calendar-view), ISO 8601 dateTime format with timeZone, attendees format with type (required/optional/resource), body contentType, $filter on start/end, attendee replacement warning on update
- File/OneDrive tools updated: list-drives (new), get-drive-root-item (new), get-root-folder (new, marked as duplicate), list-folder-files (new), download-onedrive-file-content (new), delete-onedrive-file (new), upload-file-content (new)
- File tips cover: 4MB upload limit, download returns URL not content, prefer item IDs over paths, get-root-folder duplicate flagged, $select recommendations, soft delete to recycle bin
- Build verified successfully

## Task 04 - Improve llmTips for remaining endpoints (2026-03-04)
- Added llmTip to all 65 remaining tools without tips across 9 categories
- Contacts (5): $filter limitations (startswith only), $search with ConsistencyLevel, emailAddresses array replacement warning
- Users (1): get-current-user $select guidance, returns user-id for delegation
- Search (1): search-query body format with requests array, entityTypes, KQL queryString, size limits
- OneNote (6): HTML requirement for page creation (full structure required), navigation flow (notebooks→sections→pages)
- Todo (6): HTML body contentType, status/importance values, list-first workflow
- Planner (7): CRITICAL If-Match ETag requirement for updates (412 without it), assignment format with @odata.type, priority values (0-9)
- Excel (5): A1 notation for ranges, chart types, sort/format body formats, worksheet-first workflow
- Teams/Chat (17): HTML contentType requirement for all messages (plain text gets mangled), @mentions support, chatType values, membershipType values
- SharePoint (12): $expand=fields requirement for list items, site-id format, delta sync, site-by-path
- Groups (3): marked as legacy with Teams recommendation
- Remaining mail (5): attachment 3MB limit, base64 contentBytes, draft workflow (create→send)
- Remaining calendar (6): seriesMaster delete warning, recurring event expansion, find-meeting-times body format with ISO 8601 duration
- All 20 known Graph API quirks from audit report now documented in llmTips
- Build verified successfully

## Task 05 - Improve parameter describe() in graph-tools.ts (2026-03-04)
- Added custom `.describe()` overrides for 7 OData parameters: $filter, $search, $select, $orderby, $top, $skip, $count
- Each override provides practical guidance: usage examples, constraints (e.g. $filter/$search mutual exclusion), and when $count=true is needed
- Replaced the existing verbose $count override with a shorter, consistent version matching the other params
- All overrides use the same key-detection pattern (checking both `name` and `$name` variants) for robustness
- Build verified successfully

## Task 07 - Fix silent catch blocks (2026-03-04)
- Fixed 2 empty catch blocks in graph-tools.ts that violated the "no silent catch" guideline
- Line 387: added `logger.debug('Non-JSON response, skipping parse')` to JSON parse catch
- Line 434: added error variable capture and included error details in existing logger.error for invalid regex pattern
- Key decision: used `logger.debug` for the non-JSON parse (expected/normal flow) vs `logger.error` for the regex failure (actual error)
- Build verified successfully

## Task 06 - Create CLAUDE.md with architecture and patterns (2026-03-04)
- Created `CLAUDE.md` in project root documenting full architecture, development workflow, and known quirks
- Architecture section covers: endpoints.json → graph-tools.ts → MCP tools pipeline, all EndpointConfig fields, auto-pagination (100 pages max), $count=true advanced query mode, discovery mode
- Adding/improving tools section: how to add llmTip, parameter describe() overrides, adding new endpoints, build commands
- Known Graph API quirks: consolidated all 20 quirks from audit-report.md into categorized summary (query limitations, mail, calendar, files, planner, teams/chat, onenote, sharepoint)
- Development section: all npm scripts, entry point flow, key files reference
- Key decision: kept CLAUDE.md concise and actionable — detailed audit data stays in docs/audit-report.md, CLAUDE.md serves as quick-reference for contributors
