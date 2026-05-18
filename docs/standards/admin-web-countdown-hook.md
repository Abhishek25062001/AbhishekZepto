# Admin Web Countdown Hook

## Hook Rules

- Hook name: `useCountdown`
- Inputs:
  - initial seconds
- Outputs:
  - `secondsRemaining`
  - `isComplete`
  - `reset(nextSeconds)`
- Never count below `0`
- Clear interval on unmount
