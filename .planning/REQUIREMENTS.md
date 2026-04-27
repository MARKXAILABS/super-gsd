# Requirements: super-gsd v0.1.0

**Defined:** 2026-04-27
**Core Value:** GSD that remembers, self-heals, and refuses to hallucinate — autonomy and rigor where stock GSD currently asks the user to fill the gap.

## v1 Requirements

Requirements for `super-gsd@0.1.0-preview.0`. 30 upgrades across 4 categories (one category per tier).

### Foundation

The "remember and self-fix" tier. Cross-project memory, self-healing executor, industry-grade scaffolding, quality gates.

- [ ] **FOUND-01**: Global Brain at `~/.gsd-brain/` — cross-project memory directory created with PLAYBOOK.md, ANTI-PATTERNS.md, TECH-PREFERENCES.md, QUALITY-GATES.md, SCAFFOLDS/, HISTORY/. New `/gsd-brain` command for show/add-rule/add-scaffold/sync.
- [ ] **FOUND-02**: Self-Heal Loop in executor — verify failures trigger 2 auto-retry attempts (error-driven then hypothesis-driven) before escalation. Cannot self-heal: auth, architectural, external outages, spec ambiguity.
- [ ] **FOUND-03**: Industry-Grade Bootstrap on `/gsd-new-project` — auto-scaffold CI workflow, linter config, type checker, formatter, test framework, Dockerfile, .env.example, git hooks, .gitignore based on detected stack and Global Brain TECH-PREFERENCES.
- [ ] **FOUND-04**: Pre-Commit Quality Gates — orchestrate format → lint → type-check → related tests before every commit. Auto-fix what's possible. Self-heal unfixable. Block on persistent failures.
- [ ] **FOUND-05**: Lessons Sync — `/gsd-complete-milestone` triggers retrospective, distills lessons from SUMMARY.md / VERIFICATION.md / DEBUG.md into `.planning/LESSONS.md`, then syncs novel rules to Global Brain (PLAYBOOK + ANTI-PATTERNS + HISTORY).
- [ ] **FOUND-06**: `/gsd-ship` release workflow — pre-flight (all phases done, tests green, security clean) → CHANGELOG generation → version bump → git tag → deploy checklist generation.
- [ ] **FOUND-07**: `/gsd-rollback N` — clean phase undo via git revert with state preservation. Updates ROADMAP.md status, logs reason in DECISIONS.md, makes phase available for re-planning.
- [ ] **FOUND-08**: `/gsd-audit-architecture` — drift detection comparing real codebase structure to ARCHITECTURE.md. Flags new undocumented components, deleted-but-documented components, dependency violations.
- [ ] **FOUND-09**: Security Scanner skill — pip-audit / npm audit / cargo audit. Advisory in `/plan`, enforcement in `/execute`, blocking in `/ship`.

### Iron Rules

The "stop hallucinating" tier. 5 anti-hallucination rules + 3 CI-integrity rules. Mostly hooks + PROJECT_RULES.md additions. Default OFF — opt in via `SUPER_GSD_STRICT=1`.

- [ ] **IRON-H1**: Verify Before Claim — banned phrase scanner blocks "should work / will work / based on documentation / LGTM" in agent output and commit messages. Required: "Verified: <command> returned <output>" format.
- [ ] **IRON-H2**: Never Import Without Verification — pre-commit hook scans new imports in Python/JS/TS files, runs `pip show <pkg>` / `npm view <pkg>` / signature inspection. Blocks commit if package not verified.
- [ ] **IRON-H3**: Never Assume, Always Read — extend `gsd-read-guard.js` to require Read tool call before Edit on any file in the same agent turn. Block edits to unread files.
- [ ] **IRON-H4**: No Mock-Heavy Tests — pre-commit hook scans test files for tautological tests (testing the mock), assert-nothing tests (`assert response is not None`), and zero-real-code-runs patterns. Block commit on detection.
- [ ] **IRON-H5**: Mutation Test — every test in plan must be designed to fail under standard mutations (`>` → `<`, `==` → `!=`, removed return, removed validation, changed status code). Add to executor checklist + planner template.
- [ ] **IRON-C1**: No Silencing Errors — hook scans for `except: pass`, bare `# type: ignore`, `# noqa` without code, `@pytest.mark.skip` without reason. Block commit unless justified inline.
- [ ] **IRON-C2**: Coverage Must Be Meaningful — quality gate enforces branch coverage on critical paths: Auth ≥95%, Payment ≥95%, API ≥85%, Utils ≥70%. Line coverage without assertions doesn't count.
- [ ] **IRON-C3**: CI Pipeline Must Be Real — bootstrap-generated CI has 4 mandatory stages (static analysis, security, tests, build). No `continue-on-error: true`. No skipping based on file path. All stages required for merge.

### Strict Process

The "code like a senior" tier. TDD enforcement, contracts, error/validation/perf/security audits.

