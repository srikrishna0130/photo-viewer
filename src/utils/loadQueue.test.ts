/**
 * Tests for loadQueue utility
 */
import { describe, it, expect } from 'vitest';
import { createLoadQueue } from './loadQueue';

describe('createLoadQueue', () => {
  it('executes a single task', async () => {
    const { enqueue } = createLoadQueue(2);
    const result = await enqueue(() => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it('executes tasks in order', async () => {
    const { enqueue } = createLoadQueue(1);
    const results: number[] = [];

    await Promise.all([
      enqueue(async () => { results.push(1); return 1; }),
      enqueue(async () => { results.push(2); return 2; }),
      enqueue(async () => { results.push(3); return 3; }),
    ]);

    expect(results).toEqual([1, 2, 3]);
  });

  it('limits concurrency', async () => {
    const { enqueue } = createLoadQueue(2);
    let concurrent = 0;
    let maxConcurrent = 0;

    const makeTask = (): Promise<void> =>
      enqueue(async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise((r) => setTimeout(r, 10));
        concurrent--;
      });

    await Promise.all([makeTask(), makeTask(), makeTask(), makeTask()]);
    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });

  it('propagates errors', async () => {
    const { enqueue } = createLoadQueue(2);
    await expect(
      enqueue(() => Promise.reject(new Error('fail')))
    ).rejects.toThrow('fail');
  });

  it('continues processing after an error', async () => {
    const { enqueue } = createLoadQueue(1);

    const p1 = enqueue(() => Promise.reject(new Error('fail'))).catch(() => 'caught');
    const p2 = enqueue(() => Promise.resolve('ok'));

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe('caught');
    expect(r2).toBe('ok');
  });

  it('handles concurrency of 1 as sequential', async () => {
    const { enqueue } = createLoadQueue(1);
    const order: string[] = [];

    await Promise.all([
      enqueue(async () => { order.push('a-start'); await new Promise((r) => setTimeout(r, 5)); order.push('a-end'); }),
      enqueue(async () => { order.push('b-start'); order.push('b-end'); }),
    ]);

    expect(order).toEqual(['a-start', 'a-end', 'b-start', 'b-end']);
  });
});
