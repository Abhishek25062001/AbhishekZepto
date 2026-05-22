export type CheckoutReservationTimerState = {
  remainingSeconds: number;
  isExpired: boolean;
  formatted: string;
};

const formatSeconds = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const computeCheckoutReservationTimer = (
  expiresAt: string | null,
  nowMs: number = Date.now(),
): CheckoutReservationTimerState => {
  if (!expiresAt) {
    return { remainingSeconds: 0, isExpired: true, formatted: '00:00' };
  }

  const expiresMs = new Date(expiresAt).getTime();

  if (Number.isNaN(expiresMs)) {
    return { remainingSeconds: 0, isExpired: true, formatted: '00:00' };
  }

  const remainingMs = expiresMs - nowMs;

  if (remainingMs <= 0) {
    return { remainingSeconds: 0, isExpired: true, formatted: '00:00' };
  }

  const remainingSeconds = Math.ceil(remainingMs / 1000);

  return {
    remainingSeconds,
    isExpired: false,
    formatted: formatSeconds(remainingSeconds),
  };
};
