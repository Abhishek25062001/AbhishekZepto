import express from 'express';
import type { Request } from 'express';

export type RequestWithRawBody = Request & { rawBody?: Buffer };

export const bodyParserMiddleware = [
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      const request = req as RequestWithRawBody;
      if (request.originalUrl?.includes('/webhooks/razorpay')) {
        request.rawBody = buf;
      }
    },
  }),
  express.urlencoded({ extended: true, limit: '1mb' }),
];
