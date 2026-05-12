import cors from 'cors';

import { env } from '../config/env';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  env.VENDOR_WEB_ORIGIN,
  env.ADMIN_WEB_ORIGIN,
].filter((origin): origin is string => Boolean(origin));

export const corsMiddleware = cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-trace-id'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    callback(null, allowedOrigins.includes(origin));
  },
});
