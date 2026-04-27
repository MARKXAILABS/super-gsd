# Roadmap: super-gsd v0.1.0-preview.0

## Overview

`super-gsd` ships 30 upgrades across 4 tiers, building from the inside out. Phase 1 establishes the foundation (memory, self-healing, scaffolding, gates) — the substrate every later upgrade stands on. Phase 2 layers Iron Rules on top of that foundation, weaponizing hooks and quality gates against hallucination and CI theater. Phase 3 enforces senior-engineer process (TDD, contracts, audits) on top of the now-trustworthy execution layer. Phase 4 adds 30-year-architect veteran reflexes (pre-mortem, observability, degradation, invariants) on top of the now-disciplined process. Each tier dogfoods the previous: by Phase 4, every line of super-gsd has been touched by its own quality system. Granularity is coarse — one phase per tier — because each tier is a coherent autonomy/discipline boundary that is verified end-to-end before the next layer activates.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned tier work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Cross-project memory, self-heal loop, industry bootstrap, quality gates, lessons sync, ship/rollback/audit/security commands
- [ ] **Phase 2: Iron Rules** - 5 anti-hallucination rules + 3 CI-integrity rules enforced via hooks, opt-in via `SUPER_GSD_STRICT=1`
- [ ] **Phase 3: Strict Process** - TDD enforcement, implementation contracts, error/validation/perf/security audits in executor and plan-checker
- [ ] **Phase 4: Veteran Layers** - Pre-mortem, observability-first, graceful degradation, data integrity, ADRs, Chesterton's Fence, production invariants

## Phase Details

### Phase 1: Foundation
**Goal**: super-gsd remembers across projects, self-heals on verify failures, scaffolds production-grade defaults, gates every commit, and ships/rolls-back/audits via first-class commands. The "remember and self-fix" substrate that every later tier depends on.
**Depends on**: Nothing (first phase, builds on upstream GSD v1.38.5)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, FOUND-08, FOUND-09
**Success Criteria** (what must be TRUE):
  1. Running `super-gsd /gsd-brain show` in any directory prints the contents of `~/.gsd-brain/` including PLAYBOOK.md, ANTI-PATTERNS.md, TECH-PREFERENCES.md, QUALITY-GATES.md, and listings of SCAFFOLDS/ and HISTORY/ subdirectories.
  2. When the gsd-executor runs a task whose verify step fails, it logs an attempt counter and tries up to 2 self-heal retries (error-driven, then hypothesis-driven) before escalating to the user; an injected fixable failure (e.g., missing import) is resolved without user intervention.
  3. Running `/gsd-new-project` on a fresh directory produces, before the user types anything else, a CI workflow file, a linter config, a type checker config, a formatter config, a test scaffold, a Dockerfile, a `.env.example`, a git pre-commit hook, and a `.gitignore` — all chosen from Global Brain TECH-PREFERENCES for the detected stack.
  4. Attempting `git commit` with a formatting error, a lint error, a type error, or a failing related test invokes the quality-gate orchestrator, which auto-fixes what it can, self-heals what it can, and blocks the commit on persistent failure with a clear diff of what's still wrong.
  5. Running `/gsd-complete-milestone` writes `.planning/LESSONS.md` distilled from SUMMARY.md / VERIFICATION.md / DEBUG.md, then appends novel rules to `~/.gsd-brain/PLAYBOOK.md`, novel anti-patterns to ANTI-PATTERNS.md, and a milestone entry to HISTORY/.
  6. Running `/gsd-ship` blocks if any phase is incomplete, tests are red, or the security scanner reports unresolved high-severity issues; on green, it generates CHANGELOG.md entries, bumps the version in package.json, creates an annotated git tag, and writes a deploy checklist to `.planning/DEPLOY.md`.
  7. Running `/gsd-rollback 2` reverts Phase 2's commits via `git revert`, sets Phase 2 status to "Not started" in ROADMAP.md, appends a rollback entry with reason to `.planning/DECISIONS.md`, and leaves the working tree clean.
  8. Running `/gsd-audit-architecture` produces a report listing components in the codebase but not in ARCHITECTURE.md, components in ARCHITECTURE.md but not in code, and any imports that violate the documented dependency direction.
  9. Running `/gsd-plan-phase`, `/gsd-execute-phase`, or `/gsd-ship` invokes the security-scanner skill, which runs the runtime-appropriate auditor (`pip-audit` / `npm audit` / `cargo audit`) and surfaces results as advisory in plan, enforced (warn-on-high) in execute, and blocking (fail-on-high) in ship.
