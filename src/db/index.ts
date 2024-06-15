import { env } from "@/env";
import * as schema from "./schema";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { pgEnum } from "drizzle-orm/pg-core";

import { Client } from "pg";

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: NodePgDatabase<typeof schema> | undefined;
}

const client = new Client({
  connectionString: "postgres://user:password@host:port/db",
});

let db: NodePgDatabase<typeof schema>;

if (env.NODE_ENV === "production") {
  db = drizzle(client, { schema });
} else {
  if (!global.db) {
    global.db = drizzle(client, { schema });
  }
  db = global.db;
}

export { db };
export * from "./schema";
