import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Graph from './Graph';
import styles from './SortComponent.module.scss';
import { SortArray, SortFunc, HighlightedElements, OutletContextSort } from '../../utils/types/sort.types';
import createAnimation from '../../utils/animation';

const SortComponent = (sort: SortFunc) => {
  const Component = function () {
    const [timeTaken, setTimeTaken] = useState(0);
    const [steps, setSteps] = useState(0);
    const [error, setError] = useState('');
    const [[array], [, setIsSorting], , isASC, delay]: OutletContextSort = useOutletContext();
    const [display, setDisplay] = useState<SortArray>(array);
    const [highlighted, setHighlighted] = useState<HighlightedElements>({});

    useEffect(() => {
      const animation = createAnimation(delay);
      setDisplay(array);
      setHighlighted({});
      setError('');
      setSteps(0);
      setTimeTaken(0);
      if (!array.length) return;
      const run = async () => {
        setIsSorting(true);
        const result = [...array];
        const start = performance.now();
        try {
          const spent = await sort(result, isASC, async (frame, elements) => {
            if (animation.cancelled) throw new Error('Animation cancelled');
            setDisplay(frame);
            setHighlighted(elements || {});
            await animation.wait();
          });
          if (!animation.cancelled) {
            setDisplay(result);
            setSteps(spent);
            setTimeTaken(Math.round(Math.max(0, performance.now() - start - animation.waiting) * 100) / 100);
            setHighlighted({ sorted: true });
          }
        } catch (error) {
          if (!animation.cancelled) setError(error instanceof Error ? error.message : 'Sorting failed.');
        } finally {
          if (!animation.cancelled) setIsSorting(false);
        }
      };
      void run();
      return () => { animation.cancel(); setIsSorting(false); };
    }, [array, isASC, delay, setIsSorting]);

    return <>
      {error && <p role="alert">{error}</p>}
      <main className={styles.container}><Graph array={display} swaps={highlighted} /></main>
      <footer className={styles.status}>Steps: {steps}. Time taken {timeTaken}ms.</footer>
    </>;
  };
  return Component;
};

export default SortComponent;
