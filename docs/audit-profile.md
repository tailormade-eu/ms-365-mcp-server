# Audit profile — Tailormade.Ms365Mcp

Referentiemetingen voor `/cm-codebase-audit` op deze fork, met de vaste tellers uit
`Tailormade.CodingMachine/tools/`. Zie die repo voor het contract en de andere assen.

**Waarom dit bestand bestaat.** Zonder een gepinde meting kun je later niet bewijzen
dat een refactor niets sloopte — je hebt dan alleen een nieuwe teruggave om tegen te
vergelijken, geen vastgelegde nulmeting. Bij wijziging van deze repo die de cijfers
raakt: opnieuw meten, niet handmatig bijschatten.

## Referentiemeting — survey-census, node/ts-pilot, 2026-09-02

Gemeten met (vanuit de CM-repo):

```
python tools/audit-survey-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek.

| Meting | Aantal |
|---|---|
| bestanden totaal (productie / test) | 23 (20 / 3) |
| regels totaal (productie) | 29.023 (28.139) |
| bestanden > 1000 regels | 2 |
| type-declaraties (class / interface) | 21 (7 / 14) |
| static classes, productie | 0 |
| abstract classes, productie | 0 |
| dubbele type-namen | 1 — `EndpointConfig` (2x) |
| `TODO`/`FIXME`/`HACK`/`XXX` in commentaar | 0 |

**Nagemeten tegen een ruwe `grep`, om de masker te toetsen:**

```
class:      ruw 8  vs  geteld 7   — verschil is generated/client.ts:6689,
                                     "class" staat daar in een string-literal
interface:  ruw 14 vs  geteld 14  — geen verschil
```

Dit is de eerste node/ts-meting met deze teller (pilot voor B-tellers-node-php, zie
`08-AUTOMATION/cm/plans/MODEL-WISSELTEST-20260830.md` in de vault voor de aanleiding).
`generated/client.ts` (23.777 regels, auto-gegenereerde Graph-SDK-types) domineert de
regeltelling — dat is verwacht, niet een bevinding.

⚠️ **Grenzen van de node/ts-masker, zie ook `audit_source_mask.py`:** regex-vs-deling
is een heuristiek (niet elke `/` is met zekerheid correct geclassificeerd), en een
`${…}`-hole in een template-literal wordt niet verder getokenized als er zelf weer
een backtick of string in genest zit. Voor deze meting (declaraties + markers buiten
strings/commentaar) heeft geen van beide grenzen zich voorgedaan.

## Referentiemeting — catch-census, node/ts-pilot, 2026-09-02

Gemeten met:

```
python tools/audit-catch-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek.

| Meting | Aantal |
|---|---|
| bestanden gescand | 23 |
| ruwe `catch`-treffers (na maskeren) | 49 |
| echte catch-blokken | 47 |
| kaal (`catch {` zonder binding) | 5 |
| ongetypeerd (`catch (e) {`) | 42 |
| getypeerd (`catch (e: T) {`) | 0 |
| body echt leeg | 0 |
| alleen commentaar in de body | 0 |
| rethrow aanwezig | 6 |
| logt en gaat door | 29 |
| `return null`/`undefined`/`;` in de catch | 1 |
| … daarvan zonder log | 0 |

**Het verschil ruw (49) vs echt (47) is geen meetfout maar een JS-eigen ruisbron:**
zelf nagelezen, allebei zijn `.catch(...)` op een Promise-keten, geen
foutafhandelings-clausule — `secrets.ts:75` en `auth-tools.ts:32`
(`getSecret(name).catch((err) => {...})`, `acquireTokenByDeviceCode(resolve).catch(reject)`).
De teller herkent dat correct: na de `(...)` volgt geen `{` direct (wel `=>` eerst),
dus telt hij niet als "echt blok". Waarom dit in C# niet voorkomt: daar heeft `catch`
geen `.catch(`-methodeaanroep-equivalent.

**Classificatie is niet C#'s kaal/breed/specifiek** — JS/TS heeft geen exception-types
op `catch`. In plaats daarvan: kaal (geen binding) / ongetypeerd (`catch (e)`, geen
`:`-typeannotatie) / getypeerd (`catch (e: T)`, wel een typeannotatie — enige legale
TS-typen zijn `unknown`/`any`). Deze codebase typeert zijn catch-bindings nergens
(0 getypeerd) — dat is een observatie, geen bevinding.

