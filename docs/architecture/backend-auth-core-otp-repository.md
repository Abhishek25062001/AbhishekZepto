# Backend Auth Core OTP Repository

## Goal

Document the planned OTP challenge repository for Backend Auth Core.

## Planned File Paths

- `/backend/api/src/modules/auth/repositories/otp-challenge.repository.ts`
- `/backend/api/src/modules/auth/repositories/index.ts`

## Planned Functions

### createOtpChallenge(input)

- Creates a record in `otp_challenges`

### findLatestActiveOtpChallenge(phone, role, purpose)

Filters by:

- `phone`
- `role`
- `purpose`
- `isDeleted: false`
- `verifiedAt: null`

Sort:

- `createdAt: -1`

### findOtpChallengeById(challengeId)

- Finds a challenge by id

### incrementOtpAttempt(challengeId)

- Increments `attemptCount`

### incrementOtpResend(challengeId)

- Increments `resendCount`
- Updates `lastSentAt`

### markOtpChallengeVerified(challengeId)

Sets:

- `verifiedAt: new Date()`
- `status: 'active'`

### blockOtpChallenge(challengeId, blockedUntil)

Sets:

- `blockedUntil`
- `status: 'blocked'`

### markOtpChallengeExpired(challengeId)

Sets:

- `status: 'inactive'`

### deleteExpiredOtpChallenges()

- Placeholder function for future cleanup

## Planned Export

- Export OTP challenge repository from `/backend/api/src/modules/auth/repositories/index.ts`

## DB Fields

- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.purpose`
- `otp_challenges.otpHash`
- `otp_challenges.expiresAt`
- `otp_challenges.attemptCount`
- `otp_challenges.resendCount`
- `otp_challenges.lastSentAt`
- `otp_challenges.verifiedAt`
- `otp_challenges.blockedUntil`
