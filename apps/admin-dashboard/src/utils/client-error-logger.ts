import { isDevelopment } from '../config/env';

type ClientErrorLogPayload = {
  message: string;
  stack?: string;
  componentStack?: string;
  route: string;
  timestamp: string;
};

export const logClientError = (error: Error, componentStack?: string): void => {
  if (!isDevelopment) {
    return;
  }

  const payload: ClientErrorLogPayload = {
    message: error.message,
    stack: error.stack,
    componentStack,
    route: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  console.error('Admin Dashboard client error', payload);
};
