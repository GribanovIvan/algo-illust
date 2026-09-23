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
      <Route path="stack" element={<DataStructure />} />
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
