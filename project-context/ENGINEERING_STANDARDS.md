# Engineering Standards

## Working Style

The project is built phase by phase. Each module is broken into tickets and micro-tasks. Work must follow the provided phase/module/micro-task order.

One ticket should be one safe implementation unit. Do not merge unrelated modules. Do not jump ahead to future tickets.

## Production Quality Rules

- No vague implementation.
- No temporary hacks.
- No fake implementations.
- No duplicate architecture.
- No business logic in controllers.
- No unvalidated input.
- No protected endpoint without authentication and permissions.
- No critical mutation without audit logging when the audit module exists.
- No silent architecture changes.
- No broad refactors unless the ticket explicitly requires them.

## Backend Layering

Preferred backend flow:

```text
route -> validation middleware -> controller -> service -> repository/model -> database
```

Current backend has routes, controllers, services, validators, middleware, utilities, and database convention helpers. Repositories and domain models should be introduced by their owning module.

## Code Style

Follow existing TypeScript and Prettier conventions:

- 2-space indentation.
- semicolons.
- single quotes.
- trailing commas.
- 100 character print width.
- folders use kebab-case.
- TypeScript files use kebab-case with purpose suffixes.
- types/enums use PascalCase.
- fields and properties use camelCase.
- status values use lowercase snake_case.

## Dependency Rules

Add dependencies only when the current ticket needs them. Do not introduce framework-level changes casually.

Redis, Socket.IO, BullMQ, payment SDKs, Firebase, map providers, media storage, and testing frameworks should be introduced only by their owning modules.

## Documentation Rules

Every module should document:

- APIs added or changed.
- DB collections and fields added or changed.
- environment variables added.
- validation rules.
- auth and permission rules.
- audit logging behavior.
- test coverage and commands.
- known limitations and handoff status.

## Review Rules

After implementing a ticket:

1. Run the ticket test commands.
2. Review only the current ticket scope.
3. Fix only issues found in that review.
4. Re-run relevant tests.
5. Move to the next ticket only when the current ticket is complete.
