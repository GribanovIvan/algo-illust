import testDS from "./test";
import Stack from "./stack";
import Queue from "./queue";

describe("testDS", () => {
  test("reports the element after the maximum at index 0", () => {
    const stats = testDS([9, 1, 5], 5, Queue);
    expect(stats).toMatchObject({ length: 3, max: 9, elAfterMax: 1, min: 1, foundIndex: 2 });
  });

  test("has no element before the minimum at index 0", () => {
    expect(testDS([1, 4, 7], 4, Stack).elBeforeMin).toBeNull();
  });

  test("handles an empty structure", () => {
    expect(testDS([], 1, Stack)).toMatchObject({ length: 0, min: null, max: null, foundIndex: null });
  });
});
