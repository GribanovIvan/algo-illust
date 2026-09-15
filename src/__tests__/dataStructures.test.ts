import Stack from '../utils/data_structures/stack';
import Queue from '../utils/data_structures/queue';
import LinkedList from '../utils/data_structures/linkedList';
import Deque from '../utils/data_structures/deque';

// ─── Fixtures ────────────────────────────────────────────────
const fixtures = {
  normal: [10, 20, 30, 40, 50],
  withDuplicates: [5, 3, 5, 1, 3],
  single: [42],
  empty: [] as number[],
};

// ═══════════════════════════════════════════════════════════════
// Stack
// ═══════════════════════════════════════════════════════════════
describe('Stack', () => {
  // ─── Normal values ─────────────────────────────────────────
  it('pushes and pops elements in LIFO order', () => {
    const stack = new Stack([]);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
  });

  it('constructs from array and reports correct length', () => {
    const stack = new Stack(fixtures.normal);
    expect(stack.length).toBe(5);
    expect(stack.peek()).toBe(50);
  });

  it('finds min and max', () => {
    const stack = new Stack(fixtures.normal);
    expect(stack.findMin()).toBe(10);
    expect(stack.findMax()).toBe(50);
    // stack should be unchanged
    expect(stack.length).toBe(5);
  });

  it('findIndex locates an element', () => {
    const stack = new Stack([10, 20, 30]);
    expect(stack.findIndex(20)).toBe(1);
    expect(stack.findIndex(99)).toBe(null);
  });

  it('find retrieves element by position', () => {
    const stack = new Stack([10, 20, 30]);
    expect(stack.find(0)).toBe(10);
    expect(stack.find(2)).toBe(30);
  });

  it('merge combines two stacks', () => {
    const s1 = new Stack([1, 2]);
    const s2 = new Stack([3, 4]);
    const merged = s1.merge(s2);
    expect(merged).toEqual(expect.arrayContaining([1, 2, 3, 4]));
    expect(s1.length).toBe(4);
  });

  // ─── Boundary values ──────────────────────────────────────
  it('peek on empty stack returns null', () => {
    const stack = new Stack([]);
    expect(stack.peek()).toBe(null);
  });

  it('pop on empty stack returns null', () => {
    const stack = new Stack([]);
    expect(stack.pop()).toBe(null);
  });

  it('findMin/findMax on empty stack returns null', () => {
    const stack = new Stack([]);
    expect(stack.findMin()).toBe(null);
    expect(stack.findMax()).toBe(null);
  });

  it('findIndex on empty stack returns null', () => {
    const stack = new Stack([]);
    expect(stack.findIndex(1)).toBe(null);
  });

  it('find with out-of-range index returns null', () => {
    const stack = new Stack([1, 2, 3]);
    expect(stack.find(-1)).toBe(null);
    expect(stack.find(10)).toBe(null);
  });

  // ─── Exceptional situations ───────────────────────────────
  it('clear empties the stack', () => {
    const stack = new Stack([1, 2, 3]);
    stack.clear();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// Queue
// ═══════════════════════════════════════════════════════════════
describe('Queue', () => {
  it('enqueues and dequeues in FIFO order', () => {
    const q = new Queue([]);
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);
    expect(q.dequeue()).toBe(1);
    expect(q.dequeue()).toBe(2);
  });

  it('constructs from array', () => {
    const q = new Queue(fixtures.normal);
    expect(q.length).toBe(5);
    expect(q.peek()).toBe(10);
  });

  it('finds min and max', () => {
    const q = new Queue([30, 10, 50, 20, 40]);
    expect(q.findMin()).toBe(10);
    expect(q.findMax()).toBe(50);
  });

  it('findIndex and find work correctly', () => {
    const q = new Queue([10, 20, 30]);
    expect(q.findIndex(20)).toBe(1);
    expect(q.findIndex(99)).toBe(null);
    expect(q.find(2)).toBe(30);
  });

  it('dequeue on empty queue returns null', () => {
    const q = new Queue([]);
    expect(q.dequeue()).toBe(null);
    expect(q.peek()).toBe(null);
  });

  it('findMin/findMax on empty returns null', () => {
    const q = new Queue([]);
    expect(q.findMin()).toBe(null);
    expect(q.findMax()).toBe(null);
  });

  it('find on empty returns null', () => {
    const q = new Queue([]);
    expect(q.find(0)).toBe(null);
  });

  it('merge combines two queues', () => {
    const q1 = new Queue([1, 2]);
    const q2 = new Queue([3, 4]);
    const result = q1.merge(q2);
    expect(result).toEqual([3, 4, 1, 2]);
  });

  it('clear empties the queue', () => {
    const q = new Queue([1, 2, 3]);
    q.clear();
    expect(q.isEmpty()).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// LinkedList
// ═══════════════════════════════════════════════════════════════
describe('LinkedList', () => {
  it('adds elements and converts to array', () => {
    const list = new LinkedList([]);
    list.add(1);
    list.add(2);
    list.add(3);
    expect(list.toArray()).toEqual([1, 2, 3]);
    expect(list.length).toBe(3);
  });

  it('constructs from array', () => {
    const list = new LinkedList([10, 20, 30]);
    expect(list.toArray()).toEqual([10, 20, 30]);
    expect(list.head.value).toBe(10);
    expect(list.tail.value).toBe(30);
  });

  it('removes elements', () => {
    const list = new LinkedList([1, 2, 3]);
    expect(list.remove(2)).toBe(2);
    expect(list.toArray()).toEqual([1, 3]);
    expect(list.remove(1)).toBe(1); // remove head
    expect(list.toArray()).toEqual([3]);
  });

  it('remove returns null for non-existent', () => {
    const list = new LinkedList([1, 2]);
    expect(list.remove(99)).toBe(null);
  });

  it('remove from empty list returns null', () => {
    const list = new LinkedList([]);
    expect(list.remove(1)).toBe(null);
  });

  it('contains checks membership', () => {
    const list = new LinkedList([1, 2, 3]);
    expect(list.contains(2)).toBe(true);
    expect(list.contains(5)).toBe(false);
  });

  it('findMin and findMax work', () => {
    const list = new LinkedList([30, 10, 50, 20]);
    expect(list.findMin()).toBe(10);
    expect(list.findMax()).toBe(50);
  });

  it('findMin/findMax on empty returns null', () => {
    const list = new LinkedList([]);
    expect(list.findMin()).toBe(null);
    expect(list.findMax()).toBe(null);
  });

  it('findIndex and find work', () => {
    const list = new LinkedList([10, 20, 30]);
    expect(list.findIndex(20)).toBe(1);
    expect(list.findIndex(99)).toBe(null);
    expect(list.find(0)).toBe(10);
    expect(list.find(2)).toBe(30);
    expect(list.find(-1)).toBe(null);
    expect(list.find(99)).toBe(null);
  });

  it('merge combines two lists', () => {
    const l1 = new LinkedList([1, 2]);
    const l2 = new LinkedList([3, 4]);
    const result = l1.merge(l2);
    expect(result).toEqual([1, 2, 3, 4]);
    expect(l1.length).toBe(4);
  });

  it('toString produces comma-separated string', () => {
    const list = new LinkedList([1, 2, 3]);
    expect(list.toString()).toBe('1,2,3');
  });

  it('clear and isEmpty work', () => {
    const list = new LinkedList([1, 2, 3]);
    list.clear();
    expect(list.isEmpty()).toBe(true);
    expect(list.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// Deque
// ═══════════════════════════════════════════════════════════════
describe('Deque', () => {
  it('addFront and addRear add elements', () => {
    const d = new Deque([2, 3]);
    d.addFront(1);
    d.addRear(4);
    expect(d.deque).toEqual([1, 2, 3, 4]);
    expect(d.length).toBe(4);
  });

  it('removeFront and removeRear remove from ends', () => {
    const d = new Deque([1, 2, 3]);
    expect(d.removeFront()).toBe(1);
    expect(d.removeRear()).toBe(3);
    expect(d.length).toBe(1);
  });

  it('removeFront/removeRear on empty returns null', () => {
    const d = new Deque([]);
    expect(d.removeFront()).toBe(null);
    expect(d.removeRear()).toBe(null);
  });

  it('peekFront and peekRear work', () => {
    const d = new Deque([10, 20, 30]);
    expect(d.peekFront()).toBe(10);
    expect(d.peekRear()).toBe(30);
  });

  it('peekFront/peekRear on empty returns null', () => {
    const d = new Deque([]);
    expect(d.peekFront()).toBe(null);
    expect(d.peekRear()).toBe(null);
  });

  it('findMin and findMax work', () => {
    const d = new Deque([30, 10, 50, 20]);
    expect(d.findMin()).toBe(10);
    expect(d.findMax()).toBe(50);
  });

  it('findMin/findMax on empty returns null', () => {
    const d = new Deque([]);
    expect(d.findMin()).toBe(null);
    expect(d.findMax()).toBe(null);
  });

  it('findIndex and find work', () => {
    const d = new Deque([10, 20, 30]);
    expect(d.findIndex(20)).toBe(1);
    expect(d.findIndex(99)).toBe(null);
    expect(d.find(0)).toBe(10);
    expect(d.find(2)).toBe(30);
  });

  it('merge combines two deques', () => {
    const d1 = new Deque([1, 2]);
    const d2 = new Deque([3, 4]);
    const result = d1.merge(d2);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('clear and isEmpty work', () => {
    const d = new Deque([1, 2, 3]);
    d.clear();
    expect(d.isEmpty()).toBe(true);
  });
});

