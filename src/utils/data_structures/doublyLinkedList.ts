import { DSArray } from "../types/ds.types";

export default class DoublyLinkedList {
  private _head: any;
  private _tail: any;
  public _length: number;

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

  toArray() {
    const array = [];
    let currentNode = this._head;
    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }
    return array;
  }

  add(value: any) {
    const node = {
      value,
      next: null,
      previous: null,
    };
    if (this._length === 0) {
      this._head = node;
      this._tail = node;
    } else {
      this._tail.next = node;
      node.previous = this._tail;
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
          if (this._head) {
            this._head.previous = null;
          }
        } else {
          previousNode.next = currentNode.next;
          if (currentNode.next) {
            currentNode.next.previous = previousNode;
          }
        }
        // without this the tail keeps pointing at the detached node and the next add() is lost
        if (currentNode === this._tail) {
          this._tail = previousNode;
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

  findMin() {
    if (this._length === 0) {
      return null;
    }
    let min = this._head.value;
    let currentNode = this._head;
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
    let currentNode = this._head;
    while (currentNode) {
      if (currentNode.value > max) {
        max = currentNode.value;
      }
      currentNode = currentNode.next;
    }
    return max;
  }

  findIndex(value: any) {
    if (this._length === 0) {
      return null;
    }
    let index = 0;
    let currentNode = this._head;
    while (currentNode) {
      if (currentNode.value === value) {
        return index;
      }
      index++;
      currentNode = currentNode.next;
    }
    return null;
  }

  find(index: number) {
    if (this._length === 0) {
      return null;
    }
    let currentIndex = 0;
    let currentNode = this._head;
    while (currentNode) {
      if (currentIndex === index) {
        return currentNode.value;
      }
      currentIndex++;
      currentNode = currentNode.next;
    }
    return null;
  }

  merge(list: DoublyLinkedList) {
    if (list.length === 0) {
      return this;
    }
    if (this._length === 0) {
      this._head = list.head;
      this._tail = list.tail;
      this._length = list.length;
      return this;
    }
    this._tail.next = list.head;
    list.head.previous = this._tail;
    this._tail = list.tail;
    this._length += list.length;
    return this.toArray();
  }

}
