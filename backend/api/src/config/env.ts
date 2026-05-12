import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production', 'test']),
  APP_PORT: z.coerce.number().int().positive(),
  APP_VERSION: z.string().min(1),
  LOG_LEVEL: z.string().min(1).default('info'),
  DEBUG_MODE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  DB_MONGO_URI: z.string().min(1).optional(),
  ADMIN_WEB_ORIGIN: z.string().url().optional(),
  VENDOR_WEB_ORIGIN: z.string().url().optional(),
  REDIS_URL: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().min(1).optional(),
  JWT_REFRESH_SECRET: z.string().min(1).optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.flatten().fieldErrors;

  throw new Error(
    `Invalid backend environment configuration: ${JSON.stringify(formattedErrors)}`,
  );
}

export const env = parsedEnv.data;

export type BackendEnv = typeof env;
