import { DSArray } from "../types/ds.types";

export default class LinkedList {
  private _head: any;
  private _tail: any;
  private _length: number;

  constructor(array: DSArray = []) {
    this._head = null;
    this._tail = null;
    this._length = 0;
    array.forEach((value) => this.add(value));
  }

  get length() {
    return this._length;
  }
  get head() {
    return this._head;
  }
  get tail() {
    return this._tail;
  }

  add(value: any) {
    const node = {
      value,
      next: null,
    };
    if (this._length === 0) {
      this._head = node;
      this._tail = node;
    } else {
      this._tail.next = node;
      this._tail = node;
    }
    this._length++;
  }
  remove(value: any) {
    if (this._length === 0) {
      return null;
    }
    let currentNode = this._head;
    let previousNode = null;
    while (currentNode) {
      if (currentNode.value === value) {
        if (previousNode === null) {
          this._head = currentNode.next;
        } else {
          previousNode.next = currentNode.next;
        }
        if (currentNode === this._tail) this._tail = previousNode;
        this._length--;
        return currentNode.value;
      }
      previousNode = currentNode;
      currentNode = currentNode.next;
    }
    return null;
  }
  contains(value: any) {
    let currentNode = this._head;
    while (currentNode) {
      if (currentNode.value === value) {
        return true;
      }
      currentNode = currentNode.next;
    }
    return false;
  }
  clear() {
    this._head = null;
    this._tail = null;
    this._length = 0;
  }
  isEmpty() {
    return this._length === 0;
  }
  toArray() {
    const array: any[] = [];
    let currentNode = this._head;
    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }
    return array;
  }
  toString() {
    return this.toArray().toString();
  }

  findMin() {
    if (this._length === 0) {
      return null;
    }
    let min = this._head.value;
    let currentNode = this._head.next;
    while (currentNode) {
      if (currentNode.value < min) {
        min = currentNode.value;
      }
      currentNode = currentNode.next;
    }
    return min;
  }

  findMax() {
    if (this._length === 0) {
      return null;
    }
    let max = this._head.value;
    let currentNode = this._head.next;
    while (currentNode) {
      if (currentNode.value > max) {
        max = currentNode.value;
      }
      currentNode = currentNode.next;
    }
    return max;
  }

  findIndex(value: any) {
    let index = 0;
    let currentNode = this._head;
    while (currentNode) {
      if (currentNode.value === value) {
        return index;
      }
      currentNode = currentNode.next;
      index++;
    }
    return null;
  }

  find(index: number) {
    if (index < 0 || index >= this._length) {
      return null;
    }
    let currentNode = this._head;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode.next;
    }
    return currentNode.value;
  }

  merge(list: LinkedList) {
    if (list === this) throw new Error("Cannot merge a list with itself");
    let currentNode = list._head;
    while (currentNode) {
      this.add(currentNode.value);
      currentNode = currentNode.next;
    }
    return this.toArray();
  }

}
