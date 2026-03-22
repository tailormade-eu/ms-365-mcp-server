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

## Task 10 — New endpoints added

### OneNote — individual page operations
| Tool | Method | Path |
|------|--------|------|
| `get-onenote-page` | GET | `/me/onenote/pages/{onenotePage-id}` |
| `delete-onenote-page` | DELETE | `/me/onenote/pages/{onenotePage-id}` |
| `update-onenote-page` | PATCH | `/me/onenote/pages/{onenotePage-id}/content` |

### OneNote — group/Teams notebooks
| Tool | Method | Path |
|------|--------|------|
| `list-group-onenote-notebooks` | GET | `/groups/{group-id}/onenote/notebooks` |
| `list-group-onenote-sections` | GET | `/groups/{group-id}/onenote/notebooks/{notebook-id}/sections` |
| `list-group-onenote-section-pages` | GET | `/groups/{group-id}/onenote/sections/{onenoteSection-id}/pages` |
| `get-group-onenote-page-content` | GET | `/groups/{group-id}/onenote/pages/{onenotePage-id}/content` |
| `create-group-onenote-page` | POST | `/groups/{group-id}/onenote/sections/{onenoteSection-id}/pages` |

### Teams — meeting management
| Tool | Method | Path |
|------|--------|------|
| `create-online-meeting` | POST | `/me/onlineMeetings` |
| `get-online-meeting` | GET | `/me/onlineMeetings/{onlineMeeting-id}` |
| `list-meeting-attendance-reports` | GET | `/me/onlineMeetings/{onlineMeeting-id}/attendanceReports` |

### Teams — channel management
| Tool | Method | Path |
|------|--------|------|
| `create-team-channel` | POST | `/teams/{team-id}/channels` |

---

**Score: 2/10**

---

**Legend:** ✅ pass | ❌ fail | ⬜ not tested | 🔄 flaky
