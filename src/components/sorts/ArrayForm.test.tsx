import { fireEvent, render, screen } from '@testing-library/react';
import { invalidInputs, validInputs } from '../../__fixtures__/arrayInputs';
import ArrayForm from './ArrayForm';

const submit = (value: string) => {
  fireEvent.change(screen.getByLabelText('Own array:'), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Sort' }));
};

describe('ArrayForm', () => {
  test.each(validInputs)('passes parsed numbers for "$input"', ({ input, expected }) => {
    const onArraySubmit = jest.fn();
    render(<ArrayForm onArraySubmit={onArraySubmit} />);
    submit(input);
    expect(onArraySubmit).toHaveBeenCalledWith(expected);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test.each(invalidInputs)('shows an error and does not sort for input #%#', ({ input, error }) => {
    const onArraySubmit = jest.fn();
    render(<ArrayForm onArraySubmit={onArraySubmit} />);
    submit(input);
    expect(onArraySubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(error);
    expect(screen.getByLabelText('Own array:')).toHaveAttribute('aria-invalid', 'true');
  });

  test('blocks the input and the button while disabled', () => {
    render(<ArrayForm onArraySubmit={jest.fn()} disabled />);
    expect(screen.getByLabelText('Own array:')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sort' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sort' }))
      .toHaveAttribute('title', 'Please wait for the current sorting to finish');
  });

  test('clears the error after a valid submit', () => {
    render(<ArrayForm onArraySubmit={jest.fn()} />);
    submit('');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    submit('2 1');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
