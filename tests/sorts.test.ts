import { sortFunctions } from '../src/utils/sorts/registry';
import { SortArray } from '../src/utils/types/sort.types';
import isSorted from '../src/utils/isSorted';
import parseArray, { MAX_ARRAY_LENGTH } from '../src/utils/sorts/parseArray';
import { normalArrays, boundaryArrays, validInputs, invalidInputs } from './fixtures/arrays';

for (const [name, sort] of Object.entries(sortFunctions)) {
  describe(name, () => {
    describe('Нормальні значення', () => {
      test.each(normalArrays.map(array => [array]))('sorts %j in both directions with frames', async source => {
        for (const asc of [true, false]) {
          const array = [...source];
          const frames = jest.fn().mockResolvedValue(undefined);
          const steps = await sort(array, asc, frames);
          expect(array).toEqual([...source].sort((a, b) => asc ? a - b : b - a));
          expect(frames).toHaveBeenLastCalledWith(array);
          expect(Number.isInteger(steps)).toBe(true);
          expect(steps).toBeGreaterThanOrEqual(0);
          expect(isSorted(array, asc)).toBe(true);
          const background = [...source];
          expect(await sort(background, asc)).toBe(steps);
          expect(background).toEqual(array);
        }
      });
    });
    describe('Граничні значення', () => {
      test.each(boundaryArrays.map(array => [array]))('handles %j', async source => {
        for (const asc of [true, false]) {
          const array = [...source];
          await sort(array, asc);
          expect(array).toEqual([...source].sort((a, b) => asc ? a - b : b - a));
        }
      });
      test('supports concurrent opposite directions without shared state', async () => {
        const first = [3, 1, 2, 0], second = [1, 2, 3, 0];
        const frame = jest.fn().mockResolvedValue(undefined);
        await Promise.all([sort(first, true, frame), sort(second, false, frame)]);
        expect(first).toEqual([0, 1, 2, 3]);
        expect(second).toEqual([3, 2, 1, 0]);
      });
    });
    describe('Виняткові ситуації', () => {
      test.each([NaN, Infinity, -Infinity])('rejects nonfinite %s', async value => {
        await expect(sort([value, 1], true)).rejects.toThrow();
      });
      test('propagates renderer failure', async () => {
        await expect(sort([3, 2, 1], true, jest.fn().mockRejectedValue(new Error('frame failed')))).rejects.toThrow('frame failed');
      });
    });
  });
}

describe('Existing variants', () => {
  test.each(Object.entries(sortFunctions).filter(([name]) => name !== 'counting'))('%s sorts strings and matrix first values', async (_, sort) => {
    for (const asc of [true, false]) {
      const strings: SortArray = ['z', 'b', 'a'];
      const matrix: SortArray = [[10, 1], [2, 3], [-1, 0]];
      await sort(strings, asc);
      await sort(matrix, asc);
      expect(strings).toEqual(asc ? ['a', 'b', 'z'] : ['z', 'b', 'a']);
      expect(matrix).toEqual(asc ? [[-1, 0], [2, 3], [10, 1]] : [[10, 1], [2, 3], [-1, 0]]);
      expect(isSorted(matrix, asc)).toBe(true);
    }
  });
  test('counting rejects nonnumeric variants', async () => {
    await expect(sortFunctions.counting(['a', 'b'], true)).rejects.toThrow('only supports numbers');
    await expect(sortFunctions.counting([[1], [2]], true)).rejects.toThrow('only supports numbers');
  });
});

describe('Array parser', () => {
  describe('Нормальні значення', () => {
    test.each(validInputs)('$text', ({text, array}) => expect(parseArray(text)).toEqual(array));
  });
  describe('Граничні значення', () => {
    test('accepts exactly the maximum number of elements', () => {
      expect(parseArray(Array(MAX_ARRAY_LENGTH).fill('0').join(','))).toHaveLength(MAX_ARRAY_LENGTH);
    });
  });
  describe('Виняткові ситуації', () => {
    test.each(invalidInputs)('rejects %s', text => expect(() => parseArray(text)).toThrow());
    test('rejects excessive text length before tokenization', () => expect(() => parseArray('1'.repeat(10001))).toThrow('too long'));
  });
});
