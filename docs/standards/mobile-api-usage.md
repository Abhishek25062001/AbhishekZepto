# Mobile API Usage

## Purpose

This standard defines how React Native apps call backend APIs.

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

Screens must not call Axios directly. Screens should call hooks or service
functions that wrap API service files.

## Public Backend Endpoints

Mobile apps may use these public backend endpoints in the React Native
Foundation module:

```http
GET /api/v1/public/health
GET /api/v1/public/version
GET /api/v1/public/system-info
```

## Health Check Contract

Mobile apps use this endpoint to verify backend reachability:

```http
GET /api/v1/public/health
```

## Version Check Contract

Mobile apps use this endpoint to display or inspect backend version information:

```http
GET /api/v1/public/version
```

## System Info Contract

Mobile apps use this endpoint for safe public backend system information:

```http
GET /api/v1/public/system-info
```

## Error Handling

Mobile API clients should preserve the backend response envelope and map display
messages through a shared error-message utility.

