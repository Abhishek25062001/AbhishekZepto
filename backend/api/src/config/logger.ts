import pino from 'pino';
import { env } from './env';

const loggerOptions: pino.LoggerOptions = {
  level: env.LOG_LEVEL || 'info',
  base: {
    service: 'backend-api',
    environment: env.APP_ENV,
    version: env.APP_VERSION,
  },
};

if (env.APP_ENV === 'development') {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard',
    },
  };
}

export const logger = pino(loggerOptions);
