---
title: Improve llmTips for remaining endpoints
output: src/endpoints.json
depends_on: 03_improve-calendar-files-tips
verify: npm run build
---

Read `docs/audit-report.md` and `src/endpoints.json`.

For all remaining tools without llmTip (contacts, tasks/todo, onenote, search, users, teams, excel — see audit report):

Add a concise llmTip per tool covering:
- Key parameters and their format
- Common errors and how to avoid them
- Output format and how to use it
- Any Graph API quirks specific to this endpoint

Cross-reference with Microsoft Graph API documentation (https://learn.microsoft.com/en-us/graph/api/overview) to verify parameter names and known limitations.

Priority: tools used most often first (contacts > users > search > onenote > todo > excel > teams).

Only modify llmTip fields. Do not change other fields.
Run `npm run build` to verify.
