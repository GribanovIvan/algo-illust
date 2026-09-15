import { useState } from 'react';
import styles from './Form.module.scss';

const MIN_LENGTH = 2;
const MAX_LENGTH = 200;

type CustomArrayFormProps = {
  onArraySubmit: (array: number[]) => void;
  disabled: boolean;
};

const CustomArrayForm = ({ onArraySubmit, disabled }: CustomArrayFormProps) => {
  const [error, setError] = useState<string>('');

  const parseArray = (input: string): number[] | null => {
    const trimmed = input.trim();
    if (trimmed === '') {
      setError('Введіть масив чисел');
      return null;
    }
    const parts = trimmed.split(/[\s,]+/).filter(Boolean);
    if (parts.length < MIN_LENGTH) {
      setError(`Замало елементів (мінімум ${MIN_LENGTH})`);
      return null;
    }
    if (parts.length > MAX_LENGTH) {
      setError(`Забагато елементів (максимум ${MAX_LENGTH})`);
      return null;
    }
    const numbers: number[] = [];
    for (const part of parts) {
      const num = Number(part);
      if (!Number.isFinite(num)) {
        setError(`"${part}" — не число`);
        return null;
      }
      numbers.push(num);
    }
    setError('');
    return numbers;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const raw = data.get('customArray')?.toString() || '';
    const result = parseArray(raw);
    if (result) {
      onArraySubmit(result);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.customArrayForm}>
      <span>
        <label htmlFor="customArray">Custom array:</label>
        <input
          name="customArray"
          placeholder="1, 5, 3, 8, 2"
          type="text"
          disabled={disabled}
          style={{ width: '12rem' }}
        />
      </span>
      <input type="submit" value="Sort" title="Sort custom array" disabled={disabled} />
      {error && <span className={styles.error} role="alert">{error}</span>}
    </form>
  );
};

export default CustomArrayForm;
