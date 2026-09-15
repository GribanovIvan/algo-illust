import { act, fireEvent, render, screen } from '@testing-library/react';
import { benchmarkStats } from '../../__fixtures__/sortArrays';
import createBenchmarkWorker from '../../utils/sorts/createBenchmarkWorker';
import SortsTable from './SortsTable';

jest.mock('../../utils/sorts/createBenchmarkWorker', () => ({
  __esModule: true,
  default: jest.fn(),
}));

type WorkerMock = {
  postMessage: jest.Mock;
  terminate: jest.Mock;
  onmessage: ((message: { data: unknown }) => void) | null;
  onerror: (() => void) | null;
};

const mockedCreateWorker = createBenchmarkWorker as jest.MockedFunction<typeof createBenchmarkWorker>;
let worker: WorkerMock;

beforeEach(() => {
  worker = { postMessage: jest.fn(), terminate: jest.fn(), onmessage: null, onerror: null };
  mockedCreateWorker.mockReset().mockReturnValue(worker as unknown as Worker);
});

const sendStats = (stats = benchmarkStats) =>
  act(() => stats.forEach((stat) => worker.onmessage?.({ data: stat })));

describe('SortsTable', () => {
  test('runs every sort in a worker and fills the table', () => {
    render(<SortsTable />);
    expect(worker.postMessage).toHaveBeenCalledWith({
      length: 10,
      sorts: benchmarkStats.map((stat) => stat.sortId),
    });
    expect(screen.getByText('Sorting...', { selector: 'span' })).toBeInTheDocument();

    sendStats();

    expect(screen.getAllByRole('row')).toHaveLength(benchmarkStats.length + 1);
    expect(screen.getByRole('cell', { name: 'heap' })).toBeInTheDocument();
    expect(worker.terminate).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Sorting...', { selector: 'span' })).not.toBeInTheDocument();
  });

  test('runs a single selected sort on the minimal length', () => {
    render(<SortsTable />);
    sendStats();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'heap' } });
    fireEvent.change(screen.getByLabelText('Array Length:'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Run' }));

    expect(mockedCreateWorker).toHaveBeenCalledTimes(2);
    expect(worker.postMessage).toHaveBeenLastCalledWith({ length: 2, sorts: ['heap'] });
    expect(screen.getByRole('heading')).toHaveTextContent('Size: 2');
  });

  test('refuses to start while the previous comparison is running', () => {
    const alert = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    render(<SortsTable />);
    fireEvent.click(screen.getByRole('button', { name: 'Run' }));
    expect(alert).toHaveBeenCalledWith('Please wait for the current sorting to finish.');
    expect(mockedCreateWorker).toHaveBeenCalledTimes(1);
    alert.mockRestore();
  });

  test('stops the worker when it fails', () => {
    render(<SortsTable />);
    act(() => worker.onerror?.());
    expect(worker.terminate).toHaveBeenCalled();
    expect(screen.queryByText('Sorting...', { selector: 'span' })).not.toBeInTheDocument();
  });

  test('terminates the worker on unmount', () => {
    const { unmount } = render(<SortsTable />);
    unmount();
    expect(worker.terminate).toHaveBeenCalledTimes(1);
  });
});
