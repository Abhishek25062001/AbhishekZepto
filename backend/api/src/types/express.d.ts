import type { AuthUserContext } from '../modules/auth/types/auth-user-context.types';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      traceId?: string;
      user?: AuthUserContext;
      deliveryAgentId?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deliveryAgent?: any;
    }
  }
}

export {};
