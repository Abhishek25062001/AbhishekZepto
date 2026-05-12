import type { Request } from 'express';

export type LogContext = {
  requestId?: string;
  userId?: string;
  role?: string;
  sessionId?: string;
};

export const createLogContext = (req: Request): LogContext => ({
  requestId: req.requestId,
  userId: req.user?.userId,
  role: req.user?.role,
  sessionId: req.user?.sessionId,
});
