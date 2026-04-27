# super-gsd — 10X GSD Upgrade

## What This Is

`super-gsd` is a fork of [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) v1.38.5 that adds 30 autonomy and discipline upgrades across 4 tiers (Foundation, Iron Rules, Strict Process, Veteran Layers). Built for solo developers and small teams who want GSD to behave like an autonomous senior engineering partner — remembering across projects, self-healing on failures, refusing to hallucinate, and thinking like a 30-year architect. Shipped to npm as `super-gsd` so users can opt in alongside or in place of stock GSD.

## Core Value

**GSD that remembers, self-heals, and refuses to hallucinate** — autonomy and rigor where stock GSD currently asks the user to fill the gap. Every other improvement is in service of this.

## Requirements

### Validated

<!-- Inherited from upstream GSD v1.38.5 — these capabilities are already shipped and working. -->

- ✓ **86 GSD slash commands** — full GSD command surface (plan-phase, execute-phase, complete-milestone, etc.) — upstream v1.38.5
- ✓ **33 specialized agents** — gsd-planner, gsd-executor, gsd-verifier, gsd-debugger, etc. — upstream v1.38.5
- ✓ **11 hooks** — context monitor, prompt guard, statusline, etc. — upstream v1.38.5
- ✓ **GSD SDK** — TypeScript-based command/config tooling — upstream v1.38.5
- ✓ **14-runtime support** — Claude Code, OpenCode, Gemini, Codex, Cursor, Windsurf, etc. — upstream v1.38.5
- ✓ **Atomic commit + state-managed workflows** — STATE.md, JOURNAL.md, .planning/ structure — upstream v1.38.5
- ✓ **Brownfield detection + project initialization** — `/gsd-new-project`, `/gsd-map-codebase` — upstream v1.38.5

### Active

<!-- 30 upgrades across 4 tiers. Hypotheses until shipped + dogfooded. -->

**Tier 1 — Foundation (9 upgrades)**

- [ ] **T1.1**: Global Brain — `~/.gsd-brain/` cross-project memory (PLAYBOOK, ANTI-PATTERNS, TECH-PREFERENCES, QUALITY-GATES, SCAFFOLDS, HISTORY)
- [ ] **T1.2**: Self-Heal Loop — executor auto-fixes verify failures (2 retries before escalation)
- [ ] **T1.3**: Industry Bootstrap — auto-scaffold CI/lint/Docker/tests on `/gsd-new-project`
- [ ] **T1.4**: Quality Gates — pre-commit format/lint/typecheck/test orchestration
- [ ] **T1.5**: Lessons Sync — `/gsd-complete-milestone` distills lessons → Global Brain
- [ ] **T1.6**: `/gsd-ship` — release workflow (tests + changelog + version + tag + deploy checklist)
- [ ] **T1.7**: `/gsd-rollback` — clean phase undo
- [ ] **T1.8**: `/gsd-audit-architecture` — drift detection between code and ARCHITECTURE.md
- [ ] **T1.9**: Security Scan — dependency CVE check on plan/execute/ship

**Tier 2 — Iron Rules (8 rules) — anti-hallucination + CI integrity**

- [ ] **T2.H1**: Verify Before Claim — banned phrase scanner + required evidence format
- [ ] **T2.H2**: Never Import Without Verification — package + import + signature check
- [ ] **T2.H3**: Never Assume, Always Read — extend `gsd-read-guard` to require Read before Edit
- [ ] **T2.H4**: No Mock-Heavy Tests — banned tautological/assert-nothing/mock-everything patterns
- [ ] **T2.H5**: Mutation Test — every test must fail under standard mutations
- [ ] **T2.C1**: No Silencing Errors — banned `except: pass`, bare `# type: ignore`, `@skip` no reason
- [ ] **T2.C2**: Coverage Must Be Meaningful — branch coverage + critical-path floors
- [ ] **T2.C3**: CI Pipeline Must Be Real — 4 mandatory stages, no `continue-on-error`

**Tier 3 — Strict Process (6 areas)**

- [ ] **T3.1**: TDD Enforcement — `<test>` block in task XML, plan-checker rejects 0-test plans
- [ ] **T3.2**: Implementation Contracts — `<contract>` block (inputs/outputs/invariants/errors/side-effects/perf)
- [ ] **T3.3**: Error Handling Audit — every external call answers 5 questions (timeout/null/error/unexpected/concurrent)
- [ ] **T3.4**: Input Validation Audit — every boundary checks 6 axes (type/range/format/length/injection/auth)
- [ ] **T3.5**: Performance Budget — endpoint timing budgets + N+1 detection
- [ ] **T3.6**: Security Per Commit — auto-scan for secrets, SQL concat, eval, CORS wildcards

**Tier 4 — Veteran Layers (7 layers)**

- [ ] **T4.1**: Pre-Mortem — `<premortem>` block predicts 5 failures before implementation
- [ ] **T4.2**: Observability-First — structured logging, correlation IDs, health endpoints from day one
- [ ] **T4.3**: Graceful Degradation — `<degradation>` matrix (timeout + retry + fallback per dep)
- [ ] **T4.4**: Data Integrity — money in cents, atomic writes, idempotency keys, state machines, reversible migrations
- [ ] **T4.5**: ADRs — `/gsd-adr` command + template for big decisions
- [ ] **T4.6**: Chesterton's Fence — git blame before modifying existing code
- [ ] **T4.7**: Production Invariants — live `assert` statements catching violations

