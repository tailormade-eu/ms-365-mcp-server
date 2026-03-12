# Tailormade Fork — ms-365-mcp-server

Fork van [softeria/ms-365-mcp-server](https://github.com/softeria/ms-365-mcp-server).

## Open PRs naar upstream

| PR | Status | Wat |
|----|--------|-----|
| [#259](https://github.com/softeria/ms-365-mcp-server/pull/259) | 🟡 OPEN | llmTips, OData describe overrides, Windows chmod fix, tests, README tips |
| [#269](https://github.com/softeria/ms-365-mcp-server/pull/269) | 🟡 OPEN | Bug fixes: OData param encoding, path param injection, ImmutableId header |
| [#270](https://github.com/softeria/ms-365-mcp-server/pull/270) | 🟡 OPEN | docs: llmTips voor todo endpoints ($select niet supported) |

## Fixes — klaar voor upstream PR (nog geen PR)

*(leeg — alles ingediend)*

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

**Laatste sync:** 2026-03-12 — merged upstream v0.45.2 (`8498efe`).

## Changelog (Tailormade additions)

| Datum | Wat |
|-------|-----|
| 2026-03-12 | `update-todo-cache` tool toegevoegd in `custom-tools.ts` |
| 2026-03 | ImmutableId header fix, komma/$ encoding fixes, path param fixes, llmTips, tests |
