# API Contract Checklist

Use this checklist before adding or reviewing any backend endpoint.

- [ ] Every API must use `/api/v1`.
- [ ] Every API must belong to a surface route group.
- [ ] Every successful response must include `success`, `message`, `data`, and `meta`.
- [ ] Every error response must include `success`, `message`, and `error`.
- [ ] Every error object must include `code` and `details`.
- [ ] Every paginated list must include `page`, `limit`, `total`, and `hasNextPage`.
- [ ] Every protected API must require `Authorization: Bearer <accessToken>`.
- [ ] Every create API should return status code `201`.
- [ ] Every async accepted API should return status code `202`.
- [ ] Every validation failure should return status code `422`.
- [ ] Every duplicate/conflict failure should return status code `409`.
- [ ] Every unauthorized request should return status code `401`.
- [ ] Every forbidden request should return status code `403`.
- [ ] Every not-found request should return status code `404`.
- [ ] Every rate-limit failure should return status code `429`.
- [ ] Every internal failure should return status code `500`.
- [ ] Every date field must be ISO string.
- [ ] Every ObjectId must be returned as string.
- [ ] Frontend service files must not hardcode full URLs except base URL config.
- [ ] Screen/page components must not directly call Axios.
