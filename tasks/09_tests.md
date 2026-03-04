---
title: Add unit tests for critical Graph API tool logic
output: src/__tests__/graph-tools.test.ts
depends_on: 08_update-readme
verify: npm test
---

Read `src/graph-tools.ts` and `src/endpoints.json` before writing tests.

Add unit tests using vitest (already installed) for the following:

1. **$count advanced query mode** — when $count=true, verify ConsistencyLevel header is set
2. **fetchAllPages** — verify pagination follows @odata.nextLink and stops at page limit
3. **Parameter describe() overrides** — verify $filter, $search, $select, $orderby, $count overrides are applied
4. **returnDownloadUrl** — verify that when endpoint has returnDownloadUrl=true, @microsoft.graph.downloadUrl is returned
5. **supportsTimezone** — verify Prefer: outlook.timezone header is set when timezone param is provided

Use mocks for the Graph API client. Keep tests focused on the logic in graph-tools.ts, not the Graph API itself.

Output: `src/__tests__/graph-tools.test.ts`
