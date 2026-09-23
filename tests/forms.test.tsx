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

describe('Нормальні значення', () => {
  test.each(validInputs)('submits $text', ({ text, array }) => {
    const submit = jest.fn();
    render(<ArrayForm onArraySubmit={submit} />);
    fireEvent.change(screen.getByLabelText(/Власний масив/), { target: { value: text } });
    fireEvent.click(screen.getByRole('button', {name: 'Сортувати масив'}));
    expect(submit).toHaveBeenCalledWith(array);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('Граничні значення', () => {
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

describe('Виняткові ситуації', () => {
  test.each(invalidInputs)('shows error without launching for %s', text => {
    const submit = jest.fn();
    render(<ArrayForm onArraySubmit={submit} />);
    fireEvent.change(screen.getByLabelText(/Власний масив/), { target: {value: text} });
    fireEvent.click(screen.getByRole('button', {name: 'Сортувати масив'}));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).not.toBeEmptyDOMElement();
  });
  test.each(['', '1', '2.5', '201'])('size form rejects %s', value => {
    const submit = jest.fn();
    render(<SizeForm onLengthSubmit={submit} />);
    fireEvent.change(screen.getByLabelText('Array Length:'), {target: {value}});
    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('від 2 до 200');
  });
});
