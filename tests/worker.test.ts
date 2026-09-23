/** @jest-environment node */
import { sorts } from '../src/utils/sorts/registry';

test('worker protocol sends stats and serializes failures', async () => {
  const scope = globalThis as unknown as {
    onmessage?: (event: {data: unknown}) => Promise<void>;
    postMessage?: jest.Mock;
  };
  const previousPost = scope.postMessage, previousMessage = scope.onmessage;
  scope.postMessage = jest.fn();
  try {
    await import('../src/utils/sorts/benchmark.worker');
    await scope.onmessage!({data: {length: 6, sorts: sorts.map(sort => sort.id)}});
    expect(scope.postMessage).toHaveBeenCalledTimes(7);
    expect(scope.postMessage).toHaveBeenCalledWith(expect.objectContaining({sortId: 'heap', sorted: true}));
    await scope.onmessage!({data: {length: -1, sorts: ['heap']}});
    expect(scope.postMessage).toHaveBeenLastCalledWith({error: expect.stringContaining('between 2 and 5000')});
    await scope.onmessage!({data: null});
    expect(scope.postMessage).toHaveBeenLastCalledWith({error: expect.any(String)});
  } finally {
    scope.postMessage = previousPost;
    scope.onmessage = previousMessage;
  }
});
