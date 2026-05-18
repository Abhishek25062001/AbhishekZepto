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
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('30d'),
  OTP_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(300),
  OTP_RESEND_INTERVAL_SECONDS: z.coerce.number().int().positive().default(30),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  OTP_MAX_RESENDS: z.coerce.number().int().positive().default(3),
  OTP_DEV_CODE: z
    .string()
    .regex(/^\d{4,8}$/)
    .optional(),
  INVENTORY_LOCK_EXPIRY_JOB_ENABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  INVENTORY_LOCK_EXPIRY_JOB_INTERVAL_SECONDS: z.coerce.number().int().positive().default(60),
  MEDIA_STORAGE_PROVIDER: z.enum(['local', 's3', 'gcs', 'cloudinary']).default('local'),
  MEDIA_LOCAL_UPLOAD_DIR: z.string().min(1).default('uploads'),
  MEDIA_PUBLIC_BASE_URL: z.string().url().default('http://localhost:5000/uploads'),
  MEDIA_MAX_IMAGE_SIZE_BYTES: z.coerce.number().int().positive().default(5_242_880),
  MEDIA_MAX_DOCUMENT_SIZE_BYTES: z.coerce.number().int().positive().default(10_485_760),
  MEDIA_MAX_VIDEO_SIZE_BYTES: z.coerce.number().int().positive().default(52_428_800),
  MEDIA_MAX_FILES_PER_REQUEST: z.coerce.number().int().positive().default(10),
  MEDIA_ALLOWED_IMAGE_MIME_TYPES: z
    .string()
    .default('image/jpeg,image/jpg,image/png,image/webp'),
  MEDIA_ALLOWED_DOCUMENT_MIME_TYPES: z
    .string()
    .default('application/pdf,image/jpeg,image/png'),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_REGION: z.string().optional(),
  AWS_S3_ACCESS_KEY_ID: z.string().optional(),
  AWS_S3_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_PUBLIC_BASE_URL: z.string().url().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.flatten().fieldErrors;

  throw new Error(
    `Invalid backend environment configuration: ${JSON.stringify(formattedErrors)}`,
  );
}

if (parsedEnv.data.APP_ENV === 'production' && parsedEnv.data.OTP_DEV_CODE) {
  throw new Error('OTP_DEV_CODE must not be set in production');
}

if (
  parsedEnv.data.APP_ENV === 'production' &&
  parsedEnv.data.MEDIA_STORAGE_PROVIDER === 'local'
) {
  throw new Error('MEDIA_STORAGE_PROVIDER=local is not allowed in production');
}

export const env = parsedEnv.data;

export type BackendEnv = typeof env;
