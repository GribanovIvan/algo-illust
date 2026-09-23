import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { generateArray8, processArray12 } from '../../utils/searches/generateArray';
import { binarySearch } from '../../utils/searches/searches';
import createAnimation from '../../utils/animation';
import styles from './Search.module.scss';

// the variants look for zeros: variant 8 in the rows of a matrix, variant 12 to replace them
const TARGET = 0;

const where = (found: number[]) => found.length === 1
  ? `position ${found[0] + 1}` : `positions ${found.map(index => index + 1).join(', ')}`;

const Binary = () => {
  const [[array], variant]: [[number[], (arr: number[]) => void], number] = useOutletContext();
  const [display, setDisplay] = useState(array);
  const [active, setActive] = useState(-1);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const isLarge = display.length > 30;

  useEffect(() => {
    const animation = createAnimation(array.length > 30 ? 300 : 1000);
    setError('');
    setResult('');
    setActive(-1);
    const search = async (row: number[], value: number) => {
      setDisplay(row);
      const [found] = await binarySearch(row, value, async index => {
        if (animation.cancelled) throw new Error('Animation cancelled');
        setActive(index);
        await animation.wait();
      });
      return found;
    };
    const run = async () => {
      try {
        if (variant === 8) {
          const rows = generateArray8();
          for (let row = 0; row < rows.length; row++) {
            if (animation.cancelled) return;
            const found = await search(rows[row], TARGET);
            if (animation.cancelled) return;
            if (found !== null) {
              setResult(`Found ${TARGET} in row ${row + 1} at ${where(found)}`);
              return;
            }
          }
          setResult(`${TARGET} not found in any row`);
        } else {
          const found = await search(array, TARGET);
          if (animation.cancelled) return;
          setResult(found ? `Found ${TARGET} at ${where(found)}` : `${TARGET} not found`);
          if (variant === 12) processArray12(array, found || []);
        }
      } catch (error) {
        if (!animation.cancelled) setError(error instanceof Error ? error.message : 'Search failed.');
      }
    };
    void run();
    return () => animation.cancel();
  }, [array, variant]);

  return <div className={styles.layout}>
    {error && <p role="alert">{error}</p>}
    {result && <p role="status" className={styles.result}>{result}</p>}
    <div className={`${styles['search-array']} ${isLarge ? styles.large : ''}`}>
      {display.map((item, index) => <div key={index} className={index === active ? styles.active : ''}>{item}</div>)}
    </div>
  </div>;
};

export default Binary;
