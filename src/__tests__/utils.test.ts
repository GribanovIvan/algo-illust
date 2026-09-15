import isSorted from '../utils/isSorted';
import { findLastIndex } from '../utils/findLastIndex';
import generateRandomArray from '../utils/randomArrays';
import { SortArray } from '../utils/types/sort.types';

// ─── Fixtures ────────────────────────────────────────────────
const fixtures = {
  sortedAsc: [1, 2, 3, 4, 5],
  sortedDesc: [5, 4, 3, 2, 1],
  unsorted: [3, 1, 4, 1, 5],
  singleElement: [42],
  empty: [] as number[],
  withNegatives: [-3, -1, 0, 2, 5],
  allSame: [7, 7, 7, 7],
};

describe('isSorted', () => {
  // Normal values
  it('returns true for ascending-sorted array in ASC mode', () => {
    expect(isSorted(fixtures.sortedAsc, true)).toBe(true);
  });

  it('returns false for descending-sorted array in ASC mode', () => {
    expect(isSorted(fixtures.sortedDesc, true)).toBe(false);
  });

  it('returns true for descending-sorted array in DESC mode', () => {
    expect(isSorted(fixtures.sortedDesc, false)).toBe(true);
  });

  // Boundary values
  it('returns true for single-element array', () => {
    expect(isSorted(fixtures.singleElement, true)).toBe(true);
  });

  it('returns true for empty array', () => {
    expect(isSorted(fixtures.empty, true)).toBe(true);
  });

  it('returns true for array of identical elements', () => {
    expect(isSorted(fixtures.allSame, true)).toBe(true);
    expect(isSorted(fixtures.allSame, false)).toBe(true);
  });

  // Works with nested arrays (matrix mode)
  it('handles nested arrays (matrix rows)', () => {
    const matrix: SortArray = [[1, 10], [2, 20], [3, 30]];
    expect(isSorted(matrix, true)).toBe(true);
  });
});

describe('findLastIndex', () => {
  it('finds the last negative number', () => {
    const arr = [1, -2, 3, -4, 5];
    expect(findLastIndex(arr, (el) => el < 0)).toBe(3);
  });

  it('returns -1 when no match', () => {
    expect(findLastIndex([1, 2, 3], (el) => el > 10)).toBe(-1);
  });

  it('works on an empty array', () => {
    expect(findLastIndex([], () => true)).toBe(-1);
  });
});

describe('generateRandomArray', () => {
  // Normal values
  it('generates an array of specified length', () => {
    const arr = generateRandomArray(20, 50);
    expect(arr).toHaveLength(20);
    arr.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(50);
    });
  });

  // Boundary values
  it('generates an array of length 1', () => {
    const arr = generateRandomArray(1, 100);
    expect(arr).toHaveLength(1);
  });

  it('generates an empty array for length 0', () => {
    const arr = generateRandomArray(0, 100);
    expect(arr).toHaveLength(0);
  });

  // With negatives
  it('generates negative values when withNegative is true', () => {
    const arr = generateRandomArray(50, 100, true);
    expect(arr).toHaveLength(50);
    const hasNegative = arr.some((n) => n < 0);
    // With 50 elements and range [-100, 100), very likely to have negatives
    expect(hasNegative).toBe(true);
  });

  // Default params
  it('uses default params when none provided', () => {
    const arr = generateRandomArray();
    expect(arr).toHaveLength(10);
    arr.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(10);
    });
  });
});
