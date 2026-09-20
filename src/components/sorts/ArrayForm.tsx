import { useState } from 'react';
import parseArray from '../../utils/sorts/parseArray';
import styles from './ArrayForm.module.scss';

type ArrayFormProps = {
  onArraySubmit: (array: number[]) => void;
  disabled?: boolean;
}

const ArrayForm = ({onArraySubmit, disabled = false}: ArrayFormProps) => {
  const [error, setError] = useState<string>('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = parseArray(data.get('customArray')?.toString() || '');
    setError(result.error || '');
    if (result.array) onArraySubmit(result.array);
  }

  return (
    <form onSubmit={onSubmit}>
      <span>
        <label htmlFor="customArray">Own array:</label>
        <input
          id="customArray"
          name="customArray"
          className={styles.arrayInput}
          placeholder="5, 3 8 1"
          type="text"
          aria-invalid={error !== ''}
          disabled={disabled}
        />
      </span>
      <input
        type="submit"
        value="Sort"
        title={disabled ? "Please wait for the current sorting to finish" : "Sort own array"}
        disabled={disabled}
      />
      {error && <span role="alert" className={styles.error}>{error}</span>}
    </form>
  )
}

export default ArrayForm;
