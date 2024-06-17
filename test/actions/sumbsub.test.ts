import { createTodo } from '@/actions/sumsub';

describe('sumbsub', () => {
  it('should return the sum of two numbers', async () => {
    await createTodo({ text: 'hello', isCompleted: true });
  }, 60000);
});
