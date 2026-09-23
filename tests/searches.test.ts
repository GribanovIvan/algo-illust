import { generateArray8 } from '../src/utils/searches/generateArray';
import { binarySearch, kmpSearch, bmSearch } from '../src/utils/searches/searches';
import { searchCases } from './fixtures/arrays';

describe.each([['KMP', kmpSearch], ['Boyer-Moore', bmSearch]] as const)('%s', (_, search) => {
  describe('Normal values', () => {
    test.each(searchCases)('$text / $target', async ({ text, target, found }) => {
      const frame = jest.fn().mockResolvedValue(undefined);
      const [result, steps] = await search(text, target, frame);
      expect(result).toBe(found);
      expect(steps).toBeGreaterThanOrEqual(0);
    });
  });
  describe('Boundary values', () => {
    test('empty text and empty target terminate', async () => {
      expect(await search('', '', jest.fn())).toEqual([0, 0]);
      expect((await search('', 'a', jest.fn()))[0]).toBeNull();
    });
  });
  describe('Exceptional cases', () => {
    test('propagates cancellation from renderer', async () => {
      await expect(search('ab', 'a', jest.fn().mockRejectedValue(new Error('cancel')))).rejects.toThrow('cancel');
    });
  });
});

test('binary finds all duplicates and handles absent values', async () => {
  const frame = jest.fn().mockResolvedValue(undefined);
  expect((await binarySearch([-2, 0, 0, 0, 4], 0, frame))[0]).toEqual([1, 2, 3]);
  expect((await binarySearch([], 0, frame))[0]).toBeNull();
  expect((await binarySearch([1, 2], 3, frame))[0]).toBeNull();
});

test('variant 8 returns sorted rows for binary search without relying on its log', () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  const matrix = generateArray8();
  expect(matrix).toHaveLength(5);
  matrix.forEach(row => expect(row).toEqual([...row].sort((a, b) => a - b)));
  expect(log).toHaveBeenCalledWith('Sorted: ', matrix);
});
