import { act, fireEvent, render, screen } from '@testing-library/react';
import App from '../src/App';
import createBenchmarkWorker from '../src/utils/workerBuilder';
import { createWorkerMock } from './fixtures/worker';

jest.mock('../src/utils/routerBase', () => ({routerBase: '/asd'}));
jest.mock('../src/utils/workerBuilder');

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.mocked(createBenchmarkWorker).mockReturnValue(createWorkerMock() as unknown as Worker);
});
afterEach(() => jest.useRealTimers());

const routes = [
  ...['bubble', 'selection', 'shell', 'quick', 'merge', 'counting', 'heap'].map(id => [`sort/${id}`, 'Власний масив']),
  ...['stack', 'queue', 'deque', 'linked-list', 'doubly-linked', 'circular-linked'].map(id => [`ds/${id}`, 'Find:']),
  ...['kmp', 'bm'].map(id => [`search/${id}`, 'KMP Search']),
  ['sort/compare', 'Size: 10'], ['search/hash', 'hash'],
];

test.each(routes)('preserves route /asd/%s', (route, content) => {
  window.history.replaceState({}, '', `/asd/${route}`);
  render(<App />);
  expect(screen.getByText(new RegExp(content))).toBeInTheDocument();
});

test.each([['sort', 'bubble'], ['search', 'binary'], ['ds', 'stack']])('base section /%s opens a valid default', async (section, child) => {
  window.history.replaceState({}, '', `/asd/${section}/`);
  render(<App />);
  await act(async () => {});
  expect(window.location.pathname).toBe(`/asd/${section}/${child}`);
});

test('navigation and browser history update the active structure with query parameters', async () => {
  window.history.replaceState({}, '', '/asd/ds/stack?example=1');
  render(<App />);
  expect(screen.getByRole('link', {name: 'Stack'})).toHaveClass('textSelected');
  fireEvent.click(screen.getByRole('link', {name: 'Queue'}));
  expect(window.location.pathname).toBe('/asd/ds/queue');
  expect(screen.getByRole('link', {name: 'Queue'})).toHaveClass('textSelected');
  act(() => {
    window.history.replaceState({}, '', '/asd/ds/stack?example=1');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(screen.getByRole('link', {name: 'Stack'})).toHaveClass('textSelected');
});

test('unknown route stays a 404', () => {
  window.history.replaceState({}, '', '/asd/missing');
  render(<App />);
  expect(screen.getByRole('heading', {name: '404'})).toBeInTheDocument();
});

test('tree route still draws after insertion', () => {
  const context = {
    clearRect: jest.fn(), fillText: jest.fn(), stroke: jest.fn(),
    beginPath: jest.fn(), arc: jest.fn(), closePath: jest.fn(),
    fill: jest.fn(), moveTo: jest.fn(), lineTo: jest.fn(),
  };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  window.history.replaceState({}, '', '/asd/ds/tree');
  render(<App />);
  expect(context.fillText).toHaveBeenCalledWith('tree is empty', expect.any(Number), expect.any(Number));
  fireEvent.change(screen.getByRole('textbox'), {target: {value: '10'}});
  fireEvent.click(screen.getByRole('button', {name: 'Insert'}));
  expect(context.arc).toHaveBeenCalled();
  expect(context.fillText).toHaveBeenCalledWith('10', expect.any(Number), expect.any(Number));
});
