import { boundaryArrays, normalArrays } from "../../__fixtures__/sortArrays";
import benchmarkSorts, { BenchmarkSortId } from "./benchmarkSorts";

const sortIds = Object.keys(benchmarkSorts) as BenchmarkSortId[];

describe.each(sortIds)("%s benchmark", (sortId) => {
  test("sorts a random non-negative array and reports stats", () => {
    const stats = benchmarkSorts[sortId]([...normalArrays.withDuplicates]);
    expect(stats).toMatchObject({ sortId, sorted: true });
    expect(stats.steps).toBeGreaterThan(0);
    expect(stats.time).toBeGreaterThanOrEqual(0);
  });

  test.each([[boundaryArrays.empty], [boundaryArrays.single]])("handles %p", (fixture) => {
    const stats = benchmarkSorts[sortId]([...fixture]);
    expect(stats).toMatchObject({ sortId, sorted: true });
    expect(stats.steps).toBeLessThanOrEqual(fixture.length);
  });
});
