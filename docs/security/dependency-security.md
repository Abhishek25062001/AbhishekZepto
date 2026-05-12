# Dependency Security

## Dependency Safety Command

```bash
npm audit
```

## Dependency Fix Command

```bash
npm audit fix
```

Do not run forced audit fix without review.

## Root Scripts

```bash
npm run audit:all
npm run audit:backend
npm run audit:web
npm run audit:mobile
```

## CI Baseline

CI includes backend and web panel dependency audit steps.

Mobile audit may be allowed to warn in Phase 1 if the React Native dependency
tree has known advisories.

## API Endpoints

No new API endpoints created in this task.

## DB Fields

No new database fields created in this task.
