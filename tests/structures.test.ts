import LinkedList from '../src/utils/data_structures/linkedList';
import DoublyLinkedList from '../src/utils/data_structures/doublyLinkedList';
import CircularList from '../src/utils/data_structures/circularList';
import Stack from '../src/utils/data_structures/stack';
import Queue from '../src/utils/data_structures/queue';
import Deque from '../src/utils/data_structures/deque';
import { RBTree } from '../src/utils/data_structures/RedBlackTree';
import testDS from '../src/utils/data_structures/test';

const lists = [LinkedList, DoublyLinkedList, CircularList];

describe.each(lists)('%p', List => {
  describe('Normal values', () => {
    test('remove tail then append keeps all nodes reachable', () => {
      const list = new List([1, 2, 3]);
      expect(list.remove(3)).toBe(3);
      list.add(4);
      expect(list.toArray()).toEqual([1, 2, 4]);
      expect(list.tail.value).toBe(4);
      expect(list.length).toBe(3);
      expect(list.findMin()).toBe(1);
      expect(list.findMax()).toBe(4);
      expect(list.findIndex(2)).toBe(1);
      expect(list.find(1)).toBe(2);
    });
    test('remove head and middle', () => {
      const list = new List([1, 2, 3, 4]);
      list.remove(1);
      list.remove(3);
      expect(list.toArray()).toEqual([2, 4]);
      expect(list.contains(2)).toBe(true);
      expect(list.head.value).toBe(2);
    });
  });
  describe('Boundary values', () => {
    test('empty and missing values are safe', () => {
      const list = new List([1]);
      expect(list.remove(1)).toBe(1);
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.findMin()).toBeNull();
      expect(list.findMax()).toBeNull();
      expect(list.contains(9)).toBe(false);
      list.add(2);
      expect(list.remove(9)).toBeNull();
      expect(list.contains(9)).toBe(false);
      expect(list.find(-1)).toBeNull();
      expect(list.find(1)).toBeNull();
      expect(list.findIndex(9)).toBeNull();
      list.clear();
      expect(list.isEmpty()).toBe(true);
    });
  });
  describe('Exceptional cases', () => {
    test('self merge is rejected', () => {
      const list = new List([1]);
      expect(() => list.merge(list as never)).toThrow('itself');
      expect(list.toArray()).toEqual([1]);
    });
  });
});

test('doubly merged lists do not share nodes', () => {
  const first = new DoublyLinkedList([1]), second = new DoublyLinkedList([2]);
  expect(first.merge(second)).toEqual([1, 2]);
  second.add(3);
  expect(first.toArray()).toEqual([1, 2]);
  first.add(4);
  expect(second.toArray()).toEqual([2, 3]);
  expect(first.tail.previous.value).toBe(2);
});

describe.each([Stack, Queue, Deque])('%p operations', Structure => {
  test('stats preserve sequence and find boundary values', () => {
    const structure = new Structure([3, 1, 2]);
    expect(structure.findMin()).toBe(1);
    expect(structure.findMax()).toBe(3);
    expect(structure.findIndex(2)).toBe(2);
    expect(structure.find(0)).toBe(3);
    expect(structure.findIndex(9)).toBeNull();
    expect(structure.find(-1)).toBeNull();
    expect(structure.length).toBe(3);
    expect(() => structure.merge(structure as never)).toThrow('itself');
    structure.clear();
    expect(structure.isEmpty()).toBe(true);
    expect(structure.findMin()).toBeNull();
    expect(structure.findMax()).toBeNull();
  });
});

test('FIFO, LIFO and both deque ends', () => {
  const stack = new Stack(), queue = new Queue(), deque = new Deque();
  expect(stack.pop()).toBeNull();
  expect(queue.dequeue()).toBeNull();
  expect(deque.removeFront()).toBeNull();
  expect(deque.removeRear()).toBeNull();
  stack.push(1); stack.push(2);
  queue.enqueue(1); queue.enqueue(2);
  deque.addFront(1); deque.addRear(2);
  expect(stack.pop()).toBe(2);
  expect(queue.dequeue()).toBe(1);
  expect(deque.peekRear()).toBe(2);
  expect(deque.removeRear()).toBe(2);
  expect(deque.removeFront()).toBe(1);
});

test('stats report the element after a maximum at index zero', () => {
  jest.spyOn(Math, 'random').mockReturnValue(.5);
  expect(testDS([9, 2, 1], 2, LinkedList).elAfterMax).toBe(2);
});

test('red-black tree traversal and remove preserve ordering and colors', () => {
  const tree = new RBTree();
  const values = [10, 4, 15, 2, 7, 12, 20, 1, 3, 6, 8, 11, 13, 18, 22];
  values.forEach(value => tree.insert(value));
  expect(tree.insert(10)).toBe(false);
  const validate = (node: typeof tree.root): number => {
    if (!node) return 1;
    if (node.red) { expect(node.left?.red || false).toBe(false); expect(node.right?.red || false).toBe(false); }
    const left = validate(node.left), right = validate(node.right);
    expect(left).toBe(right);
    return left + (node.red ? 0 : 1);
  };
  const remaining = [...values];
  for (const value of values) {
    expect(tree.getInOrder(tree.root, []).map(node => node.value)).toEqual([...remaining].sort((a, b) => a - b));
    expect(tree.root?.red).toBe(false);
    validate(tree.root);
    expect(tree.remove(value)).toBe(true);
    remaining.splice(remaining.indexOf(value), 1);
    expect(tree.size).toBe(remaining.length);
  }
  expect(tree.isEmpty()).toBe(true);
  expect(tree.delete(100)).toBe(false);
});
