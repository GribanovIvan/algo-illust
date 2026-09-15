import React, { useEffect, useMemo } from 'react';
import { bmSearch } from '../../utils/searches/searches';
import generateString from '../../utils/searches/generateString';
import styles from './Search.module.scss';
import { useOutletContext } from 'react-router-dom';
import { HighlightedElements, OutletContextSearch } from '../../utils/types/search.types';


const BM = () => {
  const [seatchIn, searchFor, variant]: OutletContextSearch = useOutletContext();
  const [array, setArray] = React.useState<string>('');
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<HighlightedElements>({});
  const isLarge = useMemo(() => array.length > 30, [array.length]);

  useEffect(() => {
    if (!isSearching && array.length > 0 && array.length < 600) {
      startSearching();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [array]);

  useEffect(() => {
    if (seatchIn && searchFor) {
      setArray(seatchIn);
    }
  }, [seatchIn, searchFor]);

  const render = (elements: HighlightedElements) => {
    setActive(elements);
    return new Promise((resolve) => setTimeout(resolve, isLarge ? 300 : 1000));
  };

  const startSearching = async () => {
    const genertedText = generateString(array, variant);
    setArray(genertedText);

    setIsSearching(true);
    try {
      const startTime = performance.now();
      const [found, stepsSpent] = await bmSearch(genertedText, searchFor, render);
      const sortTime = performance.now() - startTime - stepsSpent * 100;
      console.log(found, stepsSpent, sortTime);
      alert(`${found !== null ? "Found at position " + (found + 1) : "Not found"}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className={`${styles['search-array']}  ${isLarge ? styles['large'] : ""}`}>
        {array.split('').map((item, index) => (
          <div key={index} className={`
            ${active?.orange && active.orange?.searchIn === index && styles.orange}  
            ${active?.red && active.red?.searchIn === index && styles.red}
            ${active?.found && active.found.includes(index) && styles.green}
          `}>{item}</div>
        ))}
      </div>
      <div className={`${styles['search-array']}`}>
        {searchFor.split('').map((item, index) => (
          <div key={index} className={`
            ${active?.orange && active.orange?.searchFor === index && styles.orange}
            ${active?.red && active.red?.searchFor === index && styles.red}
            ${active?.found && styles.green}
          `}>{item}</div>
        ))}
      </div>
    </>
    
  )
}

export default BM;