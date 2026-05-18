# Mobile Countdown Hook

## Goal

Use a shared mobile countdown hook for OTP expiry and resend timers instead of
duplicating interval logic inside auth screens.

## Hook Contract

- Input: initial countdown seconds
- Output:
  - `secondsRemaining`
  - `isComplete`
  - `reset(nextSeconds)`

## Usage Rules

- Use one hook instance for OTP expiry countdown
- Use one hook instance for resend wait countdown
- Clear intervals automatically on unmount
- Never allow countdown values to go below `0`
