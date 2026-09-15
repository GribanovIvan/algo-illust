export default class WorkerBuilder {
  static create(workerFn?: any): Worker {
    if (typeof Worker === "undefined") {
      return {
        postMessage: () => {},
        terminate: () => {},
        onmessage: null,
      } as unknown as Worker;
    }
    return new Worker(
      new URL("./sorts/benchmark.worker.ts", import.meta.url),
      { type: "module" }
    );
  }

  constructor(workerFn?: any) {
    return WorkerBuilder.create(workerFn);
  }
}
