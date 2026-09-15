import { DSArray } from "../types/ds.types";

export default class CircularList {
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
      this._tail.next = this._head;
    } else {
      this._tail.next = node;
      this._tail = node;
      this._tail.next = this._head;
    }
    this._length++;
  }

  remove(value: any) {
    if (this._length === 0 || !this._head) {
      return null;
    }
    let currentNode = this._head;
    let previousNode = null;
    for (let count = 0; count < this._length; count++) {
      if (currentNode.value === value) {
        if (this._length === 1) {
          this._head = null;
          this._tail = null;
        } else if (currentNode === this._head) {
          this._head = currentNode.next;
          this._tail.next = this._head;
        } else {
          previousNode.next = currentNode.next;
          if (currentNode === this._tail) {
            this._tail = previousNode;
            this._tail.next = this._head;
          }
        }
        this._length--;
        return currentNode.value;
      }
      previousNode = currentNode;
      currentNode = currentNode.next;
    }
    return null;
  }

  contains(value: any) {
    if (!this._head || this._length === 0) return false;
    let currentNode = this._head;
    for (let count = 0; count < this._length; count++) {
      if (currentNode.value === value) {
        return true;
      }
      currentNode = currentNode.next;
    }
    return false;
  }

  toArray() {
    const array = [];
    let currentNode = this._head;
    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
      if (currentNode === this._head) {
        break;
      }
    }
    return array;
  }

  findMin() {
    let currentNode = this._head;
    let min = currentNode.value;
    while (currentNode) {
      if (currentNode.value < min) {
        min = currentNode.value;
      }
      currentNode = currentNode.next;
      if (currentNode === this._head) {
        break;
      }
    }
    return min;
  }

  findMax() {
    let currentNode = this._head;
    let max = currentNode.value;
    while (currentNode) {
      if (currentNode.value > max) {
        max = currentNode.value;
      }
      currentNode = currentNode.next;
      if (currentNode === this._head) {
        break;
      }
    }
    return max;
  }

  findIndex(value: any) {
    let currentNode = this._head;
    let index = 0;
    while (currentNode) {
      if (currentNode.value === value) {
        return index;
      }
      currentNode = currentNode.next;
      index++;
      if (currentNode === this._head) {
        break;
      }
    }
    return -1;
  }

  find(index: number) {
    let currentNode = this._head;
    let currentIndex = 0;
    while (currentNode) {
      if (currentIndex === index) {
        return currentNode.value;
      }
      currentNode = currentNode.next;
      currentIndex++;
      if (currentNode === this._head) {
        break;
      }
    }
    return null;
  }

  merge(list: CircularList) {
    let currentNode = list.head;
    while (currentNode) {
      this.add(currentNode.value);
      currentNode = currentNode.next;
      if (currentNode === list.head) {
        break;
      }
    }
    return this.toArray();
  }

}