import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchPage from '../src/pages/SearchPage';
import KMP from '../src/components/searches/KMP';
import BM from '../src/components/searches/BM';
import Binary from '../src/components/searches/Binary';

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  jest.spyOn(Math, 'random').mockReturnValue(.5);
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => jest.useRealTimers());

function mount(id: string) {
  return render(<MemoryRouter initialEntries={[`/search/${id}`]}>
    <Routes><Route path="/search" element={<SearchPage />}>
      <Route path="kmp" element={<KMP />} />
      <Route path="bm" element={<BM />} />
      <Route path="binary" element={<Binary />} />
    </Route></Routes>
  </MemoryRouter>);
}

function submit(target: string) {
  fireEvent.change(screen.getByPlaceholderText('Search in...'), {target: {value: 'abcabc'}});
  fireEvent.change(screen.getByPlaceholderText('Search for...'), {target: {value: target}});
  fireEvent.click(screen.getByRole('button', {name: 'Run'}));
}

test.each(['kmp', 'bm'])('%s reruns when only the target changes', async id => {
  mount(id);
  submit('abc');
  await act(async () => { await jest.runAllTimersAsync(); });
  expect(screen.getByRole('status')).toHaveTextContent('Found at position 1');
  submit('bc');
  await act(async () => { await jest.runAllTimersAsync(); });
  expect(screen.getByRole('status')).toHaveTextContent('Found at position 2');
  submit('bc');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  await act(async () => { await jest.runAllTimersAsync(); });
  expect(screen.getByRole('status')).toHaveTextContent('Found at position 2');
  expect(window.alert).not.toHaveBeenCalled();
});

test.each(['kmp', 'bm'])('%s reports a missing pattern on the page', async id => {
  mount(id);
  submit('zzz');
  await act(async () => { await jest.runAllTimersAsync(); });
  expect(screen.getByRole('status')).toHaveTextContent('Not found');
  expect(window.alert).not.toHaveBeenCalled();
});

test.each(['kmp', 'bm', 'binary'])('%s cancels timers on unmount', async id => {
  const view = mount(id);
  if (id !== 'binary') submit('abc');
  view.unmount();
  await act(async () => {});
  expect(jest.getTimerCount()).toBe(0);
  expect(window.alert).not.toHaveBeenCalled();
});

test.each([
  ['', 'abc'], ['a'.repeat(201), 'abc'], ['a', 'a'.repeat(5001)],
])('invalid search input is rejected with English guidance', (pattern, text) => {
  mount('bm');
  fireEvent.change(screen.getByPlaceholderText('Search in...'), {target: {value: text}});
  fireEvent.change(screen.getByPlaceholderText('Search for...'), {target: {value: pattern}});
  fireEvent.click(screen.getByRole('button', {name: 'Run'}));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a nonempty pattern of up to 200 characters and text of up to 5000 characters.');
  expect(jest.getTimerCount()).toBe(0);
});