**Plans**: TBD

### Phase 2: Iron Rules
**Goal**: super-gsd refuses to hallucinate. With `SUPER_GSD_STRICT=1` set, agent output containing unverified claims is blocked, unverified imports cannot be committed, edits to unread files are blocked, mock-heavy or assert-nothing tests are blocked, mutation-fragile tests are flagged, silenced errors are blocked, coverage is meaningful, and bootstrap-generated CI cannot be skipped.
**Depends on**: Phase 1 (Iron Rule hooks plug into Phase 1's quality-gate orchestrator and bootstrap-generated CI; Iron Rule violations route through the Phase 1 self-heal loop's escalation path)
**Requirements**: IRON-H1, IRON-H2, IRON-H3, IRON-H4, IRON-H5, IRON-C1, IRON-C2, IRON-C3
**Success Criteria** (what must be TRUE):
  1. With `SUPER_GSD_STRICT=1`, an agent message or commit message containing "should work", "will work", "based on documentation", or "LGTM" without an accompanying "Verified: <command> returned <output>" line is blocked by the banned-phrase hook with a diff showing the offending phrase.
  2. With `SUPER_GSD_STRICT=1`, attempting `git commit` with a Python/JS/TS file containing a newly-added import for a package that fails `pip show` / `npm view` / signature inspection blocks the commit and prints the missing package and verification command run.
  3. With `SUPER_GSD_STRICT=1`, an agent turn that calls Edit on a file without a preceding Read on the same file is blocked by the extended `gsd-read-guard.js` hook, which reports the unread file path and required action.
  4. With `SUPER_GSD_STRICT=1`, attempting `git commit` with a test file containing tautological patterns (asserting on the mock), assert-nothing patterns (`assert response is not None` only), or zero-real-code-runs is blocked by the test-quality hook with the offending file and line.
  5. The plan-checker rejects any plan whose `<test>` blocks do not include at least one explicit mutation case (e.g., flipping `>` to `<`, removing return, removing validation, changing status code) per task; the executor checklist confirms mutation cases are present before allowing the test commit.
  6. With `SUPER_GSD_STRICT=1`, attempting `git commit` with `except: pass`, bare `# type: ignore`, `# noqa` without code, or `@pytest.mark.skip` without a reason string is blocked by the silencing-errors hook unless an inline justification comment is present.
  7. The quality-gate enforces branch coverage floors (Auth ≥95%, Payment ≥95%, API ≥85%, Utils ≥70%) on critical paths; running coverage with assertions stripped or with no assertions on a covered branch fails the gate.
  8. The bootstrap-generated CI workflow file (from FOUND-03) contains exactly 4 mandatory stages (static analysis, security, tests, build), zero `continue-on-error: true` declarations, zero path-based skip rules, and all 4 stages are required for merge per branch protection.
**Plans**: TBD

