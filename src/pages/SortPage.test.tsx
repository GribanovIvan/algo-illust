import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SortComponent from '../components/sorts/SortComponent';
import { countingSort, heapSort } from '../utils/sorts/sorts';
import SortPage from './SortPage';

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

const submitArray = (value: string) => {
  fireEvent.change(screen.getByLabelText('Own array:'), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Sort' }));
};

const barValues = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.arrayItem')).map((bar) => bar.textContent);

const finishAnimation = () => act(() => jest.runAllTimersAsync());

beforeEach(() => jest.useFakeTimers());
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

  test('asks to wait when an array is submitted during sorting', async () => {
    const alert = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    renderSortPage('/sort/heap');
    submitArray('5 4 3 2 1');
    submitArray('2 1');
    expect(alert).toHaveBeenCalledWith('Please wait for the current sorting to finish.');
    await finishAnimation();
    alert.mockRestore();
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
