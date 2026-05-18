# Media Upload Validation Rules

## Admin upload `POST /api/v1/admin/media/upload`

| Field | Rule |
|-------|------|
| `file` | Required multipart field |
| `filePurpose` | Required enum |
| `ownerType` | Optional enum |
| `ownerId` | Optional ObjectId |
| `isPublic` | Optional boolean |
| `metadata` | Optional object |

## Admin bulk `POST /api/v1/admin/media/bulk-upload`

| Field | Rule |
|-------|------|
| `files` | Required; max `MEDIA_MAX_FILES_PER_REQUEST` (10) |
| `filePurpose` | Required enum |
| `ownerType`, `ownerId`, `isPublic`, `metadata` | Same as single upload |

## Admin list `GET /api/v1/admin/media/files`

Pagination + optional filters: `ownerType`, `ownerId`, `uploadedBy`, `fileCategory`, `filePurpose`, `status`, `isPublic`, `search`, `sortBy`, `sortOrder`.

## Admin patch `PATCH /api/v1/admin/media/files/:mediaFileId`

Updatable: `ownerType`, `ownerId`, `filePurpose`, `isPublic`, `metadata`, `status`.

## Internal attach `POST /api/v1/internal/media/attach-owner`

| Field | Rule |
|-------|------|
| `mediaFileId` | Required ObjectId |
| `ownerType` | Required enum |
| `ownerId` | Required ObjectId |
| `filePurpose` | Optional enum |

## File validation

- Allowed MIME per category; blocked: SVG, HTML, JS, executables.
- Extension must match MIME.
- Size limits: image 5MB, document 10MB, video 50MB.
- Empty files rejected.
