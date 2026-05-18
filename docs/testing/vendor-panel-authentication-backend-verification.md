# Vendor Panel Authentication Backend Verification

## Prerequisites

- Backend server running
- Seeded vendor phone: `7777777777`

## Happy Path

- Request OTP for vendor phone `7777777777`
- Verify OTP with `role = vendor_owner`
- Confirm `GET /api/v1/vendor/me/permissions`
- Confirm `vendorUserId`, `vendorId`, `storeId`, `cityId`, `role`, and
  `permissions` are returned