Nog niet nagelezen tegen een ruwe grep zoals bij survey-census — de `.catch(`-ruis
hierboven maakt zo'n ruwe vergelijking zelf misleidend zonder dezelfde filtering.

## Referentiemeting — tests-census, node/ts-pilot, 2026-09-02

Gemeten met:

```
python tools/audit-tests-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek. Nagemeten tegen ruwe `grep`: 20 van 20
`it(`/`test(`-treffers in `__tests__/*.ts` — geen verschil.

| Meting | Aantal |
|---|---|
| testbestanden | 3 |
| testmethodes totaal | 20 |
| … bare `it()`/`test()` | 20 |
| … `.each()`-parameterized | 0 |
| overgeslagen tests | 0 |
| reden bij skip | n.v.t. — vitest/jest kennen geen reden-parameter op `.skip()` |
| gedeelde basisklassen | n.v.t. — geen class-based test-basis in vitest/jest |
| raakt de echte wereld (integratie) | 0 |
| alleen substituten (geïsoleerd) | 2 |
| beide signalen (gemengd) | 0 |
| geen van beide signalen | 1 |
| testbestanden > 500 regels | 1 |

⚠️ **Twee assen bestaan hier niet en zijn niet vervangen door een gok:** de
skip-reden-kolom (vitest/jest hebben geen `Skip = "..."`-parameter zoals xUnit) en
gedeelde basisklassen (geen class-based test-fixture-conventie in vitest). Beide zijn
in het script expliciet `n.v.t.`, niet stilzwijgend 0.

## Referentiemeting — stale-census, node/ts-pilot, 2026-09-02

Gemeten met:

```
python tools/audit-stale-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek.

| Meting | Aantal |
|---|---|
| `@deprecated`-declaraties | 0 |
| migratie-achtige bestanden | 0 |
| magic strings (3+ productiebestanden) | 28 |
| state-bestandsnamen (`.json`, in 2+ bestanden) | 2 — `endpoints.json` (4), `package.json` (2) |
| `fs.watch()`/`chokidar.watch()`-vindplaatsen | 0 |

⚠️ **`[Obsolete]` is vervangen door JSDoc `@deprecated`**, gezocht binnen
commentaar-spans (niet in code, want het is een comment-tag, geen attribuut). Geen
treffers in deze repo — dat is een observatie (deze fork markeert niets als
verouderd), geen bevinding.

## Referentiemeting — structure-census, node/ts-pilot, 2026-09-02

Gemeten met:

```
python tools/audit-structure-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek. Import-matrix nagemeten tegen `grep` op
`lib/microsoft-auth.ts` en de drie bestanden die `./lib/...` importeren — exacte match
(2x `lib → (root)`, 3x `(root) → lib`).

| Meting | Aantal |
|---|---|
| bestanden in de root-map (productie) | 15 |
| namespace/mismatch-vragen | n.v.t. — js/ts kent geen `namespace`-declaratie |
| productie-submappen | 2 — `generated`, `lib` |
| … zelfstandig (0 imports naar andere mappen) | 1 — `generated` |
| opwaartse imports (submap leest root) | 4 |
| map-naar-map-relaties | 5 |
| testmappen | 1 — `__tests__` |

⚠️ **Andere as dan bij cs.** JS/TS heeft geen `namespace`-declaratie en geen `.csproj`
-projectgrens — een module se identiteit is zijn bestandspad. De
namespace/root-namespace-mismatch-vragen zijn dus **n.v.t.**, niet "0 mismatches". Wat
overeind blijft: de import-matrix, nu afgeleid uit relatieve `import … from './x'`/
`require('./x')`-specifiers in plaats van `using`-regels.

## Referentiemeting — git-census, node/ts-pilot, 2026-09-02

Gemeten met:

```
python tools/audit-git-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek.

| Meting | Aantal |
|---|---|
| git-helper-aanroepen (productie) | 0 |
| bestanden die met git praten (productie) | 0 |
| mogelijke omzeilingen (`child_process`/`exec`/`spawn` naast "git") | 0 |
| destructieve subcommando's gevonden | 6 |

Deze MCP-server heeft geen eigen git-wrapper — 0 is hier het verwachte cijfer, geen
gat. De 6 destructieve-subcommando-literals liggen in test-/gegenereerde bestanden.

## Referentiemeting — cli-census, node/ts-pilot, 2026-09-02

Gemeten met:

```
python tools/audit-cli-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek.

| Meting | Aantal |
|---|---|
| vlag-literals totaal (uniek) | 15 (13 lang · 2 kort) |
| lange vlaggen in productiecode | 13 |
| … in 2+ productiebestanden (verdenking) | 0 |
| productiebestanden met vlag-literals | 2 — `cli.ts` (14), `generated/client.ts` (1) |

Geen duplicaat-verdenkingen — `cli.ts` is de enige echte CLI-dispatch-plek in deze
repo, de vlaggen wonen dus al op één plek.

## Referentiemeting — perf-census, node/ts-pilot, 2026-09-02

Gemeten met:

```
python tools/audit-perf-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek. `async zonder await` steekproefsgewijs
nagelezen (`server.ts:198`, een Express-route-handler) — terecht: geen `await` in de
body.

| Meting | Aantal |
|---|---|
| lussen met accolades (productie) | 19 |
| bestanden met `performance.now()`/`console.time()` | 0 |
| sync-over-async | n.v.t. — een JS-Promise is niet blokkeerbaar zoals C#'s `.Result` |
| async-methodes zonder await | 23 (top: `server.ts` 6x, `custom-tools.ts` 4x) |
| I/O binnen een lus | 0 |
| string-opbouw binnen een lus | 0 |
| `new RegExp()` binnen een lus | 0 |

⚠️ **Twee rijen zijn een andere vraag dan bij cs.** Sync-over-async bestaat niet in
JS (geen blokkerende wacht op een Promise). En "regex zonder Compiled" bestaat niet —
JS-regex-literals hebben geen compileer-vlag; de vertaalde risicovraag is of een
`new RegExp(...)` BINNEN een lus staat (hem elke iteratie herbouwt), niet of een
losse regex ergens in het bestand een vlag mist.

## Referentiemeting — cleanup-census, node/ts-pilot, 2026-09-02

Gemeten met:

```
python tools/audit-cleanup-census.py --root D:/source/repos/Tailormade/Tailormade.Ms365Mcp/src --lang node
```

Twee keer gedraaid, uitvoer byte-identiek.

| Meting | Aantal |
|---|---|
| interfaces in productiecode | 13 |
| … met NUL implementaties in deze bron | 12 |
| … met precies EEN implementatie | 1 — `SecretsProvider` ← `secrets.ts` |
| LEGE interfaces (marker, geen leden) | 0 |
| parameterlijsten > 5 (methodes/functies) | 4 |
| bestanden met nesting-diepte ≥ 7 | 8 |

⚠️ **12 van de 13 interfaces zonder implementatie is GEEN alarm hier.** Anders dan in
C#, waar een interface meestal een polymorfie-punt is, gebruikt idiomatisch TS
interfaces vooral als TYPE-SHAPE (`interface CommandOptions { verbose: boolean }`) —
nooit "geïmplementeerd" door een class, en dat is normaal. De kandidatenlijst blijft
dus een kandidatenlijst, geen bevinding — lees hem met dat verschil in het hoofd.

⚠️ **De parameterlijst-teller mist arrow-functies toegewezen aan een variabele**
(`const f = (a, b, c) => {}`) — hij matcht alleen `naam(...) {`-vormen. Bekende
ONDERCOUNT voor arrow-zware code, zie de moduledoc van het script.

✅ **Bijvangst: een echte bug gevonden en gefixt tijdens deze meting, in de
gedeelde `top_level_param_count()`-logica — raakt dus OOK de C#-telling.** De oude
`params.count(",") + 1` telde een comma BINNEN een generic-argument mee als een
extra parameter: `Record<string, z.ZodTypeAny>` als parametertype gaf één parameter
te veel. Gemeten op `registerSingleTool()` (`graph-tools.ts:514`): 9 echte
parameters, eerst 11 geteld — twee generic-comma's. Gefixt met een depth-aware
teller (`<()[]{}` genegeerd). **De C#-telling in de CM-repo's eigen
`docs/audit-profile.md` daalde daardoor van 85 naar 77**, zonder dat de bron
veranderde — puur de meetfout weg. Zie dat bestand, sectie cleanup-census.
