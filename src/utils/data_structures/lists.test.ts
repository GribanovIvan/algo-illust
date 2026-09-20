import CircularList from "./circularList";
import DoublyLinkedList from "./doublyLinkedList";
import LinkedList from "./linkedList";

describe("LinkedList", () => {
  test("keeps the tail after removing the last element", () => {
    const list = new LinkedList([1, 2, 3]);
    expect(list.remove(3)).toBe(3);
    list.add(4);

    expect(list.toArray()).toEqual([1, 2, 4]);
    expect(list.length).toBe(3);
    expect(list.tail.value).toBe(4);
  });

  test("empties itself when the only element is removed", () => {
    const list = new LinkedList([1]);
    list.remove(1);

    expect(list.isEmpty()).toBe(true);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();

    list.add(2);
    expect(list.toArray()).toEqual([2]);
  });

  test("keeps the tail after removing the head", () => {
    const list = new LinkedList([1, 2]);
    list.remove(1);
    list.add(3);

    expect(list.toArray()).toEqual([2, 3]);
    expect(list.tail.value).toBe(3);
  });

  test("returns null for a missing value", () => {
    const list = new LinkedList([1, 2]);
    expect(list.remove(5)).toBeNull();
    expect(list.contains(5)).toBe(false);
    expect(list.findIndex(5)).toBeNull();
    expect(list.toArray()).toEqual([1, 2]);
  });
});

describe("DoublyLinkedList", () => {
  test("keeps the tail after removing the last element", () => {
    const list = new DoublyLinkedList([1, 2, 3]);
    expect(list.remove(3)).toBe(3);
    list.add(4);

    expect(list.toArray()).toEqual([1, 2, 4]);
    expect(list.length).toBe(3);
    expect(list.tail.value).toBe(4);
    expect(list.tail.previous.value).toBe(2);
  });

  test("empties itself when the only element is removed", () => {
    const list = new DoublyLinkedList([1]);
    list.remove(1);

    expect(list.isEmpty()).toBe(true);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();

    list.add(2);
    expect(list.toArray()).toEqual([2]);
    expect(list.tail.value).toBe(2);
  });

  test("keeps the backward links after removing the head", () => {
    const list = new DoublyLinkedList([1, 2, 3]);
    list.remove(1);

    expect(list.head.value).toBe(2);
    expect(list.head.previous).toBeNull();
    expect(list.tail.value).toBe(3);
  });

  test("returns null for a missing value", () => {
    const list = new DoublyLinkedList([1, 2]);
    expect(list.remove(5)).toBeNull();
    expect(list.contains(5)).toBe(false);
    expect(list.findIndex(5)).toBeNull();
    expect(list.toArray()).toEqual([1, 2]);
  });
});

describe("CircularList", () => {
  test("stops the search on a full circle", () => {
    const list = new CircularList([1, 2, 3]);

    expect(list.contains(2)).toBe(true);
    expect(list.contains(5)).toBe(false);
    expect(list.findIndex(5)).toBe(-1);
    expect(list.remove(5)).toBeNull();
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  test("keeps the loop and the tail after removing the last element", () => {
    const list = new CircularList([1, 2, 3]);
    expect(list.remove(3)).toBe(3);
    list.add(4);

    expect(list.toArray()).toEqual([1, 2, 4]);
    expect(list.length).toBe(3);
    expect(list.tail.value).toBe(4);
    expect(list.tail.next).toBe(list.head);
  });

  test("keeps the loop after removing the head", () => {
    const list = new CircularList([1, 2, 3]);
    list.remove(1);

    expect(list.toArray()).toEqual([2, 3]);
    expect(list.head.value).toBe(2);
    expect(list.tail.next).toBe(list.head);
  });

  test("empties itself when the only element is removed", () => {
    const list = new CircularList([1]);
    expect(list.remove(1)).toBe(1);

    expect(list.length).toBe(0);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
    expect(list.toArray()).toEqual([]);

    list.add(2);
    expect(list.toArray()).toEqual([2]);
    expect(list.tail.next).toBe(list.head);
  });

  test("merges another list without looping", () => {
    const list = new CircularList([1, 2]);
    expect(list.merge(new CircularList([3, 4]))).toEqual([1, 2, 3, 4]);
    expect(list.findMin()).toBe(1);
    expect(list.findMax()).toBe(4);
    expect(list.find(2)).toBe(3);
  });
});
