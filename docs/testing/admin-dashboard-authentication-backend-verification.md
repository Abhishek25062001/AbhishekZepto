# Admin Dashboard Authentication Backend Verification

## Prerequisites

- Backend server running
- Seeded admin phone: `6666666666`

## Happy Path

- Request OTP for admin phone `6666666666`
- Verify OTP with `role = super_admin`
- Confirm `GET /api/v1/admin/me/permissions`
- Confirm `adminId`, `role`, and `permissions` are returned
