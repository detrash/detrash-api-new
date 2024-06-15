import { pgTable, varchar, boolean, uuid, time } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const todos = pgTable("todo", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: varchar("text").notNull(),
  isCompleted: boolean("isCompleted").notNull().default(false),
  createdAt: time("createdAt")
    .notNull()
    .default(sql`now()`),
});

export type Todo = typeof todos.$inferSelect;
