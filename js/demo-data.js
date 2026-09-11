const DEMO_ENTRIES = [
  {
    tag: "01 · TRIAGE & CLASSIFICATION",
    phase: "phase-active",
    meta: "14:16 UTC · incident-triage-classification",
    body:
`Severity: Sev1 — checkout errors affecting ~30% of attempts across
all customers; broad enough to risk real business loss.

Engagement:
- AOD: Immediate
- TDO: Immediate
- EDO: Within 15 min
- TCB: Opened immediately
- Dev on-call (checkout): Immediate if known, else escalate on ID

Notifications:
- Internal: starts within 15 min, repeats every 60 min
- External: per EDO guidance, starts within 30 min, repeats every 60 min`
  },
  {
    tag: "02 · STATUS UPDATE",
    phase: "phase-active",
    meta: "14:32 UTC · incident-status-updates",
    body:
`[Status page — Investigating]
We're aware that some customers are experiencing errors when
completing checkout. We're actively investigating and will share
an update by 15:00 UTC.

[Eng Slack]
SEV1 — Checkout — INVESTIGATING. Elevated errors since ~14:15 UTC,
~30% of attempts. DB pool exhaustion suspected, possibly last
night's migration — not confirmed. Next update 15:00 UTC.`
  },
  {
    tag: "03 · DIAGNOSIS ENGINE",
    phase: "phase-active",
    meta: "14:34 UTC · incident-diagnosis-engine",
    body:
`Working hypotheses (ranked):
1. DB migration deployed 22:00 UTC prior night — strong timing fit
   with gradual pool exhaustion — check: pool metrics vs. deploy time
2. Traffic spike unrelated to migration — weak, no supporting
   evidence yet — check: request-rate graph for the last hour

Recommended now:
Roll back the migration in parallel with confirming pool metrics —
timing correlation is strong and rollback is low-risk here.`
  },
  {
    tag: "04 · RESOLUTION & RFO",
    phase: "phase-active",
    meta: "16:10 UTC · incident-resolution-closure",
    body:
`Start: 14:15 UTC   End: 16:02 UTC   Duration: 1h47m

Verification: error rate returned to baseline immediately after
rollback and held for 15 minutes with no recurrence.

Reason For Outage (Initial Assessment): points to the database
migration deployed the prior night. Full root cause and corrective
actions to be established via the postmortem.

Immediate repair: rollback of the migration — durable, since it
reverts the change that caused the issue.`
  },
  {
    tag: "05 · PROBLEM RECORD & PRIORITY",
    phase: "phase-active",
    meta: "16:15 UTC · problem-record-priority",
    body:
`Related incident: Checkout Sev1 (14:15–16:02 UTC)
Description: carried from RFO — migration-related connection pool
exhaustion, not yet fully validated.

Sev: 1 (from incident)
Priority: P1
Postmortem: Mandatory`
  },
  {
    tag: "06 · ROOT CAUSE ANALYSIS",
    phase: "phase-settled",
    meta: "postmortem · incident-root-cause-analysis",
    body:
`Ishikawa review: candidates concentrated in Technology/Systems
(migration altered pool handling) and Process (no pool-impact
review step existed for migrations).

Root Cause: the migration deployed the prior night altered
connection handling, causing gradual pool exhaustion — confirmed by
pool metrics and full recovery on rollback.

CAPA:
- Preventative — pool-utilization alerting at a lower threshold
- Preventative — require pool-impact review for migrations
- Preventative — review the 17-min gap before first customer update`
  },
  {
    tag: "07 · KNOWN ERROR RECORD",
    phase: "phase-settled",
    meta: "KE-001 · known-error-record",
    body:
`Status: Active — workaround needed
Symptoms: checkout errors climbing with connection pool
utilization, typically hours after a DB migration deploy.

Workaround:
1. Roll back the most recent migration
2. Restart checkout service pods
3. Confirm pool metrics and error rate return to baseline

Permanent fix: TBD — pool alerting and migration review proposed.`
  }
];
