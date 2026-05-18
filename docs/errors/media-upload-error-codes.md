# Media Upload Error Codes

Status: **IMPLEMENTED**

| Code | HTTP | When |
|------|------|------|
| `MEDIA_FILE_NOT_FOUND` | 404 | Missing or soft-deleted |
| `MEDIA_UPLOAD_FAILED` | 500 | Storage upload failure |
| `MEDIA_DELETE_FAILED` | 500 | Storage delete failure |
| `MEDIA_INVALID_MIME_TYPE` | 400 | MIME not allowed |
| `MEDIA_INVALID_EXTENSION` | 400 | Extension mismatch |
| `MEDIA_FILE_TOO_LARGE` | 413 | Exceeds category limit |
| `MEDIA_FILE_EMPTY` | 400 | Zero-byte file |
| `MEDIA_FILE_COUNT_EXCEEDED` | 400 | Bulk over max files |
| `MEDIA_STORAGE_PROVIDER_INVALID` | 500 | Unknown provider |
| `MEDIA_ACCESS_DENIED` | 403 | Vendor scope violation |
| `MEDIA_OWNER_INVALID` | 400 | Invalid owner attach |
| `MEDIA_SIGNED_URL_FAILED` | 500 | Signed URL generation failed |
