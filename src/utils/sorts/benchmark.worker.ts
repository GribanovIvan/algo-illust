import { benchmark, BenchmarkRequest, BenchmarkMessage } from './benchmark';

const scope = globalThis as unknown as {
  onmessage: (message: MessageEvent<BenchmarkRequest>) => void;
  postMessage: (message: BenchmarkMessage) => void;
};

scope.onmessage = async message => {
  try {
    await benchmark(message.data, stats => scope.postMessage(stats));
  } catch (error) {
    scope.postMessage({ error: error instanceof Error ? error.message : 'Comparison failed.' });
  }
};
