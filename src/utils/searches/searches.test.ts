import { binarySearch, bmSearch, kmpSearch } from "./searches";

const render = jest.fn().mockResolvedValue(undefined);

beforeEach(() => render.mockClear());

describe("string searches", () => {
  test.each([["kmp", kmpSearch], ["bm", bmSearch]])("%s finds a pattern and counts steps", async (_, search) => {
    const [found, steps] = await search("abcabd", "abd", render);
    expect(found).toBe(3);
    expect(steps).toBeGreaterThan(0);
    expect(render).toHaveBeenLastCalledWith({ found: [3, 4, 5] });
  });

  test.each([["kmp", kmpSearch], ["bm", bmSearch]])("%s returns null when the pattern is longer", async (_, search) => {
    const [found] = await search("ab", "abc", render);
    expect(found).toBeNull();
  });
});

describe("binarySearch", () => {
  test("finds all occurrences of the value", async () => {
    const [found] = await binarySearch([-2, 0, 0, 0, 5], 0, render);
    expect(found).toEqual([1, 2, 3]);
  });

  test("returns null for an empty array", async () => {
    expect(await binarySearch([], 1, render)).toEqual([null, 0]);
    expect(render).not.toHaveBeenCalled();
  });
});