### Out of Scope

- **GUI / web dashboard** — CLI-only for v0.1. Adding GUI is a separate milestone.
- **Cloud-hosted Global Brain (multi-machine sync)** — Local-only for v0.1. Multi-machine = future.
- **Plugin marketplace** — Premature. Wait for actual ecosystem demand.
- **Telemetry / usage analytics** — Privacy-first by default. Not adding.
- **New runtime support beyond upstream's 14** — Inherit upstream. No additions in v0.1.
- **Migration tool from stock GSD** — Both can coexist via different bin names. No migration needed.
- **i18n of super-gsd-specific docs** — English only for v0.1. Inherit upstream's translations.
- **Backporting Tier features to upstream as PRs** — Out of v0.1 scope. Re-evaluate post-launch.
- **Rewriting the SDK** — SDK gets light extensions for Iron Rule validators only. No rewrite.
- **Visual regression testing** — We don't ship UI.
- **Older Node versions** — Inherit upstream's `node>=22`.

## Context

**Forked from:** [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) v1.38.5 (commit `9472f343`, 2026-04-25 release).

**License:** MIT (matches upstream).

**Repository:** [github.com/MARKXAILABS/super-gsd](https://github.com/MARKXAILABS/super-gsd).

**Disk layout:**
- `E:\GSD UPDATE\` — read-only upstream reference (clean v1.38.5).
- `E:\super-gsd\` — active workspace (this repo).

**Idea source documents:**
- `E:\GSD UPDATE\NEW MODIFICATION IDEA\` — 6 input docs (~95 KB) consolidating the 30-upgrade vision.

**Design spec:** [docs/superpowers/specs/2026-04-27-super-gsd-10x-design.md](../docs/superpowers/specs/2026-04-27-super-gsd-10x-design.md) — 370+ lines, 13 sections, fully approved 2026-04-27.

**Architectural strategy:** "Way 3" — targeted hybrid. Modify ~8 core files for deep behavior changes (executor, planner, plan-checker, verifier, new-project, complete-milestone, plan-phase, extract_learnings). Add ~30 new files for new capabilities. Use 4 new hooks for cross-cutting Iron Rules enforcement.

**Dogfood loop:** Each tier is built using the previous tier's upgraded GSD. By Tier 4, every line of super-gsd has been touched by its own quality system.

**Memory architecture (3-layer):**
- Layer 1: Session memory — `.planning/STATE.md` (per-session)
- Layer 2: Project memory — `.planning/*.md` (per-codebase)
- Layer 3: **NEW** — Global Brain at `~/.gsd-brain/` (cross-project)

## Constraints

- **Tech stack**: Inherit upstream — Node 22+, TypeScript SDK, markdown-based command/agent/template system. No language additions.
- **Compatibility**: Stay compatible with stock GSD's 14 runtimes (Claude Code, OpenCode, Gemini, Kilo, Codex, Copilot, Cursor, Windsurf, Antigravity, Augment, Trae, Qwen Code, CodeBuddy, Cline). All upgrades must work cross-runtime.
- **Upstream sync**: Periodic merge from `gsd-build/get-shit-done` at milestone boundaries. ~8 deeply-modified files are the conflict zone.
- **License**: MIT, matching upstream. All third-party additions must be MIT-compatible.
- **Credential boundary**: AI never authenticates to npm or GitHub as the user. User runs `npm publish` and `git push` themselves OR explicitly hands a single-use token.
- **Iron Rules default**: OFF by default (`SUPER_GSD_STRICT=1` to enable). Gradual adoption for power users.
- **Timeline**: Aggressive — all 4 tiers shipped today as `0.1.0-preview.0`. Bug fixes throughout week as `0.1.x`. GA `1.0.0` post-battle-testing.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Package name `super-gsd` | Available on npm; distinct from upstream brand | — Pending |
| Sibling fork at `E:\super-gsd\` | Safer than in-place modification of upstream clone | — Pending |
| Way 3 (targeted hybrid) architecture | Pure rewrite = too much merge pain; pure overlay = can't change executor's main loop | — Pending |
| Tier checkpoints (not full auto) | User stays in control of quality at each tier boundary | — Pending |
| Iron Rules opt-in via `SUPER_GSD_STRICT=1` | Bold defaults break workflows; gradual adoption preserves goodwill | — Pending |
| Periodic upstream merge at milestone boundaries | Stay close to upstream without continuous-rebase overhead | — Pending |
| MIT license + explicit attribution to TÂCHES | Required by upstream MIT; ethically right | — Pending |
| `0.1.0-preview.0` first release tagged `preview` | Honest about preview quality; bug fixes via `0.1.x` | — Pending |
| GitHub repo at `markxailabs/super-gsd`, public | Distribution requires public; license requires source visibility | ✓ Created 2026-04-27 |
| Granularity = coarse (4 phases, one per tier) | Matches the natural tier structure; each phase has 6-9 tasks | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-27 after initialization*
