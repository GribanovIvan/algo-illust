import generateRandomArray from "../randomArrays";
import benchmarkSorts, { BenchmarkSortId } from "./benchmarkSorts";

onmessage = (message: MessageEvent<{length: number, sorts: BenchmarkSortId[]}>) => {
  const arr = generateRandomArray(message.data.length, 100);
  message.data.sorts.forEach((sortId) => {
    postMessage(benchmarkSorts[sortId]([...arr]));
  });
};
