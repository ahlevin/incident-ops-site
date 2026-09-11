const CHG_DEMO_ENTRIES = [
  {
    tag: "01 · INTAKE & CLASSIFICATION",
    phase: "phase-active",
    meta: "CHG-2291 · change-intake-classification",
    body:
`Change type: Normal — not on the standard catalog, and nothing
about waiting causes harm, so not an emergency.

What's changing: checkout service database — connection pool
configuration and query pattern, via schema migration
Driver: performance work ahead of Q3 traffic
Environments: staging → production
User-visible effect: none expected; no downtime planned
Reversible: partially — migration has a down script, untested
Implementer / validator: platform team

Missing for assessment:
- Down migration has never been run. That's what decides whether
  this can go in a low-supervision window.`
  },
  {
    tag: "02 · RISK & IMPACT ASSESSMENT",
    phase: "phase-active",
    meta: "CHG-2291 · change-risk-assessment",
    body:
`Impact: High — checkout is revenue-carrying and customer-facing;
shared DB with three other services.
Likelihood: Medium — migration itself is routine, but the pool
config change is novel for this team.
Reversibility: partial — down script exists, never tested.
Point of no return: step 4, once the schema alters.

Adjustment: raised one level — irreversible in practice and
touches a revenue-carrying shared service.

Risk level: High
Change authority required: CAB
Worst realistic case: Sev1 — checkout unavailable
Key uncertainty: whether pool behaviour changes under production
load, which staging does not reproduce.`
  },
  {
    tag: "03 · AUTHORIZATION",
    phase: "phase-active",
    meta: "CHG-2291 · change-authorization",
    body:
`Automated gates status:
- Tests: pass  · Security scan: pass · Policy checks: pass
- Progressive delivery in use: no — single-shot migration

Routing: High risk would normally reach the board. Two escalation
triggers fired independently:
  • Untested rollback on a partially irreversible change
  • High blast radius on a revenue-carrying shared service

Change Authority: board review (advising the change manager)

Question the authority should ask — and didn't:
"Can the pool config change be separated from the schema change
and shipped as two smaller changes?" It could have been.

Decision: Approved with conditions
1. Down migration tested in a production-like environment
   before the window
2. Post-implementation pool monitoring for 24h, not the usual 1h

Conditions verified before implementation by: UNASSIGNED
`
  },
  {
    tag: "04 · SCHEDULE & CONFLICT",
    phase: "phase-active",
    meta: "CHG-2291 · change-schedule-conflict",
    body:
`Proposed window: 22:00–23:00 UTC
Freeze check: clear

Collisions: none touching the same components. Two other changes
in the window, neither sharing dependencies.

Timing assessment:
- Business timing: low traffic, acceptable
- Support coverage: one on-call, not platform-team familiar
- Failure detection lag: DELAYED — pool exhaustion builds under
  load, which will not occur until business hours
- Validation time in window: sufficient for immediate checks only

Recommendation: proceed, but the delayed failure mode means
overnight validation will not catch it. Flagged.`
  },
  {
    tag: "05 · IMPLEMENTATION & ROLLBACK",
    phase: "phase-active",
    meta: "CHG-2291 · change-implementation-rollback",
    body:
`POINT OF NO RETURN: step 4 — schema alter begins

Validation:
Technical: migration completes, service healthy, connections
establish
Functional: test checkout transaction completes
Observation period: 1h — sized for immediate failure only

Abort criteria (pre-committed):
- Migration errors at any step
- Health check fails after restart
- Test transaction fails

Rollback: run down migration, restart pods. ~15 min estimated.
Tested: NO — this is untested.
Data created during change: not addressed.`
  },
  {
    tag: "06 · EMERGENCY CHANGE",
    phase: "phase-active",
    meta: "CHG-2295 · emergency-change · 16h later",
    body:
`Emergency justification: checkout failing for ~30% of attempts,
INC-4471 open at Sev1. Waiting for normal authorization extends
a live revenue-impacting outage.

Compressed assessment:
- Changing: roll back CHG-2291
- Blast radius: checkout — already impaired
- Reversible: yes
- Could this make it worse: low risk; reverts to last known good
- Testing: none, but this is a reversion not a new change

Authorized by: incident commander + service owner, 15:44 UTC
Announced on bridge: yes
Applied at: 15:50 UTC
Validation: error rate at baseline by 16:02 UTC`
  },
  {
    tag: "07 · POST-IMPLEMENTATION REVIEW",
    phase: "phase-settled",
    meta: "CHG-2291 · post-implementation-review",
    body:
`Outcome: Failed — caused INC-4471 (Sev1)
Detection lag: 16h after implementation

Assessment accuracy:
- Assessed High: correct. Worst case was called as Sev1 and it
  was a Sev1.
- Rollback: used, worked, ~12 min against 15 estimated —
  despite never being tested beforehand.
- CAB condition 1 (test the down migration) was NOT met before
  implementation. Nobody checked.

What follows:
☑ Raise problem record — no pre-deploy pool-impact review exists
☑ Process gap — approval conditions aren't verified before
  implementation. This is the systemic finding.
☑ Observation period sizing must account for delayed failure
  modes, not default to 1h.

Blameless: the team followed the plan they were given. The plan
allowed an untested rollback and a validation window too short
for the failure mode the schedule check had already flagged.`
  }
];
