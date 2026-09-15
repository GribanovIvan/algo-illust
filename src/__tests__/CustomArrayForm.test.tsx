import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomArrayForm from '../components/CustomArrayForm';

describe('CustomArrayForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  // ─── Normal values ─────────────────────────────────────────
  it('submits a valid comma-separated array', () => {
    render(<CustomArrayForm onArraySubmit={mockSubmit} disabled={false} />);
    const input = screen.getByPlaceholderText('1, 5, 3, 8, 2');
    const button = screen.getByTitle('Sort custom array');

    fireEvent.change(input, { target: { value: '10, 20, 30' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith([10, 20, 30]);
  });

  it('submits a valid space-separated array', () => {
    render(<CustomArrayForm onArraySubmit={mockSubmit} disabled={false} />);
    const input = screen.getByPlaceholderText('1, 5, 3, 8, 2');

    fireEvent.change(input, { target: { value: '5 3 8 1' } });
    fireEvent.click(screen.getByTitle('Sort custom array'));

    expect(mockSubmit).toHaveBeenCalledWith([5, 3, 8, 1]);
  });

  // ─── Boundary values ──────────────────────────────────────
  it('rejects an array with only one element (too few)', () => {
    render(<CustomArrayForm onArraySubmit={mockSubmit} disabled={false} />);
    const input = screen.getByPlaceholderText('1, 5, 3, 8, 2');

    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.click(screen.getByTitle('Sort custom array'));

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Замало елементів');
  });

  it('accepts exactly 2 elements (minimum)', () => {
    render(<CustomArrayForm onArraySubmit={mockSubmit} disabled={false} />);
    const input = screen.getByPlaceholderText('1, 5, 3, 8, 2');

    fireEvent.change(input, { target: { value: '1, 2' } });
    fireEvent.click(screen.getByTitle('Sort custom array'));

    expect(mockSubmit).toHaveBeenCalledWith([1, 2]);
  });

  // ─── Exceptional situations ───────────────────────────────
  it('shows error for empty input', () => {
    render(<CustomArrayForm onArraySubmit={mockSubmit} disabled={false} />);
    fireEvent.click(screen.getByTitle('Sort custom array'));

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Введіть масив чисел');
  });

  it('shows error for non-numeric values', () => {
    render(<CustomArrayForm onArraySubmit={mockSubmit} disabled={false} />);
    const input = screen.getByPlaceholderText('1, 5, 3, 8, 2');

    fireEvent.change(input, { target: { value: '1, abc, 3' } });
    fireEvent.click(screen.getByTitle('Sort custom array'));

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('не число');
  });

  it('is disabled when the disabled prop is true', () => {
    render(<CustomArrayForm onArraySubmit={mockSubmit} disabled={true} />);
    const input = screen.getByPlaceholderText('1, 5, 3, 8, 2');
    const button = screen.getByTitle('Sort custom array');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
