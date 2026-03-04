---
title: Update README with patterns and known quirks
output: README.md
depends_on: 06_update-claude-md
verify:
---

Read `README.md`, `CLAUDE.md`, `docs/audit-report.md`.

Add a section "Graph API Tips & Known Quirks" to the README covering:
- Advanced query mode: $count=true required for complex $filter
- $filter vs $search: cannot combine
- Flagged mail: use $filter with $count=true, not flaggedItems folderId + $search
- update-mail-message: body wrapper required ({"isRead": true})
- Special folder IDs: flaggedItems, inbox, drafts, sentitems, deleteditems, junkemail
- Flag status values: flagged, complete, notFlagged

Keep it concise. Do not rewrite existing README content.
