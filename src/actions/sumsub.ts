import { db, Todo, todos } from '@/db';

export async function createTodo(newTodo: Omit<Todo, 'id' | 'createdAt'>) {
  const [todo] = await db.insert(todos).values(newTodo).returning();
  return todo;
}
