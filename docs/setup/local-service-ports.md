# Local Service Ports

## Default Ports

| Service | Default port | Notes |
| --- | ---: | --- |
| Backend API | `5000` | May be changed with `APP_PORT`. |
| Vendor Panel | `5173` | Vite default used by local smoke checks. |
| Admin Dashboard | `5174` | Vite local smoke port. |
| Customer App Metro | `8081` | Metro port used in prior verification. |
| Delivery Agent App Metro | `8082` | Alternate Metro port used in prior verification. |
| MongoDB | `27017` | Required for backend startup. |
| Redis | `6379` | Placeholder for later Redis-owned modules; not started by current Docker setup. |

## Port Conflict Rule

If a default port is already in use, choose the next safe local port and record
the actual port in the handoff or smoke-test notes for that ticket.

Previously verified backend smoke checks used ports `5010` and `5020` when
`5000` was already occupied.

## Docker Service Ports

Current Docker backend services use:

| Service | Host port | Container port | Notes |
| --- | ---: | ---: | --- |
| `backend-api` | `5000` | `5000` | Existing backend API container. |
| `mongodb` | `27017` | `27017` | Local MongoDB data is stored in a Compose volume. |
