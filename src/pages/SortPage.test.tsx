import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SortComponent from '../components/sorts/SortComponent';
import { countingSort, heapSort } from '../utils/sorts/sorts';
import SortPage from './SortPage';

const mockGenerateArray = jest.fn();
jest.mock('../utils/sorts/generateArray', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockGenerateArray(...args),
}));

const HeapSort = SortComponent(heapSort);
const CountingSort = SortComponent(countingSort);

const renderSortPage = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="sort/" element={<SortPage />}>
          <Route path="heap" element={<HeapSort />} />
          <Route path="counting" element={<CountingSort />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

const submitLength = (value: string) => {
  fireEvent.change(screen.getByLabelText('Array Length:'), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Run' }));
};

const submitArray = (value: string) => {
  fireEvent.change(screen.getByLabelText('Own array:'), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Sort' }));
};

const barValues = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.arrayItem')).map((bar) => bar.textContent);

const finishAnimation = () => act(() => jest.runAllTimersAsync());

beforeEach(() => {
  jest.useFakeTimers();
  mockGenerateArray.mockReset();
});
afterEach(() => jest.useRealTimers());

describe('SortPage with own array', () => {
  test('animates heap sort of the entered array and counts steps', async () => {
    const { container } = renderSortPage('/sort/heap');
    expect(screen.getByRole('link', { name: 'Heap Sort' })).toHaveClass('textSelected');

    submitArray('3, 1 2');
    await finishAnimation();

    expect(screen.getByText(/Steps: 2\./)).toBeInTheDocument();
    expect(barValues(container)).toEqual(['1', '2', '3']);
  });

  test('sorts in descending order after toggling the direction', async () => {
    const { container } = renderSortPage('/sort/heap/');
    fireEvent.click(screen.getByRole('button', { name: 'Asc' }));
    submitArray('1 2');
    await finishAnimation();

    expect(barValues(container)).toEqual(['2', '1']);
    expect(screen.getByRole('link', { name: 'Heap Sort' })).toHaveClass('textSelected');
  });

  test('does not start on invalid input', async () => {
    renderSortPage('/sort/heap');
    submitArray('1, x');
    await finishAnimation();

    expect(screen.getByRole('alert')).toHaveTextContent('"x" is not a number.');
    expect(screen.getByText(/Steps: 0\./)).toBeInTheDocument();
  });

  test('disables both forms while sorting and enables them afterwards', async () => {
    renderSortPage('/sort/heap');
    submitArray('5 4 3 2 1');

    expect(screen.getByLabelText('Own array:')).toBeDisabled();
    expect(screen.getByLabelText('Array Length:')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sort' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled();

    await finishAnimation();

    expect(screen.getByLabelText('Own array:')).toBeEnabled();
    expect(screen.getByLabelText('Array Length:')).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Sort' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled();
  });

  test('shows the generation error on the page instead of a modal window', async () => {
    const alert = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    mockGenerateArray.mockRejectedValue(new Error('randomuser.me responded with 500'));
    renderSortPage('/sort/heap');
    submitLength('4');
    await finishAnimation();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Failed to generate array: randomuser.me responded with 500'
    );
    expect(alert).not.toHaveBeenCalled();
    alert.mockRestore();
  });

  test('sorts the generated array and clears the previous error', async () => {
    mockGenerateArray.mockRejectedValueOnce(new Error('randomuser.me responded with 500'));
    const { container } = renderSortPage('/sort/heap');
    submitLength('3');
    await finishAnimation();
    expect(screen.getByRole('alert')).toBeInTheDocument();

    mockGenerateArray.mockResolvedValueOnce([3, 1, 2]);
    submitLength('3');
    await finishAnimation();
    await finishAnimation();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(barValues(container)).toEqual(['1', '2', '3']);
  });

  test('shows the counting sort error for non-integers and unlocks the page', async () => {
    renderSortPage('/sort/counting');
    submitArray('1.5 0.5');
    await finishAnimation();

    expect(screen.getByRole('alert')).toHaveTextContent('Counting sort works only with integers');

    submitArray('2 -1');
    await finishAnimation();
    expect(screen.getByText(/Steps: 2\./)).toBeInTheDocument();
  });
});
