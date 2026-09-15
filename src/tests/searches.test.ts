import { binarySearch, kmpSearch, bmSearch } from "../utils/searches/searches";
import { normalFixtures, boundaryFixtures, exceptionalFixtures } from "../fixtures/testData";

describe("Search Algorithms Unit Tests", () => {
  describe("Група 1: Нормальні значення (Normal values)", () => {
    test("1.1 binarySearch finds existing number in sorted array", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arr = normalFixtures.sortedNumbers;
      const [result, steps] = await binarySearch(arr, 30, renderMock);
      expect(result).toEqual([2]);
      expect(steps).toBeGreaterThan(0);
      expect(renderMock).toHaveBeenCalled();
    });

    test("1.2 kmpSearch finds substring in standard text without backtracking text pointer", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const [found, steps] = await kmpSearch(
        normalFixtures.searchString,
        normalFixtures.searchTarget,
        renderMock
      );
      expect(found).toBe(normalFixtures.searchString.indexOf(normalFixtures.searchTarget));
      expect(steps).toBeGreaterThan(0);
      expect(renderMock).toHaveBeenCalled();
    });

    test("1.3 bmSearch finds substring and returns correct positive step count", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const [found, steps] = await bmSearch(
        normalFixtures.searchString,
        normalFixtures.searchTarget,
        renderMock
      );
      expect(found).toBe(normalFixtures.searchString.indexOf(normalFixtures.searchTarget));
      expect(steps).toBeGreaterThan(0);
    });
  });

  describe("Група 2: Граничні значення (Boundary values)", () => {
    test("2.1 binarySearch finds target at boundary start (index 0) and end", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const arr = [10, 20, 30, 40, 50];
      const [first] = await binarySearch(arr, 10, renderMock);
      expect(first).toEqual([0]);

      const [last] = await binarySearch(arr, 50, renderMock);
      expect(last).toEqual([4]);
    });

    test("2.2 kmpSearch and bmSearch find match at start and end of string", async () => {
      const str = "apple banana cherry";
      const [foundStart] = await kmpSearch(str, "apple", jest.fn().mockResolvedValue(undefined));
      expect(foundStart).toBe(0);

      const [foundEnd] = await bmSearch(str, "cherry", jest.fn().mockResolvedValue(undefined));
      expect(foundEnd).toBe(str.indexOf("cherry"));
    });

    test("2.3 single character string search matches correctly", async () => {
      const [found] = await kmpSearch(
        boundaryFixtures.searchInSingleChar,
        boundaryFixtures.searchSingleChar,
        jest.fn().mockResolvedValue(undefined)
      );
      expect(found).toBe(0);
    });
  });

  describe("Група 3: Виняткові ситуації (Exceptional situations)", () => {
    test("3.1 binarySearch returns null for value not in array", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const [result, steps] = await binarySearch([10, 20, 30], 99, renderMock);
      expect(result).toBeNull();
      expect(steps).toBeGreaterThan(0);
    });

    test("3.2 kmpSearch returns null when pattern is not found", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const [found] = await kmpSearch(
        normalFixtures.searchString,
        exceptionalFixtures.missingSearchPattern,
        renderMock
      );
      expect(found).toBeNull();
    });

    test("3.3 bmSearch handles empty target and longer-than-text target safely", async () => {
      const renderMock = jest.fn().mockResolvedValue(undefined);
      const [foundEmpty] = await bmSearch("hello", "", renderMock);
      expect(foundEmpty).toBeNull();

      const [foundLonger] = await bmSearch("hi", "very long pattern", renderMock);
      expect(foundLonger).toBeNull();
    });
  });
});
