import { randomUUID } from 'crypto';
import type { RequestHandler } from 'express';

export const traceMiddleware: RequestHandler = (req, res, next) => {
  const traceId = req.header('x-trace-id') || randomUUID();

  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);

  next();
};
