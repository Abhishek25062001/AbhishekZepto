# Request Tracing

## Purpose

Request tracing provides lightweight correlation identifiers for backend logs,
responses, and future frontend debugging flows.

## Request ID

The backend request ID header is:

```text
x-request-id
```

If a request ID is not provided, the backend generates one with
`crypto.randomUUID()`.

The request ID is attached to:

```text
req.requestId
```

The backend returns it in the response header:

```text
x-request-id
```

## Trace ID

The trace header is:

```text
x-trace-id
```

Frontend apps may pass `x-trace-id` later for debugging multi-step flows. If the
header is missing, the backend generates a trace ID with `crypto.randomUUID()`.

The trace ID is attached to:

```text
req.traceId
```

The backend returns it in the response header:

```text
x-trace-id
```

## Logs And Responses

Request logs and error logs should include both `requestId` and `traceId` when
available.

Successful responses can include:

```json
{
  "meta": {
    "requestId": "uuid",
    "traceId": "uuid"
  }
}
```

Error responses can include request and trace IDs in response metadata. Do not
put secrets, tokens, OTP values, or full authorization headers in trace metadata.

## API Endpoints

No new API endpoints are created by this task.

## DB Fields

No new database fields are created by this task.
