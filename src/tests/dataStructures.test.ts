import Stack from "../utils/data_structures/stack";
import Queue from "../utils/data_structures/queue";
import Deque from "../utils/data_structures/deque";
import LinkedList from "../utils/data_structures/linkedList";
import DoublyLinkedList from "../utils/data_structures/doublyLinkedList";
import CircularList from "../utils/data_structures/circularList";
import testDS from "../utils/data_structures/test";
import { RBTree } from "../utils/data_structures/RedBlackTree";

describe("Data Structures Unit Tests", () => {
  describe("Група 1: Нормальні значення (Normal values)", () => {
    test("1.1 Stack pushes, pops, peeks and finds min/max", () => {
      const stack = new Stack([10, 20, 5, 40]);
      expect(stack.length).toBe(4);
      expect(stack.peek()).toBe(40);
      expect(stack.findMin()).toBe(5);
      expect(stack.findMax()).toBe(40);
      expect(stack.pop()).toBe(40);
      expect(stack.length).toBe(3);
    });

    test("1.2 Queue enqueues, dequeues, peeks, and finds elements", () => {
      const queue = new Queue([10, 20, 30]);
      expect(queue.length).toBe(3);
      expect(queue.peek()).toBe(10);
      expect(queue.dequeue()).toBe(10);
      expect(queue.length).toBe(2);
      expect(queue.findMin()).toBe(20);
    });

    test("1.3 Deque operations front and rear", () => {
      const deque = new Deque([2, 3]);
      deque.addFront(1);
      deque.addRear(4);
      expect(deque.peekFront()).toBe(1);
      expect(deque.peekRear()).toBe(4);
      expect(deque.removeFront()).toBe(1);
      expect(deque.removeRear()).toBe(4);
    });

    test("1.4 LinkedList and DoublyLinkedList add and toArray", () => {
      const list = new LinkedList([1, 2, 3]);
      expect(list.length).toBe(3);
      expect(list.contains(2)).toBe(true);

      const dList = new DoublyLinkedList([10, 20, 30]);
      expect(dList.length).toBe(3);
      expect(dList.contains(20)).toBe(true);
      expect(dList.toArray()).toEqual([10, 20, 30]);
    });

    test("1.5 testDS calculates statistics for stack correctly", () => {
      const stats = testDS([5, 15, 25, 35, 45], 25, Stack as any);
      expect(stats.length).toBe(5);
      expect(stats.min).toBe(5);
      expect(stats.max).toBe(45);
      expect(stats.foundIndex).not.toBeNull();
    });
  });

  describe("Група 2: Граничні значення (Boundary values)", () => {
    test("2.1 LinkedList updates tail pointer properly when tail node is removed", () => {
      const list = new LinkedList([10, 20]);
      expect(list.tail.value).toBe(20);
      list.remove(20); // remove tail
      expect(list.tail.value).toBe(10);
      expect(list.length).toBe(1);

      // adding new element should link directly to updated tail
      list.add(30);
      expect(list.tail.value).toBe(30);
      expect(list.head.next.value).toBe(30);
      expect(list.toArray()).toEqual([10, 30]);
    });

    test("2.2 DoublyLinkedList updates tail pointer properly when tail node is removed", () => {
      const dList = new DoublyLinkedList([100, 200]);
      expect(dList.tail.value).toBe(200);
      dList.remove(200); // remove tail
      expect(dList.tail.value).toBe(100);
      expect(dList.length).toBe(1);

      dList.add(300);
      expect(dList.tail.value).toBe(300);
      expect(dList.head.next.value).toBe(300);
      expect(dList.toArray()).toEqual([100, 300]);
    });

    test("2.3 CircularList handles single element add and remove", () => {
      const cList = new CircularList([42]);
      expect(cList.length).toBe(1);
      expect(cList.contains(42)).toBe(true);
      cList.remove(42);
      expect(cList.length).toBe(0);
      expect(cList.head).toBeNull();
    });

    test("2.4 RedBlackTree inserts root node and maintains black root", () => {
      const rbt = new RBTree();
      rbt.insert(50);
      expect(rbt.root?.element).toBe(50);
      expect(rbt.root?.isBlack()).toBe(true);
      rbt.insert(25);
      rbt.insert(75);
      expect(rbt.size).toBe(3);
    });
  });

  describe("Група 3: Виняткові ситуації (Exceptional situations)", () => {
    test("3.1 CircularList does NOT hang in an infinite loop when element is missing", () => {
      const cList = new CircularList([1, 2, 3]);
      // Should terminate immediately and return false / null
      expect(cList.contains(999)).toBe(false);
      expect(cList.remove(999)).toBeNull();
      expect(cList.length).toBe(3);
    });

    test("3.2 empty Stack, Queue, Deque return null on remove/peek without errors", () => {
      const emptyStack = new Stack([]);
      expect(emptyStack.pop()).toBeNull();
      expect(emptyStack.peek()).toBeNull();
      expect(emptyStack.findMin()).toBeNull();

      const emptyQueue = new Queue([]);
      expect(emptyQueue.dequeue()).toBeNull();
      expect(emptyQueue.peek()).toBeNull();

      const emptyDeque = new Deque([]);
      expect(emptyDeque.removeFront()).toBeNull();
      expect(emptyDeque.removeRear()).toBeNull();
    });

    test("3.3 RedBlackTree handles duplicate insertions and shallow paths safely", () => {
      const rbt = new RBTree();
      expect(rbt.insert(10)).toBe(true);
      expect(rbt.insert(10)).toBe(false); // duplicate rejected gracefully
      expect(rbt.insert(5)).toBe(true);
      expect(rbt.search(10)).toBe(true);
      expect(rbt.search(999)).toBe(false);
    });
  });
});
