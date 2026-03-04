---
title: Audit current state of all endpoints
output: docs/audit-report.md
verify:
---

Read `src/endpoints.json` and `src/graph-tools.ts`.

Produce `docs/audit-report.md` with:

1. Total tool count
2. Tools WITH llmTip (list name + first 80 chars of tip)
3. Tools WITHOUT llmTip (grouped by category: mail, calendar, files, contacts, tasks, onenote, users, search, other)
4. Parameters in graph-tools.ts that have a custom `.describe()` vs generic/none
5. Known Graph API quirks NOT yet documented in any llmTip (based on your knowledge of the Graph API)

Be concise. This is input for the next tasks.
