import { fireEvent, render, screen } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import SizeForm, { MAX_LENGTH, MIN_LENGTH } from './SizeForm';

const submit = (value: string) => {
  fireEvent.change(screen.getByLabelText('Array Length:'), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Run' }));
};

describe('SizeForm', () => {
  test('passes the entered length', () => {
    const onLengthSubmit = jest.fn();
    render(<SizeForm onLengthSubmit={onLengthSubmit} />);
    submit('25');
    expect(onLengthSubmit).toHaveBeenCalledWith(25);
  });

  test.each([`${MIN_LENGTH - 1}`, `${MAX_LENGTH + 1}`, ''])(
    'ignores the length "%s" outside the allowed range',
    (value) => {
      const onLengthSubmit = jest.fn();
      render(<SizeForm onLengthSubmit={onLengthSubmit} />);
      submit(value);
      expect(onLengthSubmit).not.toHaveBeenCalled();
    }
  );

  test('blocks the input and the button while disabled', () => {
    render(<SizeForm onLengthSubmit={jest.fn()} disabled />);
    expect(screen.getByLabelText('Array Length:')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Run' }))
      .toHaveAttribute('title', 'Please wait for the current sorting to finish');
  });
});

describe('form styles', () => {
  const read = (file: string) => fs.readFileSync(path.join(__dirname, file), 'utf8');

  // a CSS module without used classes is dropped from the bundle, so the file stays global
  test('are kept in a global stylesheet imported by both forms', () => {
    expect(fs.existsSync(path.join(__dirname, 'Form.module.scss'))).toBe(false);

    const styles = read('Form.scss');
    expect(styles).toContain('input[type="submit"]');

    [read('SizeForm.tsx'), read('../pages/DataStructuresPage.tsx')].forEach((source) => {
      expect(source).toContain('Form.scss');
      expect(source).not.toContain('Form.module.scss');
    });
  });
});