- [ ] **STRICT-01**: TDD Enforcement — `<test>` block in task XML defines failing tests first. Plan-checker rejects plans with 0 `<test>` blocks. Executor commits test (RED) before implementation (GREEN). Override via `<no-test reason="...">` for explicit edge cases.
- [ ] **STRICT-02**: Implementation Contracts — `<contract>` block in task XML defines INPUTS / OUTPUTS / INVARIANTS / ERRORS / SIDE EFFECTS / PERFORMANCE. Tests generated from contract. Contract wins on disagreement.
- [ ] **STRICT-03**: Error Handling Audit — executor enforces "5 questions answered" for every external call: timeout? null? error? unexpected data? concurrent? Banned naked `await db.get(...)` without resilience.
- [ ] **STRICT-04**: Input Validation Audit — executor enforces "6 axes checked" at every boundary: TYPE / RANGE / FORMAT / LENGTH / INJECTION / AUTHORIZATION. Pre-commit verification checklist.
- [ ] **STRICT-05**: Performance Budget — executor measures endpoint timing post-implement. Default budgets: CRUD <100ms, query <500ms, write <300ms, file upload <5000ms. N+1 detection mandatory (queries > items + 5 = bug).
- [ ] **STRICT-06**: Security Per Commit — quality gate scans for hardcoded secrets, SQL string concat, eval/exec on user input, shell=True, CORS wildcard on auth endpoints, sensitive data in logs. Block commit on detection.

### Veteran Layers

The "think like a 30-year architect" tier. Pre-mortem, observability, degradation, data integrity, ADRs, Chesterton's fence, production invariants.

- [ ] **VET-01**: Pre-Mortem — `<premortem>` block predicts 5 most likely failures BEFORE coding. Required for any task involving state mutation, external APIs, money, or user data. Mitigations baked into implementation.
- [ ] **VET-02**: Observability-First — bootstrap adds structlog/pino. Executor enforces correlation IDs in every endpoint, structured logging on every operation, mandatory health endpoints (`/health`, `/health/ready`, `/health/live`).
- [ ] **VET-03**: Graceful Degradation — `<degradation>` matrix enforces timeout + retry + fallback for every external dependency. Banned: naked `await httpx.post(...)`. Required: circuit breaker pattern with explicit timeout values.
- [ ] **VET-04**: Data Integrity Rules — PROJECT_RULES.md + executor enforcement: no floats for money (integer cents), atomic transactions for multi-write, X-Idempotency-Key header for mutations, explicit state-machine transitions, expand-migrate-contract migration pattern.
- [ ] **VET-05**: Architecture Decision Records — `/gsd-adr` command + template at `super-gsd/templates/adr.md`. Required when choosing database, framework, auth strategy, caching, API versioning, or any decision >1 day to reverse.
- [ ] **VET-06**: Chesterton's Fence — executor prompt requires `git blame` + commit-message read before modifying existing code. Banned: "this looks wrong, let me fix it" without understanding. Banned: deleting "dead code" without proving unreachable.
- [ ] **VET-07**: Production Invariants — executor adds `assert` statements for cross-cutting invariants in live code (order total = sum of items, stock >= 0, state machine valid transitions). Fires in production, alerts on violation.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Distribution

- **DIST-01**: Cloud-hosted Global Brain (multi-machine sync)
- **DIST-02**: Plugin/extension marketplace
- **DIST-03**: Migration tool from stock GSD to super-gsd

### UX

- **UX-01**: Web dashboard / GUI
- **UX-02**: i18n of super-gsd-specific docs
- **UX-03**: Telemetry-opt-in usage analytics (privacy-first)

### Engineering

- **ENG-01**: SDK rewrite (currently inheriting upstream's TypeScript SDK)
- **ENG-02**: Visual regression testing (currently no UI shipped)
- **ENG-03**: Backport Tier features as PRs to upstream gsd-build

## Out of Scope

| Feature | Reason |
|---------|--------|
| GUI / web dashboard | CLI-only for v0.1 — adding GUI is a separate milestone with its own design |
| Cloud-hosted Global Brain | Local-only for v0.1 — multi-machine sync is v2+ |
| Plugin marketplace | Premature; wait for ecosystem demand |
| Telemetry / analytics | Privacy-first by default; not adding |
| New runtime support beyond upstream's 14 | Inherit upstream; no additions in v0.1 |
| Migration tool from stock GSD | Both can coexist via different bin names; no migration needed |
| i18n of super-gsd-specific docs | English only for v0.1; inherit upstream's translations |
| Backport to upstream as PRs | Out of v0.1 scope; re-evaluate post-launch |
| SDK rewrite | Light extensions only for Iron Rule validators; no rewrite |
| Visual regression testing | We don't ship UI |
| Older Node versions | Inherit upstream's `node>=22` |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| FOUND-07 | Phase 1 | Pending |
| FOUND-08 | Phase 1 | Pending |
| FOUND-09 | Phase 1 | Pending |
| IRON-H1 | Phase 2 | Pending |
| IRON-H2 | Phase 2 | Pending |
| IRON-H3 | Phase 2 | Pending |
| IRON-H4 | Phase 2 | Pending |
| IRON-H5 | Phase 2 | Pending |
| IRON-C1 | Phase 2 | Pending |
| IRON-C2 | Phase 2 | Pending |
| IRON-C3 | Phase 2 | Pending |
| STRICT-01 | Phase 3 | Pending |
| STRICT-02 | Phase 3 | Pending |
| STRICT-03 | Phase 3 | Pending |
| STRICT-04 | Phase 3 | Pending |
| STRICT-05 | Phase 3 | Pending |
| STRICT-06 | Phase 3 | Pending |
| VET-01 | Phase 4 | Pending |
| VET-02 | Phase 4 | Pending |
| VET-03 | Phase 4 | Pending |
| VET-04 | Phase 4 | Pending |
| VET-05 | Phase 4 | Pending |
| VET-06 | Phase 4 | Pending |
| VET-07 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-27*
*Last updated: 2026-04-27 after initial definition*
