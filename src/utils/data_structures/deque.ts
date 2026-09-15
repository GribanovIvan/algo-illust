import { DSArray } from "../types/ds.types";

export default class Deque {
  private _deque: any[];
  private _length: number;

  constructor(array: DSArray = []) {
    this._deque = [...array];
    this._length = array.length;
  }

  get length() {
    return this._length;
  }
  get deque() {
    return this._deque;
  }

  addFront(value: any) {
    this._deque.unshift(value);
    this._length++;
  }
  addRear(value: any) {
    this._deque.push(value);
    this._length++;
  }
  removeFront() {
    if (this._length === 0) {
      return null;
    }
    this._length--;
    return this._deque.shift();
  }
  removeRear() {
    if (this._length === 0) {
      return null;
    }
    this._length--;
    return this._deque.pop();
  }
  peekFront() {
    if (this._length === 0) {
      return null;
    }
    return this._deque[0];
  }
  peekRear() {
    if (this._length === 0) {
      return null;
    }
    return this._deque[this._length - 1];
  }
  clear() {
    this._deque = [];
    this._length = 0;
  }
  isEmpty() {
    return this._length === 0;
  }

  findMin() {
    if (this._length === 0) {
      return null;
    }
    let min = this.peekFront();
    const tempDeque = new Deque([]);
    while (!this.isEmpty()) {
      const value = this.removeRear();
      tempDeque.addFront(value);
      if (value < min) {
        min = value;
      }
    }
    while (!tempDeque.isEmpty()) {
      this.addRear(tempDeque.removeFront());
    }
    return min;
  }

  findMax() {
    if (this._length === 0) {
      return null;
    }
    let max = this.peekFront();
    const tempDeque = new Deque([]);
    while (!this.isEmpty()) {
      const value = this.removeRear();
      tempDeque.addFront(value);
      if (value > max) {
        max = value;
      }
    }
    while (!tempDeque.isEmpty()) {
      this.addRear(tempDeque.removeFront());
    }
    return max;
  }

  findIndex(value: any) {
    if (this._length === 0) {
      return null;
    }
    let index = null;
    const tempDeque = new Deque([]);
    while (!this.isEmpty()) {
      const tempValue = this.removeRear();
      tempDeque.addFront(tempValue);
      if (tempValue === value) {
        index = this._length;
        break;
      }
    }
    while (!tempDeque.isEmpty()) {
      this.addRear(tempDeque.removeFront());
    }
    return index;
  }

  find(index: any) {
    if (this._length === 0) {
      return null;
    }
    let found = null;
    const tempDeque = new Deque([]);
    while (!this.isEmpty()) {
      const tempValue = this.removeRear();
      tempDeque.addFront(tempValue);
      if (this._length === index) {
        found = tempValue;
        break;
      }
    }
    while (!tempDeque.isEmpty()) {
      this.addRear(tempDeque.removeFront());
    }
    return found;
  }

  merge(deque: Deque) {
    if (deque === this) throw new Error("Cannot merge a structure with itself");
    while (!deque.isEmpty()) {
      this.addRear(deque.removeFront());
    }
    return this.deque;
  }
}