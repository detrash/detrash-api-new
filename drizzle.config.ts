import { defineConfig } from 'drizzle-kit';

import { env } from '@/env';

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  migrations: {
    table: 'migrations',
    schema: 'public',
  },
  verbose: true,
  strict: true,
});
