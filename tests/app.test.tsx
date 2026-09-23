import { act, fireEvent, render, screen } from '@testing-library/react';
import App from '../src/App';
import createBenchmarkWorker from '../src/utils/workerBuilder';
import { createWorkerMock } from './fixtures/worker';
import { routerBase } from '../src/utils/routerBase';

jest.mock('../src/utils/routerBase', () => ({routerBase: '/asd'}));
jest.mock('../src/utils/workerBuilder');

beforeEach(() => {
  jest.replaceProperty(require('../src/utils/routerBase'), 'routerBase', '/asd');
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.mocked(createBenchmarkWorker).mockReturnValue(createWorkerMock() as unknown as Worker);
});
afterEach(() => jest.useRealTimers());

test.each(['/', '/asd', '/qwe'])('renders direct routes and navigation under %s', async prefix => {
  jest.replaceProperty(require('../src/utils/routerBase'), 'routerBase', prefix);
  const base = routerBase === '/' ? '' : routerBase;
  window.history.replaceState({}, '', `${base}/`);
  const home = render(<App />);
  expect(screen.getByRole('heading', {name: 'Algorithms Visualizer'})).toBeVisible();
  home.unmount();
  window.history.replaceState({}, '', `${base}/sort/bubble`);
  render(<App />);
  expect(screen.getByLabelText('Array Length:')).toBeVisible();
  fireEvent.click(screen.getByRole('link', {name: 'Heap Sort'}));
  expect(window.location.pathname).toBe(`${base}/sort/heap`);
  expect(window.location.hash).toBe('');
  await act(async () => {});
});

const routes = [
  ...['bubble', 'selection', 'shell', 'quick', 'merge', 'counting', 'heap'].map(id => [`sort/${id}`, 'Custom array']),
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

test('the comparison page has the sort navigation and a labelled algorithm list', async () => {
  window.history.replaceState({}, '', '/asd/sort/compare');
  render(<App />);
  expect(screen.getByRole('link', {name: 'Comparison'})).toHaveAttribute('href', '/asd/sort/compare');
  expect(screen.getByRole('combobox', {name: 'Algorithms:'})).toHaveValue('all');
  fireEvent.click(screen.getByRole('link', {name: 'Bubble Sort'}));
  expect(window.location.pathname).toBe('/asd/sort/bubble');
  await act(async () => {});
});
