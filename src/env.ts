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
    // Auth0
    AUTH0_BASE_URL: z.string(),
    AUTH0_ISSUER_DOMAIN: z.string(),
    AUTH0_CLIENT_SECRET: z.string(),
    AUTH0_CLIENT_ID: z.string(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_DB_URL: process.env.POSTGRES_DB_URL,
    DRIZZLE_ENABLE_LOG: process.env.DRIZZLE_ENABLE_LOG === 'true',
    // Sumsub
    SUMSUB_ACCESS_TOKEN: process.env.SUMSUB_ACCESS_TOKEN,
    SUMSUB_SECRET_KEY: process.env.SUMSUB_SECRET_KEY,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_DOMAIN: process.env.AUTH0_ISSUER_DOMAIN,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  },
});
