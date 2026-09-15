import generateArray from '../src/utils/sorts/generateArray';
import generateRandomArray from '../src/utils/randomArrays';
import generateString from '../src/utils/searches/generateString';
import { findLastIndex } from '../src/utils/findLastIndex';
import { getRouterBase } from '../src/utils/routerBase';
import createBenchmarkWorker from '../src/utils/workerBuilder';

beforeEach(() => {
  jest.spyOn(Math, 'random').mockReturnValue(.25);
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

test.each(Array.from({length: 18}, (_, index) => index))('generation variant %s returns an array offline', async variant => {
  const fetchMock = jest.fn().mockRejectedValue(new Error('offline'));
  const original = globalThis.fetch;
  globalThis.fetch = fetchMock;
  try {
    expect(Array.isArray(await generateArray(10, variant))).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  } finally {
    globalThis.fetch = original;
  }
});

test('random generation validates size and range', () => {
  expect(generateRandomArray(2, 10)).toEqual([2, 2]);
  expect(generateRandomArray(2, 10, true)).toEqual([-5, -5]);
  for (const length of [-1, .5, Infinity, 5001]) expect(() => generateRandomArray(length)).toThrow();
});

test('last-index returns zero and missing sentinel correctly', () => {
  expect(findLastIndex([1, 2], value => value === 1)).toBe(0);
  expect(findLastIndex([], () => true)).toBe(-1);
});

test('text variants expand repetitions and swap lines', () => {
  expect(generateString('a{3}(bc){2}', 8)).toBe('aaabcbc');
  expect(generateString('first\nmiddle\nlast', 12)).toBe('last\nmiddle\nfirst');
});

test.each([
  ['https://example.com/src/utils/routerBase.ts', '/'],
  ['https://example.com/assets/index-hash.js', '/'],
  ['https://example.com/asd/assets/index-hash.js', '/asd'],
  ['https://example.com/course/demo/assets/index-hash.js', '/course/demo'],
])('router prefix from %s', (url, expected) => expect(getRouterBase(url)).toBe(expected));

test('worker factory uses a module URL and module type', () => {
  const original = globalThis.Worker;
  const worker = {terminate: jest.fn()};
  const MockWorker = jest.fn().mockImplementation(() => worker);
  globalThis.Worker = MockWorker as unknown as typeof Worker;
  try {
    expect(createBenchmarkWorker()).toBe(worker);
    expect(MockWorker).toHaveBeenCalledWith(expect.any(URL), {type: 'module'});
    expect(MockWorker.mock.calls[0][0].pathname).toMatch(/benchmark\.worker\.ts$/);
  } finally { globalThis.Worker = original; }
});

test("variant 9 has no interval when there are no negative elements", async () => {
  expect(await generateArray(4, 9)).toEqual([]);
});
