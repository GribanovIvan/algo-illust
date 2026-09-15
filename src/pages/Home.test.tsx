import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>);

beforeEach(() => {
  jest.useFakeTimers();
  mockNavigate.mockReset();
});
afterEach(() => jest.useRealTimers());

describe('Home', () => {
  test('shows the menu after the intro and navigates with the keyboard', () => {
    renderHome();
    expect(screen.getByRole('heading')).toHaveTextContent('Algorithms Visualizer');
    act(() => { jest.advanceTimersByTime(1700); });
    expect(screen.getByRole('link', { name: 'sort' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('ds/stack');

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenLastCalledWith('sort/bubble');
  });

  test('selects a menu item by typed text of at least two chars', () => {
    renderHome();
    act(() => { jest.advanceTimersByTime(1700); });
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 's' } });
    expect(screen.getByRole('link', { name: 'sort' })).toHaveClass('selected');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'SEA' } });
    expect(screen.getByRole('link', { name: 'search' })).toHaveClass('selected');
  });

  test('removes the key listener and timers on unmount', () => {
    const removeListener = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHome();
    unmount();

    expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(jest.getTimerCount()).toBe(0);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockNavigate).not.toHaveBeenCalled();
    removeListener.mockRestore();
  });
});
