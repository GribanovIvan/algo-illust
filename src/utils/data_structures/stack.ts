import { DSArray } from "../types/ds.types";

export default class Stack {
  private _stack: any[];
  private _length: number;

  constructor(array: DSArray = []) {   
    this._stack = [...array];
    this._length = this._stack.length;
  }

  get length() {
    return this._length;
  }
  get stack() {
    return this._stack;
  }

  push(value: any) {
    this._stack.push(value);
    this._length++;
  }
  pop() {
    if (this._length === 0) {
      return null;
    }
    this._length--;
    return this._stack.pop();
  }
  peek() {
    if (this._length === 0) {
      return null;
    }
    return this._stack[this._length - 1];
  }
  clear() {
    this._stack = [];
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
    const tempStack = new Stack([]);
    while (!this.isEmpty()) {
      const value = this.pop();
      tempStack.push(value);

      if (value < min) {
        min = value;
      }
    }
    while (!tempStack.isEmpty()) {
      this.push(tempStack.pop());
    }
    return min;
  }

  findMax() {
    if (this._length === 0) {
      return null;
    }
    let max = this.peek();
    const tempStack = new Stack([]);
    while (!this.isEmpty()) {
      const value = this.pop();
      tempStack.push(value);

      if (value > max) {
        max = value;
      }
    }
    while (!tempStack.isEmpty()) {
      this.push(tempStack.pop());
    }
    return max;
  }

  findIndex(value: any) {
    if (this._length === 0) {
      return null;
    }
    const tempStack = new Stack([]);
    let index = null;
    while (!this.isEmpty()) {
      const currentValue = this.pop();
      tempStack.push(currentValue);

      if (currentValue === value) {
        index = this._length;
        break;
      }

    }
    while (!tempStack.isEmpty()) {
      this.push(tempStack.pop());
    }
    return index;
  }

  find(index: number) {
    if (this._length === 0 || index > this._length || index < 0) {
      return null;
    }
    let foundValue = null;
    const tempStack = new Stack([]);
    while (!this.isEmpty()) {
      const value = this.pop();
      tempStack.push(value);

      if (this._length === index) {
        foundValue = value;
      }
    }
    while (!tempStack.isEmpty()) {
      this.push(tempStack.pop());
    }
    return foundValue;
  }

  merge(stack: Stack) {
    if (stack === this) throw new Error("Cannot merge a structure with itself");
    while (!stack.isEmpty()) {
      this.push(stack.pop());
    }
    return this.stack;
  }
} 
