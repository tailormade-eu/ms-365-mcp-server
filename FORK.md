# Tailormade Fork — ms-365-mcp-server

Fork van [softeria/ms-365-mcp-server](https://github.com/softeria/ms-365-mcp-server).

## Open PRs naar upstream

| PR | Status | Wat |
|----|--------|-----|
| [#259](https://github.com/softeria/ms-365-mcp-server/pull/259) | 🟡 OPEN | llmTips, OData describe overrides, Windows chmod fix, tests, README tips |

## Fixes — klaar voor upstream PR (nog geen PR)

| Commit | Wat | Prioriteit |
|--------|-----|-----------|
| `05384c6` | fix: preserve literal commas in OData query param values | Hoog |
| `dc72275` | fix: don't URL-encode query param keys ($ in $select, $filter) | Hoog |
| `75829f0` | fix: auto-inject missing path params from tool.path into paramSchema | Hoog |
| `bfc0d9c` | fix: kebab-case path params (message-id → messageId) | Hoog |
| `8493f80` | fix: Prefer IdType=ImmutableId header (prevents RequestBroker errors) | Hoog |
| `685facb` | docs: $select not supported on get-todo-task (llmTip) | Medium |
| `1f936bb` | docs: $select not supported on list-todo-tasks (llmTip) | Medium |
| `2c28fac` | docs: $select not supported on list-todo-task-lists (llmTip) | Medium |
| `0b029e2` + `dd3f3e8` | test: unit tests voor path param + kebab-case normalisatie | Medium |

## Fork-only (NIET naar upstream)

| File / Feature | Waarom fork-only |
|----------------|-----------------|
| `src/custom-tools.ts` | Compound/workflow tools met lokale file writes — te specifiek voor upstream |
| `update-todo-cache` tool | Tailormade-specifieke cache workflow (outputPath, subject-join workaround) |
| `CLAUDE.md` | Tailormade dev context |
| `BACKLOG.md`, `STATUS.md` | Intern |
| `.claude/`, `tasks/` | CodingMachine workflow files |

## Upstream synchronisatie

Upstream: `https://github.com/softeria/ms-365-mcp-server`

```bash
git fetch upstream
git log HEAD..upstream/main          # nieuwe upstream commits
git log upstream/main..HEAD          # onze commits bovenop upstream
```

**Laatste sync:** upstream was op `66dcdca` toen wij onze branch maakten.
**Upstream nu:** `8498efe` (v0.45.2 — 4 nieuwe commits, inc. token cache fix + online meeting tools).
**Actie nodig:** merge of rebase op `upstream/main`.

## Changelog (Tailormade additions)

| Datum | Wat |
|-------|-----|
| 2026-03-12 | `update-todo-cache` tool toegevoegd in `custom-tools.ts` |
| 2026-03 | ImmutableId header fix, komma/$ encoding fixes, path param fixes, llmTips, tests |