### Phase 3: Strict Process
**Goal**: super-gsd codes like a senior. Every task in a plan declares failing tests first, ships an implementation contract, audits every external call against 5 resilience questions, audits every boundary against 6 validation axes, measures performance against budgets with N+1 detection, and scans every commit for secret/injection/eval/CORS-wildcard patterns.
**Depends on**: Phase 2 (Strict Process layers ride on Iron Rules — TDD enforcement requires the Phase 2 mutation-test rule to be active; contracts are validated by the Phase 2 banned-phrase hook for unverified claims; security-per-commit extends Phase 2's silencing-errors and bootstrap CI)
**Requirements**: STRICT-01, STRICT-02, STRICT-03, STRICT-04, STRICT-05, STRICT-06
**Success Criteria** (what must be TRUE):
  1. The plan-checker rejects any plan-phase output whose tasks contain zero `<test>` blocks (unless every task carries an explicit `<no-test reason="...">` override); the executor refuses to write implementation code until the test commit (RED) for the current task is on disk and failing.
  2. Every task in a generated plan contains a `<contract>` block with non-empty INPUTS, OUTPUTS, INVARIANTS, ERRORS, SIDE EFFECTS, and PERFORMANCE sub-elements; tests generated for the task assert each contract clause; on disagreement between contract and code, the executor flags the contract as authoritative and rewrites the code.
  3. The executor blocks the commit of any code containing a naked `await db.get(...)`, `await fetch(...)`, `requests.get(...)`, or equivalent external call without explicit handling for: timeout, null/missing result, raised error, unexpected data shape, and concurrent access — verified by a hook scanning AST patterns.
  4. The executor blocks the commit of any boundary handler (HTTP route, queue consumer, CLI parser) lacking explicit checks for the 6 axes (TYPE, RANGE, FORMAT, LENGTH, INJECTION, AUTHORIZATION) — verified by an executor pre-commit checklist that lists each axis with a satisfied/unsatisfied marker.
  5. After implementing an endpoint, the executor runs a timing benchmark and prints actual vs. budget (CRUD <100ms, query <500ms, write <300ms, file upload <5000ms); flags any endpoint where queries-issued exceeds items-returned + 5 as N+1; budget breach blocks phase completion until acknowledged.
  6. The quality-gate's per-commit security scanner detects and blocks: hardcoded secrets (API key patterns, JWT, AWS keys), SQL string concatenation in DB calls, `eval`/`exec` on user-derived input, `shell=True` in subprocess calls, CORS wildcard (`*`) on auth-bearing endpoints, and sensitive data (password, token, ssn) in log calls.
**Plans**: TBD

### Phase 4: Veteran Layers
**Goal**: super-gsd thinks like a 30-year architect. Every state-mutating or external-API task starts with a pre-mortem listing the 5 most likely failures. Every service ships with structured logging, correlation IDs, and health endpoints from day one. Every external dependency has explicit timeout + retry + fallback. Money is integer cents, writes are atomic, mutations are idempotent. Major decisions get ADRs. Modifications start with `git blame`. Live code carries production invariant `assert`s.
**Depends on**: Phase 3 (Veteran Layers extend Strict Process — pre-mortem extends contracts, observability extends performance budget, degradation extends error-handling audit, data integrity extends validation audit, production invariants extend the contract's INVARIANTS clause)
**Requirements**: VET-01, VET-02, VET-03, VET-04, VET-05, VET-06, VET-07
**Success Criteria** (what must be TRUE):
  1. Any task in a generated plan involving state mutation, external APIs, money handling, or user data contains a `<premortem>` block with at least 5 predicted failure modes, each paired with a mitigation that is referenced by at least one task in the implementation; plans missing required premortems are rejected by the plan-checker.
  2. Bootstrap (FOUND-03) generates a structlog/pino logger config; the executor blocks commits where new endpoints lack correlation-ID propagation, lack structured logging on entry/exit/error, or where the service lacks `/health`, `/health/ready`, and `/health/live` endpoints returning JSON status.
  3. The executor blocks commits containing a naked `await httpx.post(...)`, `await fetch(...)`, or equivalent external call without an accompanying `<degradation>` matrix entry specifying explicit timeout (in ms), retry policy (count + backoff), and fallback behavior; circuit-breaker pattern present for any dependency called more than once.
  4. Code introducing a money field uses an integer-cents type (or equivalent rational), every multi-write operation is wrapped in an atomic transaction, every mutation HTTP endpoint accepts and persists `X-Idempotency-Key`, every multi-state entity carries an explicit state-machine module with allowed transitions, and migrations follow expand-migrate-contract — verified by executor checklist and PROJECT_RULES.md gate.
  5. Running `/gsd-adr "Choose Postgres over SQLite"` creates `docs/adrs/NNNN-choose-postgres-over-sqlite.md` from `super-gsd/templates/adr.md` with sections (Context, Decision, Consequences, Alternatives, Date, Status); the executor prompts for an ADR before proceeding when a task touches database choice, framework choice, auth strategy, caching, or API versioning.
  6. The executor's prompt requires `git log --all --full-history -- <file>` and `git blame <file>` output to appear in the task's reasoning before any modification or deletion of pre-existing code; the executor refuses to delete code labeled "dead" without printing a reachability proof (call-graph trace or test confirming no caller).
  7. Live (non-test) code contains `assert` statements for cross-cutting invariants (order total equals sum of line items, stock counter ≥ 0, state-machine transitions land in declared next-states); the executor adds at least one production invariant per task that touches a money/stock/state-machine entity, and these `assert`s remain enabled in the production runtime.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/TBD | Not started | - |
| 2. Iron Rules | 0/TBD | Not started | - |
| 3. Strict Process | 0/TBD | Not started | - |
| 4. Veteran Layers | 0/TBD | Not started | - |

---
*Roadmap created: 2026-04-27*
*Granularity: coarse (4 phases, one per tier)*
*Coverage: 30/30 v1 requirements mapped*
