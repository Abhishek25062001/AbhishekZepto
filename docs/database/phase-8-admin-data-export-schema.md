# Phase 8 Admin Data Export Schema

Status: **IMPLEMENTED** — Module 20 backend.

## `admin_data_exports`

- `exportType`: bounded export domain.
- `format`: bounded output format.
- `status`: export request lifecycle status.
- `filters`: requested filter payload.
- `requestedByAdminId`: admin user that requested the export.
- `requestedAt`: request creation time.
- `completedAt`: nullable completion time.
- `failedAt`: nullable failure time.
- `failureReason`: nullable failure reason.
- `fileKey`: nullable storage key reserved for later file-generation modules.
- `fileName`: nullable file name reserved for later file-generation modules.
- `downloadUrl`: nullable download URL reserved for later file-generation modules.
- `expiresAt`: nullable expiry time reserved for later file-generation modules.
- `createdAt`: record creation timestamp.
- `updatedAt`: record update timestamp.

Module 20 must not create generated export file records, binary storage
objects, download streams, or scheduled export records.
