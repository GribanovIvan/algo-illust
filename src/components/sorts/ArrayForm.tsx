import { useState } from 'react';
import parseArray from '../../utils/sorts/parseArray';
import styles from './ArrayForm.module.scss';

const ArrayForm = ({onArraySubmit}: {onArraySubmit: (array: number[]) => void}) => {
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
        />
      </span>
      <input type="submit" value="Sort" title="Sort own array" />
      {error && <span role="alert" className={styles.error}>{error}</span>}
    </form>
  )
}

export default ArrayForm;
