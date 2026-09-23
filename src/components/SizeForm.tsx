import { useId, useState } from 'react';
import { MAX_ARRAY_LENGTH, validateLength } from '../utils/sorts/parseArray';
import styles from './Form.module.scss';

type SizeFormProps = {
  onLengthSubmit: (length: number) => void;
  max?: number;
  disabled?: boolean;
};

const SizeForm = ({ onLengthSubmit, max = MAX_ARRAY_LENGTH, disabled = false }: SizeFormProps) => {
  const id = useId();
  const [error, setError] = useState('');
  return (
    <form className={styles.form} noValidate onSubmit={event => {
      event.preventDefault();
      if (disabled) return;
      try {
        const length = Number(new FormData(event.currentTarget).get('arrayLength'));
        validateLength(length, max);
        setError('');
        onLengthSubmit(length);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Некоректний розмір.');
      }
    }}>
      <span>
        <label htmlFor={id}>Array Length:</label>
        <input id={id} name="arrayLength" placeholder="length" type="number" defaultValue="10"
          min={2} max={max} step={1} disabled={disabled} aria-invalid={!!error} />
      </span>
      <input type="submit" value="Run" title="Start" disabled={disabled} />
      {error && <span role="alert">{error}</span>}
    </form>
  );
};

export default SizeForm;
