import BenchmarkWorker from "./benchmark.worker?worker";

// Separate module, so that tests can substitute the worker
const createBenchmarkWorker = (): Worker => new BenchmarkWorker();

export default createBenchmarkWorker;
