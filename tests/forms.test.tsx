import { fireEvent, render, screen } from '@testing-library/react';
import ArrayForm from '../src/components/sorts/ArrayForm';
import SizeForm from '../src/components/SizeForm';
import { validInputs, invalidInputs } from './fixtures/arrays';
import styles from '../src/components/Form.module.scss';

test('size form attaches the CSS module to its label, input and submit container', () => {
  render(<SizeForm onLengthSubmit={jest.fn()} />);
  const input = screen.getByLabelText('Array Length:');
  const form = input.closest('form');
  expect(form).toHaveClass(styles.form);
  expect(form).toContainElement(screen.getByRole('button', {name: 'Run'}));
  expect(form).toContainElement(screen.getByText('Array Length:'));
});

test.each([
  ['', 'Enter numbers separated by commas or spaces.'],
  ['1', 'Enter between 2 and 200 elements.'],
  ['1 cat', '“cat” is not a valid number.'],
  ['1 1e999', 'Numbers must be finite.'],
  ['1'.repeat(10001), 'Input is too long (maximum 10000 characters).'],
])('custom array validation uses English for %s', (value, message) => {
  render(<ArrayForm onArraySubmit={jest.fn()} />);
  fireEvent.change(screen.getByLabelText('Custom array (2–200 numbers):'), {target: {value}});
  fireEvent.click(screen.getByRole('button', {name: 'Sort array'}));
  expect(screen.getByRole('alert')).toHaveTextContent(message);
});

test('custom array fallback error uses English', () => {
  render(<ArrayForm onArraySubmit={() => { throw null; }} />);
  fireEvent.change(screen.getByLabelText('Custom array (2–200 numbers):'), {target: {value: '2 1'}});
  fireEvent.click(screen.getByRole('button', {name: 'Sort array'}));
  expect(screen.getByRole('alert')).toHaveTextContent('Could not read the array.');
});

test('size fallback error uses English', () => {
  render(<SizeForm onLengthSubmit={() => { throw null; }} />);
  fireEvent.click(screen.getByRole('button', {name: 'Run'}));
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid size.');
});

describe('Normal values', () => {
  test.each(validInputs)('submits $text', ({ text, array }) => {
    const submit = jest.fn();
    render(<ArrayForm onArraySubmit={submit} />);
    fireEvent.change(screen.getByLabelText(/Custom array/), { target: { value: text } });
    fireEvent.click(screen.getByRole('button', {name: 'Sort array'}));
    expect(submit).toHaveBeenCalledWith(array);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('Boundary values', () => {
  test('disabled form cannot launch another sort', () => {
    const submit = jest.fn();
    const { container } = render(<ArrayForm onArraySubmit={submit} disabled />);
    fireEvent.submit(container.querySelector('form')!);
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });
  test('size form accepts maximum', () => {
    const submit = jest.fn();
    render(<SizeForm onLengthSubmit={submit} max={5000} />);
    fireEvent.change(screen.getByLabelText('Array Length:'), { target: {value: '5000'} });
    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(submit).toHaveBeenCalledWith(5000);
  });
});

describe('Exceptional cases', () => {
  test.each(invalidInputs)('shows error without launching for %s', text => {
    const submit = jest.fn();
    render(<ArrayForm onArraySubmit={submit} />);
    fireEvent.change(screen.getByLabelText(/Custom array/), { target: {value: text} });
    fireEvent.click(screen.getByRole('button', {name: 'Sort array'}));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).not.toBeEmptyDOMElement();
  });
  test.each(['', '1', '2.5', '201'])('size form rejects %s', value => {
    const submit = jest.fn();
    render(<SizeForm onLengthSubmit={submit} />);
    fireEvent.change(screen.getByLabelText('Array Length:'), {target: {value}});
    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('between 2 and 200');
  });
});
