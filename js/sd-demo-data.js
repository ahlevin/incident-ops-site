const SD_DEMO_ENTRIES = [
  {
    tag: "01 · INTAKE & CLASSIFICATION",
    phase: "phase-active",
    meta: "09:12 · service-desk-intake",
    body:
`User contact (phone): "I can't get into the expense system,
it just spins. Couple people on my team too I think."

Contact type: Incident: a service that should work, doesn't.
Category: Finance Apps > Expense > Access
Impact: Medium: a team, not enterprise-wide (pending confirmation)
Urgency: High: month-end close, submissions due today
Priority: P2
Route to: Tier 1, with a watch on scope

Missing information needed:
- Exact error or behaviour past the spinner
- How many on the team confirmed affected`
  },
  {
    tag: "02 · FIRST-TOUCH RESOLUTION",
    phase: "phase-active",
    meta: "09:19 · first-touch-resolution",
    body:
`KEDB check: matched KE-044: "Expense login hangs after SSO
token refresh," workaround documented.
TSG applied: TSG-Finance-07

Steps taken:
1. Confirmed symptom matches KE-044 (spinner, no error text)
2. Walked user through clearing SSO session and re-auth
3. User confirmed access restored

Outcome: Resolved at first touch
Reason: Documented known error workaround applied successfully.
Note: 3rd occurrence of KE-044 this week: flagging recurrence.`
  },
  {
    tag: "04 · ESCALATION & HANDOFF",
    phase: "phase-active",
    meta: "09:26 · service-desk-escalation",
    body:
`Scope check: 6 more contacts, same symptom, same 20 min window.

Escalation type: Converting to incident
Trigger: Growing impact: this is no longer one ticket.
Routing to incident-triage-classification for severity
classification and engagement.

Context package handed over:
- Symptom: expense login hangs after SSO redirect
- Affected: 7 confirmed users, finance dept, since ~09:05
- KEDB: KE-044 matched; workaround works per-user but
  does not prevent recurrence
- Business impact: month-end close submissions blocked`
  },
  {
    tag: "05 · USER COMMUNICATION",
    phase: "phase-active",
    meta: "09:31 · service-desk-user-communication",
    body:
`To requester (ticket correspondence):

"Thank you for reporting this. We have identified an issue
affecting access to the expense system and it is now being
managed as a service incident.

A workaround has been applied to your account and access should
now be available. Please let us know if you continue to
experience problems.

We will provide a further update by 10:30. Your ticket has been
linked to the incident record, so no further information is
required from you at this stage.

Reference: INC-4471 / SD-88213"`
  },
  {
    tag: "06 · CLOSURE & SATISFACTION",
    phase: "phase-settled",
    meta: "11:40 · ticket-closure-satisfaction",
    body:
`Confirmed with user: Yes: user re-tested and submitted expenses.

Resolution summary: Expense system login hung at spinner after
SSO redirect for finance users. Caused by stale token refresh
after overnight IdP config change. Per-user workaround: clear
SSO session and re-auth. Permanent fix applied by identity team.

Feeds into: Known error record: KE-044 updated with 3rd
recurrence this week and the confirmed IdP cause.
Satisfaction: survey sent.`
  },
  {
    tag: "07 · PERFORMANCE REVIEW",
    phase: "phase-settled",
    meta: "weekly · service-desk-performance",
    body:
`Headline: FCR up 4 pts, but reopen rate up 3 pts alongside it: 
read together, that's premature closure, not improvement.

Concentrated where: Finance Apps > Expense > Access, which is
now 18% of all contacts, up from 6% four weeks ago. KE-044
recurrence count: 11 this month.

Recommended actions:
| Investigate | KE-044 volume warrants a problem record: hand
  to problem-record-priority | Priority: high |
| Document | No TSG existed for 2 of the top 5 categories |
| Automate | Password reset = 22% of requests, fully standard |`
  }
];
