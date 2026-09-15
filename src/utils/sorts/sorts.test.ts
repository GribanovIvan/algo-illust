import { boundaryArrays, nonIntegerArrays, normalArrays } from "../../__fixtures__/sortArrays";
import { SortFunc } from "../types/sort.types";
import { bubbleSort, countingSort, heapSort, mergeSort, quickSort, selectionSort, shellSort } from "./sorts";

const sorts: [string, SortFunc][] = [
  ["bubble", bubbleSort],
  ["selection", selectionSort],
  ["shell", shellSort],
  ["merge", mergeSort],
  ["quick", quickSort],
  ["counting", countingSort],
  ["heap", heapSort],
];

const expectedOrder = (arr: number[], isASC: boolean) =>
  [...arr].sort((a, b) => (isASC ? a - b : b - a));

describe.each(sorts)("%s sort", (_, sort) => {
  describe("normal values", () => {
    test.each(Object.entries(normalArrays))("sorts %s array in both orders", async (_, fixture) => {
      for (const isASC of [true, false]) {
        const arr = [...fixture];
        await sort(arr, isASC);
        expect(arr).toEqual(expectedOrder(fixture, isASC));
      }
    });

    test("animates steps through the render callback", async () => {
      const render = jest.fn().mockResolvedValue(undefined);
      const steps = await sort([...normalArrays.random], true, render);
      expect(steps).toBeGreaterThan(0);
      expect(render).toHaveBeenCalled();
      const lastFrame = render.mock.calls[render.mock.calls.length - 1][0];
      expect(lastFrame).toEqual(expectedOrder(normalArrays.random, true));
    });
  });

  describe("boundary values", () => {
    test.each(Object.entries(boundaryArrays))("sorts %s array", async (_, fixture) => {
      for (const isASC of [true, false]) {
        const arr = [...fixture];
        await sort(arr, isASC);
        expect(arr).toEqual(expectedOrder(fixture, isASC));
      }
    });
  });
});

describe("heap sort", () => {
  test("highlights only indexes inside the array", async () => {
    const render = jest.fn().mockResolvedValue(undefined);
    const fixture = normalArrays.withDuplicates;
    await heapSort([...fixture], false, render);
    const highlighted = render.mock.calls.flatMap(([, toSwap]) => [
      ...(toSwap?.green ?? []),
      ...(toSwap?.orange ?? []),
    ]);
    expect(highlighted.length).toBeGreaterThan(0);
    highlighted.forEach((index) => {
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(fixture.length);
    });
  });

  test("makes only n - 1 extraction swaps for equal values", async () => {
    // equal values never violate the heap property, so sift-down does not swap
    expect(await heapSort([...boundaryArrays.allEqual], true)).toBe(boundaryArrays.allEqual.length - 1);
    expect(await heapSort([], true)).toBe(0);
  });
});

describe("exceptional situations", () => {
  test.each(Object.entries(nonIntegerArrays))("counting sort rejects %s", async (_, fixture) => {
    await expect(countingSort([...fixture], true)).rejects.toThrow("Counting sort works only with integers");
  });

  test("quick sort sorts an ascending array in descending order", async () => {
    const arr = [...boundaryArrays.sortedAsc];
    const steps = await quickSort(arr, false);
    expect(arr).toEqual(boundaryArrays.sortedDesc);
    expect(steps).toBeGreaterThan(0);
  });

  test("simultaneous sorts keep separate step counters", async () => {
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
    const [alone] = [await mergeSort([...normalArrays.random], true)];
    const [first, second] = await Promise.all([
      mergeSort([...normalArrays.random], true, tick),
      mergeSort([...boundaryArrays.pair], true, tick),
    ]);
    expect(first).toBe(alone);
    expect(second).toBe(1);
  });

  test("propagates a failing render callback", async () => {
    const render = jest.fn().mockRejectedValue(new Error("render failed"));
    await expect(heapSort([...normalArrays.random], true, render)).rejects.toThrow("render failed");
  });
});
