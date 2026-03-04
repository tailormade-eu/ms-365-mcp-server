---
title: Improve llmTips for mail endpoints
output: src/endpoints.json
depends_on: 01_audit-current-state
verify: npm run build
---

Read `docs/audit-report.md` and `src/endpoints.json`.

For ALL mail-related tools (list-mail-messages, list-mail-folder-messages, get-mail-message, update-mail-message, create-draft-email, send-mail, list-mail-folders, list-mail-child-folders, list-mail-attachments, forward-mail-message, move-mail-message, reply-mail-message, reply-all-mail-message, delete-mail-message, delete-mail-attachment, list-shared-mailbox-*, send-shared-mailbox-mail):

Add or improve `llmTip` in `src/endpoints.json` covering known Graph API quirks:
- $filter limitations and when $count=true is required (advanced query mode)
- $search vs $filter: cannot combine them
- flag/flagStatus filtering requires $count=true
- Special folder IDs: flaggedItems, inbox, drafts, sentitems, deleteditems, junkemail
- update-mail-message: body must be wrapped as `{"isRead": true}` not direct param
- Pagination: auto-handled via @odata.nextLink, use $top to control page size
- $select: always use to reduce response size
- Mail flag status values: flagged, complete, notFlagged

Only modify llmTip fields. Do not change other fields.
Run `npm run build` to verify.
