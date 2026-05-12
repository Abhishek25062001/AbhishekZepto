# Development OTP Provider

## Goal

Document the placeholder OTP provider behavior for Backend Auth Core.

## Planned File Path

- `/backend/api/src/modules/auth/services/otp-provider.service.ts`

## Planned Type

### SendOtpInput

- `phone`
- `otp`
- `deliveryChannel`
- `purpose`

## Planned Function

### sendOtp(input)

- In non-production, log only masked target and delivery channel
- Do not log raw OTP in production
- In development mode, allow console output of dev OTP only when `OTP_DEV_MODE=true`

## Planned Provider Response

```ts
{
  sent: true,
  provider: 'dev',
}
```

## Planned TODO

- Replace dev OTP provider with SMS/WhatsApp provider integration later

## Deferral

- Production provider integration comes later
