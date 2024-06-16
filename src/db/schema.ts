import { sql } from 'drizzle-orm';
import { boolean, pgTable, time, uuid, varchar } from 'drizzle-orm/pg-core';

export const todos = pgTable('todo', {
  id: uuid('id')
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: varchar('text').notNull(),
  isCompleted: boolean('isCompleted').notNull().default(false),
  createdAt: time('createdAt')
    .notNull()
    .default(sql`now()`),
});

export type Todo = typeof todos.$inferSelect;
