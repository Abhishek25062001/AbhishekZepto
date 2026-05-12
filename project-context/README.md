# Project Context Index

## Purpose

This folder is the persistent memory layer for future Codex chats working on the Zepto-like quick-commerce project.

Every new chat should read this folder before planning, ticketizing, coding, reviewing, or modifying files.

## Path Rule

The project root is:

```text
ZeptoProject/
```

If the shell starts inside `ZeptoProject`, read:

```text
project-context/
```

If the shell starts in the parent workspace, read:

```text
ZeptoProject/project-context/
```

The earlier shorthand `/project-context` means the `project-context` folder at the project root, not the operating-system root.

## Recommended Reading Order

1. `PROJECT_OVERVIEW.md`
2. `CURRENT_PROGRESS.md`
3. `AI_AGENT_INSTRUCTIONS.md`
4. `PHASE_STATUS.md`
5. `PHASE_HANDOFFS/PHASE_1_HANDOFF.md`
6. `ARCHITECTURE_RULES.md`
7. `ENGINEERING_STANDARDS.md`
8. `API_STANDARDS.md`
9. `DATABASE_STANDARDS.md`
10. `SECURITY_STANDARDS.md`
11. `MODULE_DEPENDENCIES.md`
12. `CODING_PATTERNS.md`
13. `TESTING_RULES.md`
14. `DEPLOYMENT_CONTEXT.md`
15. `KNOWN_DECISIONS.md`
16. `REALTIME_ARCHITECTURE.md`

Then read relevant files under:

```text
docs/architecture/
docs/standards/
docs/setup/
docs/handoffs/
```

Also check `docs/contracts` and `docs/reviews` when relevant.

## Current Continuation Point

Phase 1 is active. Modules 1-12 are complete for currently source-confirmed tickets, including Module 9 runtime smoke when MongoDB is reachable, Module 10 local Docker backend service setup, Module 11 logging/monitoring/debug foundation, and Module 12 security foundation.

The next action is to verify the next Phase 1 module or ticket from the source micro-task document before starting new work. Docker runtime smoke for Module 10 Ticket 2 is still pending in this environment because the `docker` CLI is not installed. Module 11 local observability scripts and Module 12 security header/CORS scripts require a running backend at `API_BASE_URL`.

## Maintenance Rule

After every completed ticket or module, update:

- `CURRENT_PROGRESS.md`
- the relevant `PHASE_HANDOFFS/PHASE_*_HANDOFF.md`
- any standards file affected by the change
- any docs under `docs/` required by the ticket
