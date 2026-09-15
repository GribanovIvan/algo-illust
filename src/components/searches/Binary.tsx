import React, { useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import generateRandomArray from '../../utils/randomArrays';
import { generateArray8, processArray12 } from '../../utils/searches/generateArray';
import { binarySearch } from '../../utils/searches/searches';
import styles from './Search.module.scss';


const Binary = () => {
  const [[array, setArray], variant]: [[number[], (arr: number[]) => void], number] = useOutletContext();
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<number>(0);
  const isLarge = useMemo(() => array.length > 30, [array.length]);

  useEffect(() => {
    if (!isSearching && array.length > 0 && array.length < 600) {
      startSearching();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [array]);


  const render = (index: number) => {
    setActive(index);
    return new Promise((resolve) => setTimeout(resolve, isLarge ? 300 : 1000));
  };

  const startSearching = async () => {
    if (variant === 8) {
      console.log("VARIANT 8");
      const matrix = generateArray8();
      let found = null, i = 0;
      for(i = 0; i < matrix.length; i++) {
        setArray(matrix[i]);
        found = await search(matrix[i], 0);
        if (found !== null) break;
      }
      console.log(found === null ? "Not found" : ("Found on position: " +  found[0] + " " + i));
    } else if (variant === 12) {
      console.log("VARIANT 12");
      console.log(array);
      const found = await search(array, 0);
      console.log(found === null ? "Not found" : ("Found on positions: " +  found));
      processArray12(array, found === null ? [] : found);
    } else {
      setArray(generateRandomArray().sort((a, b) => a - b));
      await search(array, 0);
    }
    
  };

  const search = async (array: number[], value: number) => {
    setIsSearching(true);
    const startTime = performance.now();
    const [found, stepsSpent] = await binarySearch(array, value, render);
    const sortTime = performance.now() - startTime - stepsSpent * 100;
    console.log("Sort time", sortTime);
    // console.log(found, stepsSpent, sortTime);
    // alert(`${found !== null ? "Found at position " + (found + 1) : "Not found"}`);
    setIsSearching(false);
    return found;
  }

  return (
    <div className={`${styles['search-array']}  ${isLarge ? styles['large'] : ""}`}>
      {array.map((item, index) => (
        <div key={index} className={`${index === active ? styles.active : ''}`}>{item}</div>
      ))}
    </div>
  )
}

export default Binary