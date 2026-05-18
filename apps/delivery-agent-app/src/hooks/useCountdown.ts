import { useCallback, useEffect, useState } from 'react';

type UseCountdownResult = {
  secondsRemaining: number;
  isComplete: boolean;
  reset: (nextSeconds: number) => void;
};

export function useCountdown(initialSeconds: number): UseCountdownResult {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const reset = useCallback((nextSeconds: number) => {
    setSecondsRemaining(Math.max(0, nextSeconds));
  }, []);

  return {
    secondsRemaining,
    isComplete: secondsRemaining <= 0,
    reset,
  };
}
