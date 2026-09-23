import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from '../src/pages/Home';

const Location = () => <output>{useLocation().pathname}</output>;

const renderHome = () => render(
  <StrictMode>
    <MemoryRouter initialEntries={['/']}>
      <Routes><Route path="/" element={<Home />} /><Route path="*" element={<Location />} /></Routes>
    </MemoryRouter>
  </StrictMode>
);

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('keyboard navigation opens the selected section once', () => {
  renderHome();
  act(() => { jest.advanceTimersByTime(1700); });
  fireEvent.keyDown(window, {key: 'ArrowDown'});
  fireEvent.keyDown(window, {key: 'ArrowDown'});
  fireEvent.keyDown(window, {key: 'ArrowUp'});
  fireEvent.keyDown(window, {key: 'Enter'});
  expect(screen.getByRole('status')).toHaveTextContent('/search/binary');
});

test('arrow keys wrap around the menu', () => {
  renderHome();
  act(() => { jest.advanceTimersByTime(1700); });
  fireEvent.keyDown(window, {key: 'ArrowUp'});
  fireEvent.keyDown(window, {key: 'Enter'});
  expect(screen.getByRole('status')).toHaveTextContent('/ds/stack');
});

test('leaves no keyboard handler or timers behind after unmount', () => {
  const addListener = jest.spyOn(window, 'addEventListener');
  const removeListener = jest.spyOn(window, 'removeEventListener');
  const home = renderHome();
  home.unmount();
  const added = addListener.mock.calls.filter(([type]) => type === 'keydown').map(([, handler]) => handler);
  const removed = removeListener.mock.calls.filter(([type]) => type === 'keydown').map(([, handler]) => handler);
  expect(added.length).toBeGreaterThan(0);
  expect(removed).toEqual(expect.arrayContaining(added));
  expect(jest.getTimerCount()).toBe(0);
  expect(window.onkeydown).toBeNull();
});
