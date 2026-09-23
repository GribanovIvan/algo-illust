import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import generateString from '../../utils/searches/generateString';
import createAnimation from '../../utils/animation';
import { HighlightedElements, OutletContextSearch } from '../../utils/types/search.types';
import styles from './Search.module.scss';

type Search = (text: string, target: string, render: (frame: HighlightedElements) => Promise<unknown>) => Promise<[number | null, number]>;

const SearchComponent = (search: Search, delay: number) => {
  const Component = () => {
    const [text, target, variant, request]: OutletContextSearch = useOutletContext();
    const [array, setArray] = useState('');
    const [active, setActive] = useState<HighlightedElements>({});
    const [error, setError] = useState('');
    useEffect(() => {
      const generated = generateString(text, variant);
      const animation = createAnimation(generated.length > 30 ? 300 : delay);
      setArray(generated);
      setActive({});
      setError('');
      if (!target) return;
      const run = async () => {
        try {
          const [found] = await search(generated, target, async frame => {
            if (animation.cancelled) throw new Error('Animation cancelled');
            setActive(frame);
            await animation.wait();
          });
          if (!animation.cancelled) alert(found === null ? 'Not found' : `Found at position ${found + 1}`);
        } catch (error) {
          if (!animation.cancelled) setError(error instanceof Error ? error.message : 'Search failed.');
        }
      };
      void run();
      return () => animation.cancel();
    }, [text, target, variant, request]);

    const characterClass = (index: number, field: 'searchIn' | 'searchFor') => [
      active.orange?.[field] === index ? styles.orange : '',
      active.red?.[field] === index ? styles.red : '',
      (field === 'searchFor' ? !!active.found : active.found?.includes(index)) ? styles.green : '',
    ].join(' ');

    return <>
      {error && <p role="alert">{error}</p>}
      <div className={`${styles['search-array']} ${array.length > 30 ? styles.large : ''}`}>
        {array.split('').map((item, index) => <div key={index} className={characterClass(index, 'searchIn')}>{item}</div>)}
      </div>
      <div className={styles['search-array']}>
        {target.split('').map((item, index) => <div key={index} className={characterClass(index, 'searchFor')}>{item}</div>)}
      </div>
    </>;
  };
  return Component;
};

export default SearchComponent;
