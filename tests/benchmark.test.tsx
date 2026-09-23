import { act, fireEvent, render, screen } from '@testing-library/react';
import SortsTable from '../src/components/sorts/SortsTable';
import createBenchmarkWorker from '../src/utils/workerBuilder';
import { benchmark } from '../src/utils/sorts/benchmark';
import { sorts } from '../src/utils/sorts/registry';
import { createWorkerMock } from './fixtures/worker';

jest.mock('../src/utils/workerBuilder');
let worker: ReturnType<typeof createWorkerMock>;
beforeEach(() => {
  worker = createWorkerMock();
  jest.mocked(createBenchmarkWorker).mockReturnValue(worker as unknown as Worker);
});

describe('Нормальні значення', () => {
  test('benchmark runs seven algorithms on identical input with valid stats', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(.4);
    const report = jest.fn();
    await benchmark({length: 12, sorts: sorts.map(sort => sort.id), isASC: false}, report);
    expect(report).toHaveBeenCalledTimes(7);
    expect(report.mock.calls.map(([stat]) => stat.sortId)).toContain('heap');
    for (const [stat] of report.mock.calls) {
      expect(stat.sorted).toBe(true);
      expect(stat.steps).toBeGreaterThanOrEqual(0);
      expect(stat.time).toBeGreaterThanOrEqual(0);
    }
  });
  test('table receives heap stats and terminates the finished worker', () => {
    render(<SortsTable />);
    expect(worker.postMessage).toHaveBeenCalledWith({length: 10, sorts: sorts.map(sort => sort.id)});
    act(() => {
      sorts.forEach(sort => worker.onmessage?.({data: {...sort, sortId: sort.id, steps: 3, time: 1, sorted: true}}));
    });
    expect(screen.getByRole('cell', {name: 'heap'})).toBeInTheDocument();
    expect(worker.terminate).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', {name: 'Run'})).toBeEnabled();
    fireEvent.change(screen.getByRole('combobox'), {target: {value: 'heap'}});
    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(worker.postMessage).toHaveBeenLastCalledWith({length: 10, sorts: ['heap']});
  });
});

describe('Граничні значення', () => {
  test('leaving the table terminates a running worker', () => {
    const view = render(<SortsTable />);
    view.unmount();
    expect(worker.terminate).toHaveBeenCalledTimes(1);
  });
});

describe('Виняткові ситуації', () => {
  test.each([0, 1, 5001, NaN, Infinity])('invalid benchmark length %s', async length => {
    await expect(benchmark({length, sorts: ['heap']}, jest.fn())).rejects.toThrow();
  });
  test.each([[], ['unknown'], ['__proto__']])('invalid algorithm selection %j', async (...ids) => {
    await expect(benchmark({length: 10, sorts: ids.flat()}, jest.fn())).rejects.toThrow('Select valid algorithms to compare.');
  });
  test.each(['onerror', 'onmessageerror'] as const)('%s unlocks retry and terminates', event => {
    render(<SortsTable />);
    act(() => { worker[event]?.(); });
    expect(screen.getByRole('alert')).toHaveTextContent(event === 'onerror'
      ? 'Could not run the comparison. Please try again.' : 'Could not read the worker response.');
    expect(worker.terminate).toHaveBeenCalled();
    expect(screen.getByRole('button', {name: 'Run'})).toBeEnabled();
  });
  test('worker reports an algorithm error', () => {
    render(<SortsTable />);
    act(() => { worker.onmessage?.({data: {error: 'Invalid request'}}); });
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid request');
  });
  test('worker construction can fail without blocking the UI', () => {
    jest.mocked(createBenchmarkWorker).mockImplementationOnce(() => { throw new Error('Worker unavailable'); });
    render(<SortsTable />);
    expect(screen.getByRole('alert')).toHaveTextContent('Worker unavailable');
    expect(screen.getByRole('button', {name: 'Run'})).toBeEnabled();
  });
  test('worker construction fallback uses English', () => {
    jest.mocked(createBenchmarkWorker).mockImplementationOnce(() => { throw null; });
    render(<SortsTable />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not create the worker.');
  });
});
