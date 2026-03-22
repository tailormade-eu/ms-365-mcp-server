# ms-365-mcp-server — Testing

## Acceptance Tests

| # | Test | Command/Action | Expected | Status |
|---|------|----------------|----------|--------|
| 1 | Build | `npm run build` | 0 errors | ✅ |
| 2 | Unit tests | `npm run test` | All 83 tests pass | ✅ |
| 3 | Lint | `npm run verify` | 0 lint errors, build + test pass | ⬜ |
| 4 | MCP stdio | `node dist/index.js` | Server starts, tools registered | ⬜ |
| 5 | Auth flow | Login via MCP client | Token acquired, account listed | ⬜ |
| 6 | List mail | `list-mail-messages` tool | Returns inbox messages | ⬜ |
| 7 | Calendar view | `get-calendar-view` tool | Returns events for date range | ⬜ |
| 8 | Planner tasks | `list-planner-tasks` tool | Returns tasks with ETag | ⬜ |
| 9 | Discovery mode | `--discovery` flag | Only search-tools + execute-tool registered | ⬜ |
| 10 | Pagination | `fetchAllPages=true` on list endpoint | All pages concatenated | ⬜ |

**Score: 2/10**

---

**Legend:** ✅ pass | ❌ fail | ⬜ not tested | 🔄 flaky
