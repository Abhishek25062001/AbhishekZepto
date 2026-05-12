# Code Style

## Purpose

This document records code style expectations for future implementation work.

It is documentation only. It does not add lint configuration, source code,
middleware, services, components, or tests.

## Related Standards

Future implementation must align with:

- [Naming Conventions](naming-conventions.md)
- [API Conventions](api-conventions.md)
- [Database Conventions](database-conventions.md)
- [Environment Conventions](environment-conventions.md)

## Imports

Import rules:

- Prefer clear imports from the owning module.
- Avoid circular dependencies.
- Avoid importing across feature internals when a public export exists.
- Keep shared utilities small and domain-neutral.
- Do not place business logic in generic helper folders.

Future tooling may enforce import ordering and boundary rules after ESLint setup
is introduced.

## Naming

Naming must follow `naming-conventions.md`.

Summary:

- folders use kebab-case
- docs use kebab-case
- TypeScript files use kebab-case with purpose suffixes where helpful
- API response fields use camelCase
- database fields use camelCase
- enum/status values use lowercase snake_case
- TypeScript types and enums use PascalCase

## Folders

Folder usage should follow project ownership boundaries.

Backend modules should keep domain logic inside their domain folders.

Frontend apps should keep screen, navigation, store, API client, and component
code inside the app that owns the experience.

Shared package code should be added only when more than one surface needs the
same stable type or constant.

## API Clients

Each frontend app should own its API client setup.

API clients should:

- use environment-based API base URLs
- attach auth tokens through a controlled token strategy
- handle standard API response and error shapes
- avoid duplicating business-critical calculations
- keep backend APIs as the source of truth

Shared API types can later live in `packages/shared` when a module explicitly
requires them.

## Error Handling

Backend error handling should follow `api-conventions.md`.

Frontend error handling should:

- show safe user-facing messages
- avoid exposing raw server internals
- preserve enough context for debugging when appropriate
- use shared loading, empty, and error states once UI foundation exists

## Shared Components

Shared UI components should be created only inside the app or package that owns
them.

Do not create cross-app shared UI before a real duplication need exists.

Future shared components should:

- be presentation-focused
- avoid hidden API calls
- accept data through props
- expose actions through callbacks
- avoid owning business-critical state

## Formatting

Formatting should follow the root Prettier configuration.

General expectations:

- 2-space indentation
- UTF-8
- LF line endings
- semicolons enabled
- single quotes
- trailing commas enabled
- 100 character print width

## TypeScript

TypeScript should be used across backend, React Native apps, React.js panels, and
shared packages.

Future implementation should prefer explicit domain types for API payloads,
database documents, and UI state.
