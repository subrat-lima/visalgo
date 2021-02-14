/**
 * Queue Class
 * Only contains methods required for BFS implementation
 * Methods: enqueue, dequeue, isEmpty
 */
export class Queue {
  constructor() {
    this.queue = [];
  }

  enqueue(item) {
    this.queue.push(item);
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}
