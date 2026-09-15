export function createWorkerMock() {
  return {
    onmessage: null as null | ((event: { data: unknown }) => void),
    onerror: null as null | (() => void),
    onmessageerror: null as null | (() => void),
    postMessage: jest.fn(),
    terminate: jest.fn(),
  };
}
