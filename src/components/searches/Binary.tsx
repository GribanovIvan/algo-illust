import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { generateArray8, processArray12 } from '../../utils/searches/generateArray';
import { binarySearch } from '../../utils/searches/searches';
import createAnimation from '../../utils/animation';
import styles from './Search.module.scss';

const Binary = () => {
  const [[array], variant]: [[number[], (arr: number[]) => void], number] = useOutletContext();
  const [display, setDisplay] = useState(array);
  const [active, setActive] = useState(-1);
  const [error, setError] = useState('');
  const isLarge = display.length > 30;

  useEffect(() => {
    const animation = createAnimation(array.length > 30 ? 300 : 1000);
    setError('');
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
          for (const row of generateArray8()) {
            if (animation.cancelled) return;
            if (await search(row, 0) !== null) break;
          }
        } else {
          const found = await search(array, 0);
          if (!animation.cancelled && variant === 12) processArray12(array, found || []);
        }
      } catch (error) {
        if (!animation.cancelled) setError(error instanceof Error ? error.message : 'Помилка пошуку.');
      }
    };
    void run();
    return () => animation.cancel();
  }, [array, variant]);

  return <>
    {error && <p role="alert">{error}</p>}
    <div className={`${styles['search-array']} ${isLarge ? styles.large : ''}`}>
      {display.map((item, index) => <div key={index} className={index === active ? styles.active : ''}>{item}</div>)}
    </div>
  </>;
};

export default Binary;
