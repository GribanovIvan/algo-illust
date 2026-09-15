import { DSArray } from "../types/ds.types";

export default class Queue {
  private _queue: any[];
  private _length: number;

  constructor(array: DSArray = []) {
    this._queue = [...array];
    this._length = array.length;
  }

  get length() {
    return this._length;
  }
  get queue() {
    return this._queue;
  }

  enqueue(value: any) {
    this._queue.push(value);
    this._length++;
  }
  dequeue() {
    if (this._length === 0) {
      return null;
    }
    this._length--;
    return this._queue.shift();
  }
  peek() {
    if (this._length === 0) {
      return null;
    }
    return this._queue[0];
  }
  clear() {
    this._queue = [];
    this._length = 0;
  }
  isEmpty() {
    return this._length === 0;
  }

  findMin() {
    if (this._length === 0) {
      return null;
    }
    let min = this.peek();
    const tempQueue = new Queue([]);
    while (!this.isEmpty()) {
      const value = this.dequeue();
      tempQueue.enqueue(value);

      if (value < min) {
        min = value;
      }
    }
    this.merge(tempQueue);
    return min;
  }

  findMax() {
    if (this._length === 0) {
      return null;
    }
    let max = this.peek();
    const tempQueue = new Queue([]);
    while (!this.isEmpty()) {
      const value = this.dequeue();
      tempQueue.enqueue(value);

      if (value > max) {
        max = value;
      }
    }
    this.merge(tempQueue);
    return max;
  }

  findIndex(value: number | string) {
    if (this._length === 0) {
      return null;
    }
    let index = 0;
    const tempQueue = new Queue([]);
    while (!this.isEmpty()) {
      const tempValue = this.dequeue();
      tempQueue.enqueue(tempValue);

      if (tempValue === value) {
        break;
      }
      index++;
    }
    this.merge(tempQueue);
    return index === this._length ? null : index;
  }

  find(index: number) {
    if (this._length === 0) {
      return null;
    }
    let value: number | string | null = null;
    const tempQueue = new Queue([]);
    while (!this.isEmpty()) {
      const tempValue = this.dequeue();
      tempQueue.enqueue(tempValue);

      if (index === 0) {
        value = tempValue;
        break;
      }
      index--;
    }
    this.merge(tempQueue);
    return value;
  }

  merge(queue: Queue) {
    if (queue === this) throw new Error("Cannot merge a structure with itself");
    const reversedQueue = new Queue([]);

    while (!queue.isEmpty()) {
      reversedQueue.enqueue(queue.dequeue());
    }
    while (!this.isEmpty()) {
      reversedQueue.enqueue(this.dequeue());
    }
    while (!reversedQueue.isEmpty()) {
      this.enqueue(reversedQueue.dequeue());
    }
    return this._queue;
  }
}