import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/env';

import * as schema from './schema';

declare global {
  // eslint-disable-next-line unused-imports/no-unused-vars
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

const client = postgres(env.POSTGRES_DB_URL);

let db: PostgresJsDatabase<typeof schema>;

if (env.NODE_ENV === 'production') {
  db = drizzle(client, { schema });
} else {
  if (!global.db) {
    global.db = drizzle(client, { schema, logger: true });
  }
  db = global.db;
}

export { db };
export * from './schema';
