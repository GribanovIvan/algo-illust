export default function createBenchmarkWorker() {
  return new Worker(new URL('./sorts/benchmark.worker.ts', import.meta.url), { type: 'module' });
}
