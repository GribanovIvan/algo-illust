import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DataStructuresPage from '../src/pages/DataStructuresPage';
import DataStructure from '../src/components/data_structures/DataStructure';
import Tree from '../src/components/data_structures/Tree';

const context = {
  clearRect: jest.fn(), fillText: jest.fn(), stroke: jest.fn(),
  beginPath: jest.fn(), arc: jest.fn(), closePath: jest.fn(),
  fill: jest.fn(), moveTo: jest.fn(), lineTo: jest.fn(),
};

beforeEach(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
});

function mount(id: string) {
  return render(<MemoryRouter initialEntries={[`/ds/${id}`]}>
    <Routes><Route path="/ds" element={<DataStructuresPage />}>
      {['stack', 'queue', 'deque', 'linked-list', 'doubly-linked', 'circular-linked'].map(id =>
        <Route key={id} path={id} element={<DataStructure />} />)}
      <Route path="tree" element={<Tree />} />
    </Route></Routes>
  </MemoryRouter>);
}

function add(value: string) {
  const input = screen.getByPlaceholderText('Enter to add el');
  fireEvent.change(input, {target: {value}});
  fireEvent.keyDown(input, {key: 'Enter'});
}

test('invalid elements are explained on the page instead of an alert', () => {
  mount('stack');
  add('abc');
  expect(screen.getByRole('alert')).toHaveTextContent('Strings are not allowed');
  add('5');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  add('a');
  expect(screen.getByRole('alert')).toHaveTextContent('Only numbers OR chars allowed');
  expect(window.alert).not.toHaveBeenCalled();
});

test('the tree reports a duplicate key on the page', () => {
  mount('tree');
  const input = screen.getByRole('textbox');
  fireEvent.change(input, {target: {value: '10'}});
  fireEvent.click(screen.getByRole('button', {name: 'Insert'}));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Insert'}));
  expect(screen.getByRole('alert')).toHaveTextContent('key 10 is already in the tree');
  fireEvent.change(input, {target: {value: '11'}});
  fireEvent.click(screen.getByRole('button', {name: 'Insert'}));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(window.alert).not.toHaveBeenCalled();
});

const items = (view: ReturnType<typeof mount>) =>
  [...view.container.querySelectorAll('[data-value]')].map(item => item.getAttribute('data-value'));

test.each([
  ['stack', [0], ['1', '2', '3'], 2, ['1', '2']],
  ['queue', [2], ['1', '2', '3'], 0, ['2', '3']],
  ['deque', [1], ['1', '2', '3'], 2, ['1', '2']],
  ['linked-list', [], ['1', '2', '3'], 1, ['1', '3']],
])('%s only lets its removable elements be clicked away', (id, blocked, start, removable, after) => {
  const view = mount(id as string);
  ['1', '2', '3'].forEach(add);
  expect(items(view)).toEqual(start);
  const elements = () => view.container.querySelectorAll('[data-value]');
  (blocked as number[]).forEach(index => fireEvent.click(elements()[index]));
  expect(items(view)).toEqual(start);
  fireEvent.click(elements()[removable as number]);
  expect(items(view)).toEqual(after);
});

test('duplicates and a thirteenth element are not added', () => {
  const view = mount('stack');
  add('7');
  add('7');
  expect(items(view)).toEqual(['7']);
  for (let value = 10; value < 30; value++) add(String(value));
  expect(items(view)).toHaveLength(12);
});

test('the dice adds a random element', () => {
  jest.spyOn(Math, 'random').mockReturnValue(.42);
  const view = mount('queue');
  fireEvent.click(view.container.querySelector('header > span > svg')!);
  expect(items(view)).toEqual(['42']);
});

test('statistics are shown for the current structure and cleared by a change', () => {
  jest.spyOn(Math, 'random').mockReturnValue(.5);
  const view = mount('doubly-linked');
  ['4', '9', '1', '6'].forEach(add);
  fireEvent.change(screen.getByLabelText('Find:'), {target: {value: '1'}});
  fireEvent.click(screen.getByRole('button', {name: 'Start'}));
  const footer = view.container.querySelector('footer')!;
  expect(footer).toHaveTextContent('Length: 4');
  expect(footer).toHaveTextContent('Searching: 1, Found: 2');
  expect(footer).toHaveTextContent('Min: 1, Max: 9');
  add('3');
  expect(footer).toHaveTextContent('');
});

test('the character tree accepts single letters only and reports duplicates', () => {
  mount('tree');
  fireEvent.click(screen.getByRole('checkbox'));
  const input = screen.getByRole('textbox');
  for (const value of ['ab', '1', ' ']) {
    fireEvent.change(input, {target: {value}});
    fireEvent.click(screen.getByRole('button', {name: 'Insert'}));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  }
  fireEvent.change(input, {target: {value: 'q'}});
  fireEvent.click(screen.getByRole('button', {name: 'Insert'}));
  expect(context.fillText).toHaveBeenCalledWith('q', expect.any(Number), expect.any(Number));
  fireEvent.click(screen.getByRole('button', {name: 'Insert'}));
  expect(screen.getByRole('alert')).toHaveTextContent('key q is already in the tree');
});
