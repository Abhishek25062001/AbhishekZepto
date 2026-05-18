import express from 'express';
import path from 'node:path';
import { env } from './config/env';
import { STORAGE_PROVIDER } from './modules/media/constants/storage-provider.constant';
import { bodyParserMiddleware } from './middlewares/body-parser.middleware';
import { corsMiddleware } from './middlewares/cors.middleware';
import { globalErrorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { globalRateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { sanitizeRequestMiddleware } from './middlewares/request-sanitizer.middleware';
import { securityMiddleware } from './middlewares/security.middleware';
import { traceMiddleware } from './middlewares/trace.middleware';
import routes from './routes';

const app = express();

app.disable('x-powered-by');

app.use(requestIdMiddleware);
app.use(traceMiddleware);
app.use(requestLoggerMiddleware);
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(bodyParserMiddleware);
app.use(sanitizeRequestMiddleware);
app.use(globalRateLimitMiddleware);

if (env.MEDIA_STORAGE_PROVIDER === STORAGE_PROVIDER.LOCAL && env.APP_ENV !== 'production') {
  app.use(
    '/uploads',
    express.static(path.resolve(process.cwd(), env.MEDIA_LOCAL_UPLOAD_DIR)),
  );
}

app.use(routes);

app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

export default app;
