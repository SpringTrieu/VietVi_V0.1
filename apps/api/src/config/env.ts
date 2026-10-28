import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  LOG_LEVEL: z.string().default('debug'),
  APP_URL_WEB: z.string().url().default('http://localhost:3000'),
  APP_URL_ADMIN: z.string().url().default('http://localhost:3001'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),
  COOKIE_DOMAIN: z.string().default('localhost'),

  DATABASE_URL: z.string().default('postgres://vietvi:vietvi_dev_secret@localhost:5432/vietvi?sslmode=disable'),
  DATABASE_URL_TEST: z.string().default('postgres://vietvi:vietvi_dev_secret@localhost:5432/vietvi_test?sslmode=disable'),

  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_ACCESS_SECRET: z.string().default('dev-jwt-access-secret-minimum-32-chars-long'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  OTP_TTL_SECONDS: z.coerce.number().default(300),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(5),

  S3_ENDPOINT: z.string().default('http://localhost:9000'),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY: z.string().default('minioadmin'),
  S3_SECRET_KEY: z.string().default('minioadmin'),
  S3_BUCKET_PUBLIC: z.string().default('vietvi-public'),
  S3_BUCKET_PRIVATE: z.string().default('vietvi-private'),
  UPLOAD_MAX_MB: z.coerce.number().default(25),

  MAIL_FROM: z.string().default('no-reply@vietvi.vn'),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),

  PAYMENT_MODE: z.enum(['GATEWAY', 'MANUAL']).default('MANUAL'),
  PAYMENT_PROVIDER: z.string().default('manual'),

  SENTRY_DSN: z.string().optional().default(''),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, unknown> = process.env): Env {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    console.error('❌ Cấu hình biến môi trường không hợp lệ:', parsed.error.format());
    throw new Error('Cấu hình biến môi trường không hợp lệ');
  }
  return parsed.data;
}
