// Vite "?worker" imports are replaced in tests; mock createBenchmarkWorker instead
module.exports = class WorkerMock {
  postMessage() {}
  terminate() {}
};
