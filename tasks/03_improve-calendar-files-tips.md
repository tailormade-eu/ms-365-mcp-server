---
title: Improve llmTips for calendar and files endpoints
output: src/endpoints.json
depends_on: 02_improve-mail-tips
verify: npm run build
---

Read `docs/audit-report.md` and `src/endpoints.json`.

For calendar tools (list-calendar-events, create-calendar-event, update-calendar-event, create-specific-calendar-event, update-specific-calendar-event):
Add/improve llmTip covering:
- DateTime format: ISO 8601 with timezone (e.g. 2026-03-04T09:00:00)
- $filter on start/end: use `start/dateTime ge '...'` syntax
- Recurring events: only series masters returned by default, use $expand=instances for occurrences
- Attendees format: array of {emailAddress: {address, name}, type: required|optional}
- Body format: {contentType: html|text, content: "..."}

For file/OneDrive tools (list-drive-items, get-drive-item, upload-drive-item, delete-drive-item, etc.):
Add/improve llmTip covering:
- Path format: /me/drive/root:/path/to/file:/content
- Item ID vs path: prefer ID for reliability
- Large files: use upload session for >4MB
- $search on OneDrive: works differently than mail search

Only modify llmTip fields. Do not change other fields.
Run `npm run build` to verify.
