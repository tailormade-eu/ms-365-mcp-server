---
title: Improve parameter describe() in graph-tools.ts
output: src/graph-tools.ts
depends_on: 04_improve-other-tips
verify: npm run build
---

Read `src/graph-tools.ts`.

OData parameters ($filter, $search, $select, $orderby, $top, $skip, $count) are defined as a list (line ~140) and get their schema from generated code — meaning they have no custom describe().

In the section where `fetchAllPages`, `includeHeaders`, `excludeResponse` are added with custom `.describe()`:
Add similar overrides for OData params with informative descriptions:

- **$filter**: "OData filter expression. Add $count=true for advanced filters (flag/flagStatus, contains()). Cannot combine with $search."
- **$search**: "KQL search query, wrap in double quotes. Cannot combine with $filter. Example: \"from:john@example.com subject:meeting\""
- **$select**: "Comma-separated fields to return. Always use to reduce response size. Example: id,subject,from,receivedDateTime"
- **$orderby**: "Sort expression. Example: receivedDateTime desc"
- **$top**: "Max items per page (default varies, max 999 for mail). Server auto-paginates via nextLink."
- **$skip**: "Items to skip for manual pagination. Not supported with $search."
- **$count**: "Set true to enable advanced query mode (ConsistencyLevel: eventual). Required for complex $filter expressions like flag/flagStatus or contains()."

These overrides go AFTER the loop that builds paramSchema from tool.parameters, so they override the generated schema.

Run `npm run build` to verify.
