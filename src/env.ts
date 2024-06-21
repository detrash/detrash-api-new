import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    POSTGRES_DB_URL: z.string().url(),
    NODE_ENV: z.string().optional(),
    DRIZZLE_ENABLE_LOG: z.boolean().optional(),
    // Sumsub
    SUMSUB_ACCESS_TOKEN: z.string(),
    SUMSUB_SECRET_KEY: z.string(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_DB_URL: process.env.POSTGRES_DB_URL,
    DRIZZLE_ENABLE_LOG: process.env.DRIZZLE_ENABLE_LOG === 'true',
    // Sumsub
    SUMSUB_ACCESS_TOKEN: process.env.SUMSUB_ACCESS_TOKEN,
    SUMSUB_SECRET_KEY: process.env.SUMSUB_SECRET_KEY,
  },
});
