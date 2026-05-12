import pinoHttp from 'pino-http';
import { logger } from '../config/logger';

export const requestLoggerMiddleware = pinoHttp({
  logger,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers.x-api-key',
      'req.body.password',
      'req.body.otp',
      'req.body.accessToken',
      'req.body.refreshToken',
      'req.body.token',
    ],
    censor: '[redacted]',
  },
  customProps: (req) => ({
    requestId: (req as { requestId?: string }).requestId,
    traceId: (req as { traceId?: string }).traceId,
    method: req.method,
    url: req.url,
  }),
});
