import { isDevelopment } from '../config/env';

type MobileErrorLogPayload = {
  message: string;
  stack?: string;
  componentStack?: string;
  screen?: string;
  timestamp: string;
};

export const logMobileError = (
  error: Error,
  componentStack?: string,
  screen?: string,
): void => {
  if (!isDevelopment) {
    return;
  }

  const payload: MobileErrorLogPayload = {
    message: error.message,
    stack: error.stack,
    componentStack,
    screen,
    timestamp: new Date().toISOString(),
  };

  console.error('Delivery Agent App mobile error', payload);
};
