# Web API Usage

## Purpose

This standard defines how React web panels call backend APIs.

## API Call Rules

All backend calls must go through:

```text
src/services/api/client.ts
```

Public APIs must be grouped inside:

```text
src/services/api/public.api.ts
```

Future auth APIs must be grouped inside:

```text
src/services/api/auth.api.ts
```

Pages must not call Axios directly. Pages should call hooks or service
functions that wrap API service files.

## Public Backend Endpoints

Web panels may use these public backend endpoints in the Web Panels Foundation
module:

```http
GET /api/v1/public/health
GET /api/v1/public/version
GET /api/v1/public/system-info
```

## Health Check Contract

Web panels use this endpoint to verify backend reachability:

```http
GET /api/v1/public/health
```

## Version Check Contract

Web panels use this endpoint to display or inspect backend version information:

```http
GET /api/v1/public/version
```

## System Info Contract

Web panels use this endpoint for safe public backend system information:

```http
GET /api/v1/public/system-info
```

## Error Handling

Web API clients should preserve the backend response envelope and map display
messages through a shared error-message utility.

