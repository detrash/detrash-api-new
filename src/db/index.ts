import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import { env } from '@/env';

import * as schema from './schema';

declare global {
  // eslint-disable-next-line unused-imports/no-unused-vars
  var db: NodePgDatabase<typeof schema> | undefined;
}

const client = new Client({
  connectionString: env.DATABASE_URL,
});

let db: NodePgDatabase<typeof schema>;

if (env.NODE_ENV === 'production') {
  db = drizzle(client, { schema });
} else {
  if (!global.db) {
    global.db = drizzle(client, { schema });
  }
  db = global.db;
}

export { db };
export * from './schema';
