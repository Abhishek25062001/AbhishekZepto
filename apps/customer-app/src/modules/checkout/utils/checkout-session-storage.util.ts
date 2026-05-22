let activeCheckoutSessionId: string | null = null;

export const getActiveCheckoutSessionId = (): string | null => activeCheckoutSessionId;

export const setActiveCheckoutSessionId = (sessionId: string | null): void => {
  activeCheckoutSessionId = sessionId;
};

export const clearActiveCheckoutSessionId = (): void => {
  activeCheckoutSessionId = null;
};
