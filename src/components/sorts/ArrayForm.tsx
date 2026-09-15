import { useId, useState } from 'react';
import parseArray from '../../utils/sorts/parseArray';

type ArrayFormProps = {
  onArraySubmit: (array: number[]) => void;
  disabled?: boolean;
};

const ArrayForm = ({ onArraySubmit, disabled = false }: ArrayFormProps) => {
  const id = useId();
  const [error, setError] = useState('');
  return (
    <form onSubmit={event => {
      event.preventDefault();
      if (disabled) return;
      try {
        const input = new FormData(event.currentTarget).get('array')?.toString() || '';
        const array = parseArray(input);
        setError('');
        onArraySubmit(array);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Не вдалося прочитати масив.');
      }
    }}>
      <label htmlFor={id}>Власний масив (2–200 чисел):</label>
      <input id={id} name="array" placeholder="3, -1, 2.5" maxLength={10000}
        disabled={disabled} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      <button type="submit" disabled={disabled}>Сортувати масив</button>
      {error && <span id={`${id}-error`} role="alert">{error}</span>}
    </form>
  );
};

export default ArrayForm;
