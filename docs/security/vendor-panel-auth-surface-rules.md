# Vendor Panel Auth Surface Rules

## Fixed Surface Rules

- Login requests from Vendor Panel use the vendor login role
- Verify requests must always send `appSurface = vendor_panel`
- Vendor Panel must accept only supported vendor roles:
  `vendor_owner`, `store_manager`, `store_staff`
- Bad role state or missing route state must redirect back to `/login`
