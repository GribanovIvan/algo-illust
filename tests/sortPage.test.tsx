import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SortPage from '../src/pages/SortPage';
import SortComponent from '../src/components/sorts/SortComponent';
import { sortFunctions } from '../src/utils/sorts/registry';
import generateArray from '../src/utils/sorts/generateArray';
import { SortFunc } from '../src/utils/types/sort.types';

jest.mock('../src/utils/sorts/generateArray');
const components = Object.entries(sortFunctions).map(([id, sort]) => [id, SortComponent(sort)] as const);

function mount(id = 'heap', override?: SortFunc) {
  const Override = override && SortComponent(override);
  return render(<MemoryRouter initialEntries={[`/sort/${id}`]}>
    <Routes>
      <Route path="/sort" element={<SortPage />}>
        {Override ? <Route path={id} element={<Override />} /> : components.map(([name, Component]) =>
          <Route key={name} path={name} element={<Component />} />)}
      </Route>
    </Routes>
  </MemoryRouter>);
}

function submit(text: string) {
  fireEvent.change(screen.getByLabelText(/Custom array/), {target: {value: text}});
  fireEvent.click(screen.getByRole('button', {name: 'Sort array'}));
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.mocked(generateArray).mockResolvedValue([3, 1, 2]);
});
afterEach(() => jest.useRealTimers());

describe('Нормальні значення', () => {
  test.each(Object.keys(sortFunctions))('%s renders the custom array in either direction', async id => {
    const view = mount(id);
    submit('3, -1, 2.5');
    expect(screen.getByRole('button', {name: 'Sort array'})).toBeDisabled();
    await act(async () => { await jest.runAllTimersAsync(); });
    expect([...view.container.querySelectorAll('.arrayItem')].map(item => item.textContent)).toEqual(['-1', '2.5', '3']);
    expect(screen.getByRole('button', {name: 'Sort array'})).toBeEnabled();
    fireEvent.click(screen.getByRole('button', {name: 'Asc'}));
    await act(async () => { await jest.runAllTimersAsync(); });
    expect([...view.container.querySelectorAll('.arrayItem')].map(item => item.textContent)).toEqual(['3', '2.5', '-1']);
    expect(screen.getByText(/Steps:/)).not.toHaveTextContent(/taken -/);
  });
  test('random generator still launches visualization', async () => {
    const view = mount();
    await act(async () => { fireEvent.click(screen.getByRole('button', {name: 'Run'})); });
    await act(async () => { await jest.runAllTimersAsync(); });
    expect(generateArray).toHaveBeenCalledWith(10, 0);
    expect([...view.container.querySelectorAll('.arrayItem')].map(item => item.textContent)).toEqual(['1', '2', '3']);
  });
});

describe('Граничні значення', () => {
  test('minimum size has counted heap step and final sorted frame', async () => {
    mount();
    submit('2 1');
    await act(async () => { await jest.runAllTimersAsync(); });
    expect(screen.getByText(/Steps: 1\./)).toBeInTheDocument();
    expect(document.querySelectorAll('.arrayItem.sorted')).toHaveLength(2);
  });
  test('navigation during a frame cancels timers from the old algorithm', async () => {
    const view = mount();
    submit('3 2 1');
    await act(async () => { fireEvent.click(screen.getByRole('link', {name: 'Quick Sort'})); });
    await act(async () => { await jest.runAllTimersAsync(); });
    expect([...view.container.querySelectorAll('.arrayItem')].map(item => item.textContent)).toEqual(['1', '2', '3']);
    expect(screen.getByRole('button', {name: 'Sort array'})).toBeEnabled();
    expect(jest.getTimerCount()).toBe(0);
  });
  test('unmount cancels pending animation', async () => {
    const view = mount();
    submit('3 2 1');
    view.unmount();
    await act(async () => {});
    expect(jest.getTimerCount()).toBe(0);
  });
});

describe('Виняткові ситуації', () => {
  test('invalid input never calls sorting', () => {
    const sort = jest.fn().mockResolvedValue(0);
    mount('heap', sort);
    submit('1, broken');
    expect(screen.getByRole('alert')).toHaveTextContent('not a valid number');
    expect(sort).not.toHaveBeenCalled();
  });
  test('algorithm rejection is visible and unlocks controls', async () => {
    mount('heap', jest.fn().mockRejectedValue(new Error('Sort failed')));
    await act(async () => { submit('3 1'); });
    expect(screen.getByRole('alert')).toHaveTextContent('Sort failed');
    expect(screen.getByRole('button', {name: 'Sort array'})).toBeEnabled();
  });
  test('generation rejection leaves the page usable', async () => {
    jest.mocked(generateArray).mockRejectedValueOnce(new Error('Generation failed'));
    mount();
    await act(async () => { fireEvent.click(screen.getByRole('button', {name: 'Run'})); });
    expect(screen.getByRole('alert')).toHaveTextContent('Generation failed');
    expect(screen.getByRole('button', {name: 'Run'})).toBeEnabled();
  });
  test('empty generated variant reports a useful error', async () => {
    jest.mocked(generateArray).mockResolvedValueOnce([]);
    mount();
    await act(async () => { fireEvent.click(screen.getByRole('button', {name: 'Run'})); });
    expect(screen.getByRole('alert')).toHaveTextContent('This variant generated an empty array. Please try again.');
  });
  test('generation fallback error uses English', async () => {
    jest.mocked(generateArray).mockRejectedValueOnce(null);
    mount();
    await act(async () => { fireEvent.click(screen.getByRole('button', {name: 'Run'})); });
    expect(screen.getByRole('alert')).toHaveTextContent('Could not generate the array.');
  });
  test('sorting fallback error uses English', async () => {
    mount('heap', jest.fn().mockRejectedValue(null));
    await act(async () => { submit('3 1'); });
    expect(screen.getByRole('alert')).toHaveTextContent('Sorting failed.');
  });
});
