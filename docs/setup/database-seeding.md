# Database Seeding

## Purpose

Database Foundation adds seed runner scaffolding only. Real seed models and
records belong to later authentication, catalog, and admin modules.

## Run Seeds

```bash
npm run seed -w backend/api
```

This command connects to MongoDB before running seed placeholders and disconnects
after completion.

## Dry Run

```bash
npm run seed:dry -w backend/api
```

Dry run verifies the seed runner without writing to MongoDB.

## Deferred Real Seeds

The following seed areas are placeholders until their owning modules implement
the required models:

- default settings
- roles
- super admin
- units
