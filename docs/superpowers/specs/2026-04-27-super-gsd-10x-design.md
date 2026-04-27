# super-gsd v0.1.0 — 10X GSD Design Spec

**Date:** 2026-04-27
**Status:** APPROVED (brainstorm phase) — ready for implementation planning
**Author:** super-gsd team
**Forked from:** [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) v1.38.5 (snapshot 2026-04-25)
**Target package:** `super-gsd` on npm (verified available 2026-04-27)
**Target repo:** [`markxailabs/super-gsd`](https://github.com/markxailabs/super-gsd) on GitHub (confirmed 2026-04-27)

---

## 1. Mission

Take the latest GSD (v1.38.5) and add **30 upgrades across 4 tiers** to make it dramatically more autonomous, anti-hallucination disciplined, and architect-grade. Ship as a new npm package called `super-gsd` so it can be installed alongside or in place of stock GSD.

The upgrades are organized in 4 tiers from "foundation" to "veteran":

| Tier | Theme | Upgrade Count |
|---|---|---:|
| Tier 1 | Foundation — *makes GSD remember and self-fix* | 9 |
| Tier 2 | Iron Rules — *makes GSD stop hallucinating* | 8 |
| Tier 3 | Strict Process — *makes GSD code like a senior engineer* | 6 |
| Tier 4 | Veteran Layers — *makes GSD think like a 30-year architect* | 7 |
| **Total** | | **30** |

## 2. Done Definition

`super-gsd@0.1.0-preview.0` is "done" when:

- ✅ All 30 upgrades implemented (file changes landed, smoke-tested, committed)
- ✅ Each tier verified by tier-completion checkpoint with proof artifacts
- ✅ Dogfooded — tier N+1 was planned/executed using upgraded GSD from tier N
- ✅ Published to npm as `super-gsd@0.1.0-preview.0` under `--tag preview`
- ✅ GitHub repo public with README crediting original GSD (MIT-required attribution)
- ✅ `npx super-gsd@preview` installs cleanly and `/gsd-help` lists at least the 9 new commands from Tier 1

`super-gsd@1.0.0` (NOT in scope today) requires battle-tested usage, real bug fixes from real users, and a full integration test matrix.

## 3. Architecture

### 3.1 Disk layout

```
E:\GSD UPDATE\          READ-ONLY reference (clean upstream snapshot v1.38.5).
                        Never modified. Used as diff base + fallback.

E:\super-gsd\           Active workspace. Sibling fork.
  ├─ commands/gsd/      86 originals KEPT. Modify 4. Add 9 new.
  ├─ agents/            33 originals KEPT. Modify 4 (executor, planner, verifier, plan-checker).
  │                     Add 4 new (gsd-quality-gate, gsd-security-scan,
  │                                gsd-self-heal, gsd-brain-syncer).
  ├─ hooks/             11 originals KEPT. Add 4 new (super-gsd-iron-rules,
  │                     super-gsd-banned-phrases, super-gsd-pre-commit-gate,
  │                     super-gsd-import-verify).
  ├─ sdk/               KEPT, lightly modified for Iron Rule validators.
  ├─ scripts/           KEPT. Add 2 (super-gsd-publish.sh, super-gsd-self-test.sh).
  ├─ get-shit-done/     KEPT (legacy compat).
  ├─ super-gsd/         NEW. Templates: lessons.md, adr.md, premortem.md,
  │                     contract.md, scaffolds/.
  ├─ docs/superpowers/  NEW. specs/, decisions/, plans/.
  ├─ package.json       MODIFIED: name=super-gsd, version=0.1.0-preview.0.
  └─ CHANGELOG-SUPER.md NEW. Tracks super-gsd-only changes.

~/.gsd-brain/           NEW. Lives in user $HOME. Cross-project memory.
  ├─ PLAYBOOK.md        Engineering rules accumulated forever.
  ├─ ANTI-PATTERNS.md   Mistakes never to repeat.
  ├─ TECH-PREFERENCES.md User stack choices + rationale.
  ├─ QUALITY-GATES.md   User quality standards.
  ├─ SCAFFOLDS/         Battle-tested project templates.
  └─ HISTORY/           Compressed per-project summaries.
```

### 3.2 File modification strategy — "Way 3" (targeted hybrid)

Three rules govern where each upgrade lives:

1. **Modify existing files** ONLY for upgrades requiring deep behavior change.
   - `agents/gsd-executor.md` — self-heal loop, quality gates, TDD enforcement, observability.
   - `agents/gsd-planner.md` — `<test>` block, `<premortem>` block, `<contract>` block, anti-pattern check.
   - `agents/gsd-plan-checker.md` — reject plans missing `<test>` blocks.
   - `agents/gsd-verifier.md` — empirical evidence enforcement (ban "should work").
   - `commands/gsd/new-project.md` — auto-scaffold infra + load global brain.
   - `commands/gsd/complete-milestone.md` — trigger retrospective + brain sync.
   - `commands/gsd/plan-phase.md` — load PLAYBOOK + ANTI-PATTERNS pre-plan.
   - `commands/gsd/extract_learnings.md` — extend to also push lessons to `~/.gsd-brain/`.

2. **Add new files** in original namespace for new commands/agents/templates.
   - 9 new commands: `brain.md`, `ship.md`, `rollback.md`, `audit-architecture.md`, `quality-gate.md`, `security-scan.md`, `self-heal.md`, `premortem.md`, `adr.md`.
   - 4 new agents: `gsd-quality-gate.md`, `gsd-security-scan.md`, `gsd-self-heal.md`, `gsd-brain-syncer.md`.
   - Templates in `super-gsd/templates/`.

3. **Use hooks** for cross-cutting Iron Rules enforcement.
   - `super-gsd-iron-rules.js` — banned-phrase scanner (PreToolUse on Write/Edit, PreCommit on git).
   - `super-gsd-banned-phrases.js` — model-output scanner ("this should work" etc.).
   - `super-gsd-pre-commit-gate.js` — orchestrates lint+type+format+test before commit.
   - `super-gsd-import-verify.js` — checks imports exist before code is committed.

### 3.3 Upstream sync strategy

| Phase | Action |
|---|---|
| Today | Snapshot upstream at v1.38.5 (commit `9472f343`). No syncs during build. |
| End-of-day | First merge: `git fetch upstream && git merge upstream/main`. Resolve any conflicts on the ~8 modified core files. |
| Future milestones | Rebase or merge at each milestone boundary. |

`git remote` configuration in `E:\super-gsd\`:
- `upstream` → `https://github.com/gsd-build/get-shit-done.git` (already set ✅)
- `origin` → `https://github.com/markxailabs/super-gsd.git` (added when GitHub repo created)

### 3.4 Three-layer memory architecture

```
LAYER 3: GLOBAL BRAIN     ~/.gsd-brain/        Cross-project. Survives anything.
LAYER 2: PROJECT MEMORY   <project>/.planning/ Per-codebase. Survives sessions.
LAYER 1: SESSION MEMORY   STATE.md             Per-session. Survives /pause.
```

Existing GSD already has Layers 1 & 2. **Layer 3 is new in super-gsd.**

## 4. The 4 Tiers — Detailed

### 4.1 Tier 1 — Foundation (9 upgrades)

| # | Upgrade | Type | Files Touched |
|---|---|---|---|
| T1.1 | Global Brain | NEW dir + NEW command | `~/.gsd-brain/*`, `commands/gsd/brain.md`, `agents/gsd-brain-syncer.md` |
| T1.2 | Self-Heal Loop | MODIFY agent + NEW agent | `agents/gsd-executor.md`, `agents/gsd-self-heal.md` |
| T1.3 | Industry Bootstrap | MODIFY command | `commands/gsd/new-project.md`, `super-gsd/scaffolds/*` |
| T1.4 | Quality Gates | NEW agent + NEW hook + MODIFY agent | `agents/gsd-quality-gate.md`, `hooks/super-gsd-pre-commit-gate.js`, `agents/gsd-executor.md` |
| T1.5 | Lessons Sync | MODIFY command + NEW template | `commands/gsd/complete-milestone.md`, `commands/gsd/extract_learnings.md` (modify), `super-gsd/templates/lessons.md` |
| T1.6 | /ship | NEW command | `commands/gsd/ship.md` |
| T1.7 | /rollback | NEW command | `commands/gsd/rollback.md` |
| T1.8 | Drift Detection | NEW command | `commands/gsd/audit-architecture.md` |
| T1.9 | Security Scan | NEW agent + integrate | `agents/gsd-security-scan.md`, `commands/gsd/security-scan.md` |

**Tier 1 success criteria:** A user runs `super-gsd /brain show` and sees 4 empty brain files. Runs `/new-project` and gets auto-scaffolded CI+lint+Docker. Triggers a verify failure and sees self-heal attempt + recovery.

### 4.2 Tier 2 — Iron Rules (8 rules)

Anti-hallucination + CI integrity. Almost entirely **rules + enforcement**, not new commands.

| # | Rule | Enforcement Mechanism |
|---|---|---|
| T2.H1 | Verify Before Claim | Hook scans agent output for banned phrases. Hard fail if found without evidence. |
| T2.H2 | Never Import Without Verification | Hook intercepts Write/Edit on Python/JS files; scans imports; runs `pip show`/`npm view` for each. |
| T2.H3 | Never Assume, Always Read | Already partly enforced by `gsd-read-guard.js`. Extend to require Read before Edit on any file. |
| T2.H4 | No Mock-Heavy Tests | Hook scans test files for banned patterns (`MagicMock`-only tests, `assert response is not None`). |
| T2.H5 | Mutation Test | Add to executor prompt — every test must be designed to fail under standard mutations. |
| T2.C1 | No Silencing Errors | Hook scans for `except: pass`, bare `# type: ignore`, `@pytest.mark.skip` without reason. |
| T2.C2 | Coverage Must Be Meaningful | Add to quality-gate agent — branch coverage required, line-only coverage rejected. |
| T2.C3 | CI Pipeline Must Be Real | Bootstrap (T1.3) generates CI with all 4 mandatory stages, no `continue-on-error`. |

**Tier 2 success criteria:** Hook fires when a banned phrase appears in agent output. Hook blocks commit when `except: pass` is added. PROJECT_RULES.md contains all 8 rules with examples.

### 4.3 Tier 3 — Strict Process (6 areas)

Engineering discipline upgrades. Most are **prompt augmentations** to existing agents + new XML blocks.

| # | Area | Mechanism |
|---|---|---|
| T3.1 | TDD Enforcement | New `<test>` block in task XML. Plan-checker rejects plans with 0 test blocks. Executor commits test (RED) before code (GREEN). |
| T3.2 | Implementation Contracts | New `<contract>` block. Tests generated FROM contract. Contract wins on disagreement. |
| T3.3 | Error Handling Audit | Executor prompt — every external call answers 5 questions (timeout/null/error/unexpected/concurrent). |
| T3.4 | Input Validation Audit | Executor prompt — every boundary checks 6 axes (type/range/format/length/injection/auth). |
| T3.5 | Performance Budget | Executor measures endpoint timing post-implement. N+1 detection mandatory. |
| T3.6 | Security Per Commit | Quality-gate agent runs banned-pattern + secret scans pre-commit. |

**Tier 3 success criteria:** Plan-checker rejects a malformed plan missing `<test>` blocks. Executor refuses to write a function without a `<contract>`. Quality gate blocks commit when API_KEY is hardcoded.

### 4.4 Tier 4 — Veteran Layers (7 layers)

Architect-grade thinking. Mostly **new XML blocks + new patterns + new templates**.

| # | Layer | Mechanism |
|---|---|---|
| T4.1 | Pre-Mortem | New `<premortem>` block in task XML. Required for state mutations, external APIs, money. |
| T4.2 | Observability-First | Bootstrap adds structlog/pino; executor enforces correlation IDs in every endpoint. |
| T4.3 | Graceful Degradation | New `<degradation>` block; executor enforces timeout+retry+fallback for every external dep. |
| T4.4 | Data Integrity | Rules in PROJECT_RULES.md: no floats for money, atomic writes, idempotency keys, state machines, reversible migrations. |
| T4.5 | Architecture Decision Records | New `commands/gsd/adr.md`, template `super-gsd/templates/adr.md`. Required for big decisions. |
| T4.6 | Chesterton's Fence | Rule + executor prompt: `git blame` before modifying existing code. Banned: "this looks wrong, let me fix it". |
| T4.7 | Production Invariants | Executor enforces `assert` statements for cross-cutting invariants in live code. |

**Tier 4 success criteria:** Planner refuses to plan a payment endpoint without a `<premortem>`. Executor refuses to delete code without showing `git blame` output. Generated code includes structured logging with correlation IDs.

## 5. File Manifest Summary

| Category | Count |
|---|---:|
| **NEW files** | |
| New commands | 9 |
| New agents | 4 |
| New hooks | 4 |
| New templates | 4 |
| New scaffolds | 3 |
| Brain files | 6 |
| **Subtotal NEW** | **30** |
| **MODIFIED files** | |
| Modified agents | 4 (executor, planner, plan-checker, verifier) |
| Modified commands | 4 (new-project, complete-milestone, plan-phase, extract_learnings) |
| Modified hooks | 1 (extension to read-guard) |
| Modified rules | 2 (`PROJECT_RULES.md`, `GSD-STYLE.md`) |
| **Subtotal MODIFIED** | **11** |
| **Total touched** | **~41** |

This is small relative to the existing GSD codebase (86 commands + 33 agents + 11 hooks). Most of GSD stays untouched.

## 6. Dogfood Loop

The killer feature: **super-gsd is built using GSD, then verified by super-gsd.**

```
PHASE A — Bootstrap (cold start with stock GSD v1.38.5)
  Available tools: original GSD only.
  → /gsd-new-project (or use existing planning) on E:\super-gsd\
  → /gsd-new-milestone "Tier 1 Foundation"
  → /gsd-plan-phase 1.1 through 1.9
  → /gsd-execute-phase 1.1 through 1.9
  Output: super-gsd has Tier 1 features. Stock GSD planned and built them.

CHECKPOINT 1: Tier 1 complete. Show user proof: directory listing of new files,
              successful smoke tests, sample brain entry. Get approval.

PHASE B — Tier 2 (Tier 1 features active)
  Available tools: GSD + Tier 1 (Global Brain, Self-Heal, Quality Gates).
  → Brain loads pre-existing patterns. Self-heal active during execute.
  → Plan + execute Tier 2 (8 Iron Rules).
  Output: super-gsd now refuses to hallucinate.

CHECKPOINT 2: Tier 2 complete. Trigger a banned-phrase test. Show hook fires.
              Get approval.

PHASE C — Tier 3 (Tier 1+2 features active)
  Available tools: + Iron Rules. Anti-hallucination active during planning.
  → TDD enforcement built INTO plan structure.
  → Executor uses Iron Rules during Tier 3 self-construction.
  Output: super-gsd now codes like a senior.

CHECKPOINT 3: Show plan rejection on missing <test>. Get approval.

PHASE D — Tier 4 (Tier 1+2+3 features active)
  Available tools: + Strict Process. TDD active during planning.
  → Tier 4 designed test-first using Tier 3's enforcement.
  → Pre-mortem block written for risky upgrades like Production Invariants.
  Output: super-gsd thinks like an architect.

CHECKPOINT 4: Show ADR generated for a Tier 4 design choice. Get approval.

PHASE E — Ship
  → npm publish --tag preview
  → git push origin main
  → Tag v0.1.0-preview.0
```

**Why this ordering matters:** later tiers benefit from earlier tiers' enforcement. By Tier 4, every line of super-gsd has been touched by its own quality system.

## 7. Checkpoint Protocol

Each checkpoint between tiers requires:

1. **Diff summary** — files changed, lines added/removed, commits made.
2. **Smoke test output** — concrete proof the new commands run without crashing.
3. **One feature demo** — a hand-picked upgrade from this tier shown working end-to-end.
4. **Open issues list** — anything we punted on, with rationale.
5. **Explicit user approval** — `yes`/`go` before next tier starts.

If checkpoint fails:
- Diagnose (use Tier 1 self-heal if available).
- Fix forward, re-checkpoint.
- If unfixable today: punt to `0.1.x` follow-up release, document in CHANGELOG-SUPER.md, proceed to next tier.

## 8. Publishing Strategy

| Step | Command | Owner |
|---|---|---|
| 1. Reserve npm name | I prepare a temp dir `E:\npm-reserve-super-gsd\` with a minimal `package.json` (name=`super-gsd`, version=`0.0.0`, empty bin); user runs `npm publish` from that dir | User runs (needs `npm login`) |
| 2. Create GitHub repo | `gh repo create markxailabs/super-gsd --public` | User runs OR I run with explicit consent |
| 3. Push initial commit | `git push -u origin main` | After repo created |
| 4. Final publish | `npm publish --tag preview` | End of day, user runs |
| 5. Create GitHub release | `gh release create v0.1.0-preview.0 --prerelease` | Same time |
| 6. Verify install works | `npx super-gsd@preview --help` from a test dir | Smoke test |

**Credential boundary:** I never authenticate to npm or GitHub as the user. I prepare commands and the user runs them, OR the user explicitly hands me a token for a single operation.

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Doing 30 upgrades in one day yields preview-quality bugs | High | Medium | Versioned as `0.1.0-preview.0`, tagged `preview` on npm, NOT `latest`. Bug fixes in `0.1.x`. |
| Subagent merge conflicts on the ~7 deeply-modified files | Medium | High | Sequence work — never two subagents on same file simultaneously. Coordinator agent assigns waves. |
| Iron Rules hooks too aggressive, break existing flows | High | High | Hooks gated by env var `SUPER_GSD_STRICT=1`. Default OFF. Opt-in adoption. |
| Global Brain corruption from concurrent writes | Low | Medium | Use file locking (`proper-lockfile` npm package) + atomic write pattern. |
| Upstream merge debt grows during build | Medium | Medium | First merge end-of-day. Subsequent merges per-milestone. |
| npm name `super-gsd` squatted before we publish | Low | Low | Reserve placeholder `0.0.0` early today. |
| Auth credential leakage | Low | Critical | Never store credentials. User runs `npm publish` and `git push` themselves. |
| Self-heal loop infinite-loops on unfixable error | Low | High | Hard cap: 2 retries, then escalate + git stash. |
| Tier 1 Bootstrap generates wrong scaffold for unfamiliar stack | Medium | Low | Scaffold loads from `~/.gsd-brain/SCAFFOLDS/` with explicit user templates. Falls back to detected stack default. |
| Plan-checker rejection too strict, blocks valid plans | Medium | Medium | Override mechanism: `<no-test reason="...">` allowed for explicit edge cases. |

## 10. Decisions Locked

| ID | Decision | Choice | Reason |
|---|---|---|---|
| D-01 | Package name | `super-gsd` | Available on npm, distinct from upstream brand. |
| D-02 | Version scheme | `0.1.0-preview.0` → `0.1.x` → `1.0.0` | Preview release today, fixes throughout week, GA when battle-tested. |
| D-03 | Disk layout | Sibling fork at `E:\super-gsd\` | Safer than in-place. Preserves `E:\GSD UPDATE\` as clean reference. |
| D-04 | Upstream sync | Periodic merge at milestone boundaries | Stay close to upstream, manageable cadence. |
| D-05 | Execution mode | Tier checkpoints (4 checkpoints) | User stays in control of quality. |
| D-06 | Architecture | Way 3 — Targeted hybrid | Modify deep core files + add new files + use hooks for rules. |
| D-07 | Iron Rules default | OFF (`SUPER_GSD_STRICT=1` to opt-in) | Gradual adoption. Power users opt in. |
| D-08 | npm name reservation | Reserve today with `0.0.0` placeholder | Cheap insurance against squatting. |
| D-09 | Credential handling | I never auth as user; user runs publish/push | Zero credential exposure. |
| D-10 | License | MIT (matches upstream) | Original GSD is MIT. Fork must honor. |

## 11. Out of Scope (explicit YAGNI)

| Item | Why excluded |
|---|---|
| GUI / web dashboard for super-gsd | Out of scope for v0.1. CLI-only. |
| Migration tool from stock GSD to super-gsd | Both can coexist via different bin names. No migration needed. |
| Telemetry / usage analytics | Privacy-preserving by default. Not adding. |
| Cloud-hosted Global Brain (sync across machines) | Local-only for v0.1. Multi-machine sync = future. |
| Plugin marketplace | Way too premature. |
| New runtime support beyond what stock GSD has | Inherit upstream's 14-runtime support. No additions. |
| Rewriting the SDK | SDK gets light extensions only. No rewrite. |
| Support for older Node versions | Inherit upstream's `node>=22`. |
| Backporting Tier features to upstream as PRs | Out of scope today. Future possibility. |
| Visual regression testing for any UI | We don't ship UI. |
| i18n of super-gsd-specific docs | English only for v0.1. Inherit upstream's translations. |

## 12. Open Items (resolve before plan)

| # | Item | Default if not resolved |
|---|---|---|
| O-01 | ~~GitHub owner/org for the new repo~~ | **RESOLVED 2026-04-27:** `markxailabs` confirmed by user. |
| O-02 | npm publishing account | User must `npm login` before publish step — **defer to user** |
| O-03 | First Global Brain seed content | Empty files with comments. User adds rules over time. |
| O-04 | Whether to back-port any Tier features to upstream as PRs | NOT in v0.1 scope. Re-evaluate post-launch. |

## 13. References

- Source idea docs: `E:\GSD UPDATE\NEW MODIFICATION IDEA\` (6 files, ~95 KB)
- Upstream snapshot: gsd-build/get-shit-done @ `9472f343` (2026-04-25 release)
- License: MIT (upstream) → MIT (super-gsd)

---

**Spec status:** AWAITING USER REVIEW. After user approves, hand to `superpowers:writing-plans` skill to produce the implementation plan.
