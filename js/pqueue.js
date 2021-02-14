/**
 * Element Class
 * Stores data and priority required for Priority Queue
 */
class PQElement {
  constructor(data, priority) {
    this.data = data;
    this.priority = priority;
  }
}

/**
 * Priority Queue Class
 * Contains code enough to support Dijkstra Algorithm
 */
export class PriorityQueue {
  constructor() {
    this.pqueue = [];
  }

  enqueue(element, priority) {
    let newItem = new PQElement(element, priority);
    let length = this.pqueue.length;
    for(let i = 0; i < length; i++) {
      if(this.pqueue[i].priority > newItem.priority) {
        this.pqueue.splice(i, 0, newItem);
        return;
      }
    }
    this.pqueue.push(newItem);
  }

  dequeue() {
    return this.pqueue.shift();
  }

  isEmpty() {
    return this.pqueue.length === 0;
  }
}
