import { binarySearch, kmpSearch, bmSearch } from '../utils/searches/searches';

const mockRender = jest.fn().mockResolvedValue(undefined);

beforeEach(() => {
  mockRender.mockClear();
});

// ─── Fixtures ────────────────────────────────────────────────
const fixtures = {
  sortedArr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  withDuplicates: [1, 3, 3, 3, 5, 7, 9],
  text: 'abcabcabcabc',
  pattern: 'abcabc',
  noMatchText: 'hello world',
  noMatchPattern: 'xyz',
};

describe('binarySearch', () => {
  // ─── Normal values ─────────────────────────────────────────
  it('finds an element in a sorted array', async () => {
    const [result, steps] = await binarySearch(fixtures.sortedArr, 7, mockRender);
    expect(result).toContain(3); // index 3
    expect(steps).toBeGreaterThan(0);
  });

  it('finds all duplicate occurrences', async () => {
    const [result] = await binarySearch(fixtures.withDuplicates, 3, mockRender);
    expect(result).toEqual([1, 2, 3]);
  });

  // ─── Boundary values ──────────────────────────────────────
  it('finds element at the start', async () => {
    const [result] = await binarySearch(fixtures.sortedArr, 1, mockRender);
    expect(result).toEqual([0]);
  });

  it('finds element at the end', async () => {
    const [result] = await binarySearch(fixtures.sortedArr, 19, mockRender);
    expect(result).toEqual([9]);
  });

  // ─── Exceptional situations ───────────────────────────────
  it('returns null when element not found', async () => {
    const [result, steps] = await binarySearch(fixtures.sortedArr, 100, mockRender);
    expect(result).toBe(null);
    expect(steps).toBeGreaterThan(0);
  });

  it('works with single-element array', async () => {
    const [result] = await binarySearch([42], 42, mockRender);
    expect(result).toEqual([0]);
  });

  it('returns null for single-element array with wrong value', async () => {
    const [result] = await binarySearch([42], 99, mockRender);
    expect(result).toBe(null);
  });
});

describe('kmpSearch', () => {
  it('finds a pattern in text', async () => {
    const [result, steps] = await kmpSearch('hello world', 'world', mockRender);
    expect(result).toBe(6);
    expect(steps).toBeGreaterThan(0);
  });

  it('finds pattern at the beginning', async () => {
    const [result] = await kmpSearch('abcdef', 'abc', mockRender);
    expect(result).toBe(0);
  });

  it('returns null when pattern not found', async () => {
    const [result] = await kmpSearch(fixtures.noMatchText, fixtures.noMatchPattern, mockRender);
    expect(result).toBe(null);
  });

  it('handles repeating pattern', async () => {
    const [result] = await kmpSearch(fixtures.text, fixtures.pattern, mockRender);
    expect(result).toBe(0);
  });
});

describe('bmSearch', () => {
  it('finds a pattern in text', async () => {
    const [result] = await bmSearch('hello world', 'world', mockRender);
    expect(result).toBe(6);
  });

  it('returns null when pattern not found', async () => {
    const [result] = await bmSearch(fixtures.noMatchText, fixtures.noMatchPattern, mockRender);
    expect(result).toBe(null);
  });

  it('finds pattern at the beginning', async () => {
    const [result] = await bmSearch('abcdef', 'abc', mockRender);
    expect(result).toBe(0);
  });

  it('finds single character', async () => {
    const [result] = await bmSearch('abcdef', 'c', mockRender);
    expect(result).toBe(2);
  });
});
