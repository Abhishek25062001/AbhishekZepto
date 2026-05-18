import { useCallback, useEffect, useMemo, useState } from 'react';

export function useCountdown(initialSeconds: number) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.max(0, initialSeconds),
  );

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsRemaining]);

  const reset = useCallback((nextSeconds: number) => {
    setSecondsRemaining(Math.max(0, nextSeconds));
  }, []);

  return useMemo(
    () => ({
      secondsRemaining,
      isComplete: secondsRemaining <= 0,
      reset,
    }),
    [reset, secondsRemaining],
  );
}
