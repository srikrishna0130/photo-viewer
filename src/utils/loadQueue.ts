/**
 * Async task queue with configurable concurrency.
 *
 * Limits how many thumbnail loads run in parallel to prevent
 * I/O thrashing when many images become visible at once.
 */

type Task<T> = () => Promise<T>;

interface QueueItem<T> {
  task: Task<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

/**
 * Creates a concurrency-limited async queue.
 * @param concurrency - Maximum number of tasks running simultaneously
 * @returns An `enqueue` function that accepts async tasks
 */
export function createLoadQueue(concurrency: number = 4): {
  enqueue: <T>(task: Task<T>) => Promise<T>;
} {
  const queue: QueueItem<unknown>[] = [];
  let running = 0;

  function runNext(): void {
    if (running >= concurrency || queue.length === 0) return;

    const item = queue.shift();
    if (!item) return;

    running++;
    item
      .task()
      .then(item.resolve)
      .catch(item.reject)
      .finally(() => {
        running--;
        runNext();
      });
  }

  function enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      queue.push({ task, resolve, reject } as QueueItem<unknown>);
      runNext();
    });
  }

  return { enqueue };
}

/** Shared global queue for thumbnail loading (max 6 concurrent) */
export const thumbnailQueue = createLoadQueue(6);
