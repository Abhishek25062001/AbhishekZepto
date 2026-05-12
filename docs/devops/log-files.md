# Log Files

## Purpose

This document records local backend log-file preparation for future file
transports. Phase 1 default logging remains console logging.

## Log Directory

Backend log directory:

```text
backend/api/logs
```

The directory is kept in the repository with:

```text
backend/api/logs/.gitkeep
```

## Ignored Log Files

Generated log files are not committed:

```text
backend/api/logs/*.log
backend/api/logs/*.json
```

## Placeholder File Names

Log file path constants are defined in:

```text
backend/api/src/config/log-file-paths.ts
```

Current placeholder names:

- `error.log`
- `combined.log`

## Phase 1 Rule

Phase 1 uses console logging. File transport can be added later if needed.

## API Endpoints

No new API endpoints are created by this task.

## DB Fields

No new database fields are created by this task.
