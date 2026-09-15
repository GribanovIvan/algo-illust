import {
  bubbleSort,
  selectionSort,
  shellSort,
  heapSort,
  quickSort,
  mergeSort,
  countingSort,
} from "../utils/sorts/sorts";
import isSorted from "../utils/isSorted";
import {
  normalFixtures,
  boundaryFixtures,
  exceptionalFixtures,
} from "../fixtures/testData";

describe("Sorting Algorithms Unit Tests", () => {
  describe("Група 1: Нормальні значення (Normal values)", () => {
    test("1.1 bubbleSort sorts standard array in ascending and descending order", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arrAsc = [...normalFixtures.standardArray];
      const stepsAsc = await bubbleSort(arrAsc, true, renderMock);
      expect(isSorted(arrAsc, true)).toBe(true);
      expect(stepsAsc).toBeGreaterThan(0);
      expect(renderMock).toHaveBeenCalled();

      const arrDesc = [...normalFixtures.standardArray];
      const stepsDesc = await bubbleSort(arrDesc, false);
      expect(isSorted(arrDesc, false)).toBe(true);
      expect(stepsDesc).toBeGreaterThan(0);
    });

    test("1.2 selectionSort sorts standard array and tracks steps", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arr = [...normalFixtures.standardArray];
      const steps = await selectionSort(arr, true, renderMock);
      expect(isSorted(arr, true)).toBe(true);
      expect(steps).toBeGreaterThan(0);
      expect(renderMock).toHaveBeenCalled();
    });

    test("1.3 shellSort sorts array with negative and positive values", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arr = [...normalFixtures.arrayWithNegatives];
      const steps = await shellSort(arr, true, renderMock);
      expect(isSorted(arr, true)).toBe(true);
      expect(steps).toBeGreaterThan(0);
    });

    test("1.4 heapSort sorts standard array in ascending and descending order with step animations", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arrAsc = [...normalFixtures.standardArray];
      const stepsAsc = await heapSort(arrAsc, true, renderMock);
      expect(isSorted(arrAsc, true)).toBe(true);
      expect(stepsAsc).toBeGreaterThan(0);
      expect(renderMock).toHaveBeenCalled();

      const arrDesc = [...normalFixtures.standardArray];
      const stepsDesc = await heapSort(arrDesc, false);
      expect(isSorted(arrDesc, false)).toBe(true);
      expect(stepsDesc).toBeGreaterThan(0);
    });

    test("1.5 quickSort and mergeSort sort standard array in both directions", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arrQuick = [...normalFixtures.standardArray];
      const stepsQuick = await quickSort(arrQuick, true, renderMock);
      expect(isSorted(arrQuick, true)).toBe(true);
      expect(stepsQuick).toBeGreaterThan(0);

      const arrMerge = [...normalFixtures.standardArray];
      const stepsMerge = await mergeSort(arrMerge, false, renderMock);
      expect(isSorted(arrMerge, false)).toBe(true);
      expect(stepsMerge).toBeGreaterThan(0);
    });

    test("1.6 countingSort sorts standard array in-place", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arr = [...normalFixtures.standardArray];
      const steps = await countingSort(arr, true, renderMock);
      expect(isSorted(arr, true)).toBe(true);
      expect(steps).toBeGreaterThan(0);
      expect(renderMock).toHaveBeenCalled();
    });
  });

  describe("Група 2: Граничні значення (Boundary values)", () => {
    test("2.1 heapSort handles boundary minimum size array (2 elements)", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arr = [...boundaryFixtures.twoElementsArray];
      const steps = await heapSort(arr, true, renderMock);
      expect(isSorted(arr, true)).toBe(true);
      expect(steps).toBeGreaterThan(0);
      expect(arr[0]).toBeLessThanOrEqual(arr[1]);
    });

    test("2.2 heapSort and others handle single-element array gracefully", async () => {
      const arrSingle = [...boundaryFixtures.singleElementArray];
      const stepsHeap = await heapSort(arrSingle, true);
      expect(stepsHeap).toBe(0);
      expect(arrSingle).toEqual([99]);

      const stepsQuick = await quickSort(arrSingle, true);
      expect(stepsQuick).toBe(0);
    });

    test("2.3 heapSort handles empty array without errors", async () => {
      const arrEmpty = [...boundaryFixtures.emptyArray];
      const steps = await heapSort(arrEmpty, true);
      expect(steps).toBe(0);
      expect(arrEmpty).toEqual([]);
    });

    test("2.4 sorts handle already sorted arrays (ascending and descending)", async () => {
      const arrAsc = [...boundaryFixtures.alreadySortedAsc];
      await heapSort(arrAsc, true);
      expect(isSorted(arrAsc, true)).toBe(true);

      const arrDesc = [...boundaryFixtures.alreadySortedDesc];
      await heapSort(arrDesc, false);
      expect(isSorted(arrDesc, false)).toBe(true);
    });

    test("2.5 sorts handle arrays with all identical elements", async () => {
      const arrEqual = [...boundaryFixtures.allEqualElements];
      await heapSort(arrEqual, true);
      expect(isSorted(arrEqual, true)).toBe(true);
      expect(arrEqual).toEqual([7, 7, 7, 7, 7, 7]);
    });

    test("2.6 heapSort handles maximum allowed size array (100 elements)", async () => {
      const arr100 = [...boundaryFixtures.hundredElementsArray];
      const steps = await heapSort(arr100, true);
      expect(isSorted(arr100, true)).toBe(true);
      expect(steps).toBeGreaterThan(0);
    });
  });

  describe("Група 3: Виняткові ситуації (Exceptional situations)", () => {
    test("3.1 countingSort throws Error for non-numeric arrays", async () => {
      const invalidArray = [...exceptionalFixtures.nonNumericArrayForCountingSort];
      await expect(countingSort(invalidArray, true)).rejects.toThrow(
        "Counting sort can only be used with numbers"
      );
    });

    test("3.2 countingSort throws Error when range exceeds memory safety threshold", async () => {
      const hugeRangeArray = [...exceptionalFixtures.hugeRangeArrayForCountingSort];
      await expect(countingSort(hugeRangeArray, true)).rejects.toThrow(
        "Counting sort range is too large for memory limits"
      );
    });

    test("3.3 heapSort handles negative numbers and zero without exceptions", async () => {
      const arr = [-100, 0, -500, 250, -1];
      const steps = await heapSort(arr, true);
      expect(isSorted(arr, true)).toBe(true);
      expect(steps).toBeGreaterThan(0);
      expect(arr[0]).toBe(-500);
      expect(arr[arr.length - 1]).toBe(250);
    });

    test("3.4 quickSort handles duplicate and extreme values without recursion overflow", async () => {
      const arr = [0, 0, 1, 0, -1, 0, 0];
      await quickSort(arr, true);
      expect(isSorted(arr, true)).toBe(true);
    });

    test("3.5 isSorted returns true for empty array and single element array", () => {
      expect(isSorted([], true)).toBe(true);
      expect(isSorted([42], true)).toBe(true);
      expect(isSorted([1, 2, 3], true)).toBe(true);
      expect(isSorted([3, 2, 1], true)).toBe(false);
      expect(isSorted([3, 2, 1], false)).toBe(true);
    });
  });
});
