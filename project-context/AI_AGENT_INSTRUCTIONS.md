# AI Agent Instructions

## Before Doing Any Work

Every future Codex chat must do this first:

1. Locate the project root. The project root is `ZeptoProject`.
2. Read all files inside `project-context`.
3. Read relevant files inside `docs/architecture`, `docs/standards`, `docs/setup`, `docs/contracts`, `docs/reviews`, and `docs/handoffs` if present.
4. Check `CURRENT_PROGRESS.md`.
5. Identify the current phase, current module, and current ticket.
6. Follow existing code patterns.
7. Do not introduce inconsistent architecture.
8. Do not skip validation, permissions, audit logs, tests, or docs.
9. Return changed files, API impact, DB impact, tests run, risks, and blockers.

If the chat starts in the parent workspace, use `ZeptoProject/project-context`. If the chat starts inside the project root, use `project-context`.

## Work Execution Rules

- Follow phase, module, ticket, and micro-task order.
- Work on only the requested ticket/module unless explicitly told otherwise.
- Do not merge unrelated modules.
- Do not start future tickets early.
- Do not add new features outside the ticket.
- Do not create duplicate architecture.
- Do not replace existing patterns without documented reason.
- Do not use fake implementations or temporary hacks.
- If exact status is unclear, write `needs verification`.
- If the next phase/module/ticket is unclear, verify from the provided phase PDFs before creating tickets.
- If the local tools cannot extract PDF detail, ask the user for the exact next module instead of guessing.
- Keep work inside `ZeptoProject` unless the user explicitly says otherwise.

## Backend Rules

- No business logic in controllers.
- Services own business logic.
- Repositories/models own persistence when introduced.
- Every endpoint with input needs validation.
- Every protected endpoint needs auth and permission checks once auth exists.
- Every scope-sensitive endpoint needs backend scope checks.
- Every critical mutation needs audit logging once audit exists.
- All API responses must use the standard envelope.
- All errors must use safe client messages and stable error codes.

## Documentation Rules

Update or create docs when a ticket changes:

- APIs
- DB fields
- validation rules
- permissions
- audit behavior
- environment variables
- testing commands
- handoff status

Always update `project-context/CURRENT_PROGRESS.md` after completing a module. Update the relevant phase handoff when a phase/module boundary changes.

## Review Output Rules

After work, report:

- files created
- files updated
- API endpoints added or changed
- DB fields added or changed
- tests added or changed
- commands run
- results
- risks
- blockers

## Current Important Context

Phase 1 is active. Modules 1-12 are complete for currently source-confirmed tickets, including Module 9 runtime smoke when MongoDB is reachable at `DB_MONGO_URI`, Module 10 local Docker backend service setup, Module 11 logging/monitoring/debug foundation, and Module 12 security foundation.

Before starting new work, verify the next Phase 1 module or ticket from the source micro-task document. Docker runtime smoke for Module 10 Ticket 2 still needs a machine with Docker installed. Module 11 observability scripts and Module 12 security header/CORS scripts require a running backend at `API_BASE_URL`.

Backend live health smoke always requires a reachable MongoDB (Atlas with Network Access for that network, or local MongoDB when using a local URI). Do not print or commit real database credentials.
