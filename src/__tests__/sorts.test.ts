import {
  bubbleSort,
  selectionSort,
  shellSort,
  quickSort,
  mergeSort,
  countingSort,
  heapSort,
} from '../utils/sorts/sorts';
import { SortArray } from '../utils/types/sort.types';

// ─── Fixtures ────────────────────────────────────────────────
const fixtures = {
  normal: {
    unsorted: [38, 27, 43, 3, 9, 82, 10],
    expectedAsc: [3, 9, 10, 27, 38, 43, 82],
    expectedDesc: [82, 43, 38, 27, 10, 9, 3],
  },
  withDuplicates: {
    unsorted: [5, 3, 5, 1, 3, 2, 1],
    expectedAsc: [1, 1, 2, 3, 3, 5, 5],
    expectedDesc: [5, 5, 3, 3, 2, 1, 1],
  },
  boundary: {
    twoElements: [2, 1],
    twoElementsAsc: [1, 2],
    twoElementsDesc: [2, 1],
    singleValue: [7, 7, 7],
    alreadySorted: [1, 2, 3, 4, 5],
    reverseSorted: [5, 4, 3, 2, 1],
  },
  large: {
    size100: Array.from({ length: 100 }, (_, i) => 100 - i),
  },
};

// ─── Helpers ─────────────────────────────────────────────────
const isSortedAsc = (arr: SortArray): boolean => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
};

const isSortedDesc = (arr: SortArray): boolean => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < arr[i + 1]) return false;
  }
  return true;
};

// All sort functions that work with plain number arrays
const allSorts = [
  { name: 'bubbleSort', fn: bubbleSort },
  { name: 'selectionSort', fn: selectionSort },
  { name: 'shellSort', fn: shellSort },
  { name: 'quickSort', fn: quickSort },
  { name: 'mergeSort', fn: mergeSort },
  { name: 'countingSort', fn: countingSort },
  { name: 'heapSort', fn: heapSort },
];

// countingSort only works with non-negative integers
const sortsExceptCounting = allSorts.filter(s => s.name !== 'countingSort');

describe('Sorting algorithms', () => {
  // ─── Group 1: Normal values ───────────────────────────────
  describe('Normal values', () => {
    describe.each(allSorts)('$name', ({ fn }) => {
      it('sorts an unsorted array in ascending order', async () => {
        const arr = [...fixtures.normal.unsorted];
        const steps = await fn(arr, true);
        expect(arr).toEqual(fixtures.normal.expectedAsc);
        expect(steps).toBeGreaterThan(0);
      });

      it('sorts an unsorted array in descending order', async () => {
        const arr = [...fixtures.normal.unsorted];
        await fn(arr, false);
        expect(arr).toEqual(fixtures.normal.expectedDesc);
      });

      it('handles duplicates correctly', async () => {
        const arr = [...fixtures.withDuplicates.unsorted];
        await fn(arr, true);
        expect(arr).toEqual(fixtures.withDuplicates.expectedAsc);
      });
    });
  });

  // ─── Group 2: Boundary values ─────────────────────────────
  describe('Boundary values', () => {
    describe.each(allSorts)('$name', ({ fn }) => {
      it('sorts a two-element array', async () => {
        const arr = [...fixtures.boundary.twoElements];
        await fn(arr, true);
        expect(arr).toEqual(fixtures.boundary.twoElementsAsc);
      });

      it('handles already-sorted array', async () => {
        const arr = [...fixtures.boundary.alreadySorted];
        await fn(arr, true);
        expect(isSortedAsc(arr)).toBe(true);
      });

      it('handles array with all identical values', async () => {
        const arr = [...fixtures.boundary.singleValue];
        await fn(arr, true);
        expect(arr).toEqual([7, 7, 7]);
      });
    });

    describe.each(sortsExceptCounting)('$name with reverse-sorted input', ({ fn }) => {
      it('sorts reverse-sorted array ascending', async () => {
        const arr = [...fixtures.boundary.reverseSorted];
        await fn(arr, true);
        expect(isSortedAsc(arr)).toBe(true);
      });
    });
  });

  // ─── Group 3: Exceptional situations ──────────────────────
  describe('Exceptional situations', () => {
    it('countingSort throws on string input', async () => {
      const arr: SortArray = ['a', 'b', 'c'];
      await expect(countingSort(arr, true)).rejects.toThrow(
        'Counting sort can only be used with numbers'
      );
    });

    describe.each(sortsExceptCounting)('$name with 100-element array', ({ fn }) => {
      it('sorts a 100-element array correctly', async () => {
        const arr = [...fixtures.large.size100];
        await fn(arr, true);
        expect(isSortedAsc(arr)).toBe(true);
        expect(arr).toHaveLength(100);
      });
    });

    it('heapSort returns step count for large input', async () => {
      const arr = [...fixtures.large.size100];
      const steps = await heapSort(arr, true);
      expect(steps).toBeGreaterThan(0);
      expect(isSortedAsc(arr)).toBe(true);
    });

    it('sorts with render callback without error', async () => {
      const mockRender = jest.fn().mockResolvedValue(undefined);
      const arr = [3, 1, 2];
      await bubbleSort(arr, true, mockRender);
      expect(arr).toEqual([1, 2, 3]);
      expect(mockRender).toHaveBeenCalled();
    });
  });
});
