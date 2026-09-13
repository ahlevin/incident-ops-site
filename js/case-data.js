const CASE_NODES = [
{
"id": "d0",
"day": "W1 Mon",
"short": "Plan",
"kind": "ceremony",
"title": "Week 1 &middot; Monday: Iteration planning",
"participants": "Whole delivery team, team backlog owner (Product Owner), and team facilitator (Scrum Master or team coach).",
"inputs": "Quarterly direction, capacity, ready backlog, and current production conditions.",
"outcome": "A two-week goal, selected work, and an explicit allowance for defects, learning, and technical health."
},
{
"id": "d1",
"day": "W1 Tue",
"short": "Deliver",
"kind": "deliver",
"title": "Week 1 &middot; Tuesday: Deliver and coordinate",
"participants": "Developers, QA, design, and other delivery roles; the team facilitator supports flow as needed.",
"inputs": "Iteration goal, technical discoveries, and current blockers.",
"outcome": "Working software advances; the daily stand-up refreshes shared context and ownership."
},
{
"id": "d2",
"day": "W1 Wed",
"short": "Deliver",
"kind": "deliver",
"title": "Week 1 &middot; Wednesday: Deliver, learn, and fix",
"participants": "Delivery team; specialists join only when useful.",
"inputs": "Working code, production signals, defects, and learning needs.",
"outcome": "Features, defects, technical health, and just-in-time learning progress together."
},
{
"id": "d3",
"day": "W1 Thu",
"short": "Refine",
"kind": "ceremony",
"title": "Week 1 &middot; Thursday: Backlog refinement",
"participants": "Team backlog owner (Product Owner), selected developers, QA, design, and technical direction (System Architect) as needed.",
"inputs": "New requests, stakeholder feedback, acceptance criteria, and technical options.",
"outcome": "Requests are vetted, split, estimated, and made ready without waiting for quarterly planning."
},
{
"id": "d4",
"day": "W1 Fri",
"short": "Deliver",
"kind": "deliver",
"title": "Week 1 &middot; Friday: Integrate and reassess",
"participants": "Delivery team.",
"inputs": "Completed work, test results, emerging risks, and remaining iteration capacity.",
"outcome": "An integrated increment and a conscious adjustment to the second week."
},
{
"id": "d5",
"day": "W2 Mon",
"short": "Deliver",
"kind": "deliver",
"title": "Week 2 &middot; Monday: Continue delivery",
"participants": "Delivery team.",
"inputs": "Updated plan, integrated increment, blockers, and operational priorities.",
"outcome": "Flow resumes with context intact; urgent defects may enter through an explicit trade-off."
},
{
"id": "d6",
"day": "W2 Tue",
"short": "Refine",
"kind": "ceremony",
"title": "Week 2 &middot; Tuesday: Forward-looking refinement",
"participants": "Team backlog owner and a small rotating group of team members.",
"inputs": "Likely next-iteration work, open questions, and dependencies.",
"outcome": "Work is prepared for the next iteration while most developers remain focused on delivery."
},
{
"id": "d7",
"day": "W2 Wed",
"short": "Finish",
"kind": "deliver",
"title": "Week 2 &middot; Wednesday: Finish and validate",
"participants": "Delivery team and relevant domain specialists.",
"inputs": "Acceptance criteria, test evidence, security and operational checks.",
"outcome": "Work reaches a demonstrable, deployable state; unfinished work is made visible."
},
{
"id": "d8",
"day": "W2 Thu",
"short": "Review",
"kind": "ceremony",
"title": "Week 2 &middot; Thursday: Review and demonstration",
"participants": "Delivery team, product direction (Product Management), customers, operators, and relevant stakeholders.",
"inputs": "Working software and the iteration goal.",
"outcome": "Acceptance decisions, stakeholder feedback, new requests, and evidence for quarterly adjustment."
},
{
"id": "d9",
"day": "W2 Fri",
"short": "Improve",
"kind": "ceremony",
"title": "Week 2 &middot; Friday: Retrospective and preparation",
"participants": "Delivery team and team facilitator.",
"inputs": "Flow data, team experience, quality outcomes, and recurring blockers.",
"outcome": "One or two improvement actions. The session may be shortened or triggered earlier when circumstances warrant."
},
{
"id": "q",
"day": "Quarter",
"short": "Align",
"kind": "quarter",
"title": "Quarter start &middot; Monday to Tuesday: Focused alignment",
"participants": "Alignment facilitator (Release Train Engineer or equivalent), product direction (Product Management), technical direction (System Architect), investment and trade-off authority (Business Owners), and selected team representatives such as Product Owners and engineering leads. Not the entire development organization.",
"inputs": "Strategy, economics, customer evidence, delivery history, capacity, dependencies, and major risks.",
"outcome": "Quarterly objectives, priority order, capacity guardrails, major dependencies, and a general roadmap. Most developers continue normal delivery."
}
];
