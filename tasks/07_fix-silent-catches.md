---
title: Fix silent catch blocks
output: src/graph-tools.ts
depends_on: 05_improve-parameter-describes
verify: npm run build
---

Read `src/graph-tools.ts`.

Guidelines violation: `} catch {}` with empty body is forbidden. Every catch must log context.

Fix all empty catch blocks:
- Line ~387: `} catch { // Non-JSON response }` → add `logger.debug('Non-JSON response, skipping parse');`
- Any other empty catch blocks found in the file

Do not change logic, only add logging to empty catches.
Run `npm run build` to verify.
