import benchmarkSorts from "./benchmarkSorts";

jest.mock("../randomArrays", () => ({
  __esModule: true,
  default: jest.fn(() => [3, 1, 2]),
}));

describe("benchmark worker", () => {
  test("posts stats for every requested sort", () => {
    const postMessage = jest.spyOn(window, "postMessage").mockImplementation(() => undefined);
    require("./benchmark.worker");

    window.onmessage?.(new MessageEvent("message", { data: { length: 3, sorts: ["heap", "bubble"] } }));

    expect(postMessage).toHaveBeenCalledTimes(2);
    expect(postMessage.mock.calls.map(([stats]) => stats.sortId)).toEqual(["heap", "bubble"]);
    expect(postMessage.mock.calls[0][0]).toEqual(expect.objectContaining({ sorted: true, name: "Heap Sort" }));
    expect(Object.keys(benchmarkSorts)).toContain("heap");
  });
});
