import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Graph from "./Graph";
import styles from "./SortComponent.module.scss";
import isSorted from "../../utils/isSorted";
import {
  SortArray,
  SortFunc,
  HighlightedElements,
  OutletContextSort,
} from "../../utils/types/sort.types";

const SortComponent = (sort: SortFunc) => {
  const Component = function () {
    const [timeTaken, setTimeTaken] = useState<number>(0);
    const [steps, setSteps] = useState<number>(0);
    const isMounted = useRef(true);

    const [
      arrayState,
      isSortingState,
      swappingElementsState,
      isASC,
      delay,
    ]: OutletContextSort = useOutletContext();
    const [isSorting, setIsSorting] = isSortingState;
    const [array, setArray] = arrayState;
    const [swappingElements, setSwappingElements] = swappingElementsState;

    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    useEffect(() => {
      if (
        !isSorting &&
        array.length > 0 &&
        array.length < 600 &&
        !isSorted(array, isASC)
      ) {
        startSorting();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [array]);

    const startSorting = async () => {
      setIsSorting(true);
      try {
        let totalDelayTime = 0;
        const renderChanges = (arr: SortArray, toSwap?: HighlightedElements) => {
          if (!isMounted.current) return Promise.resolve();
          setArray(arr);
          setSwappingElements(toSwap || {});
          const delayStart = performance.now();
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              totalDelayTime += performance.now() - delayStart;
              resolve();
            }, delay);
          });
        };

        const startTime = performance.now();
        const stepsSpent = await sort([...array], isASC, renderChanges);
        if (!isMounted.current) return;
        const totalElapsed = performance.now() - startTime;
        const sortTime = Math.max(
          0,
          totalElapsed - totalDelayTime
        );
        setSteps(stepsSpent);
        setTimeTaken(Math.round(sortTime * 100) / 100);
        setSwappingElements({ sorted: true });
      } catch (err) {
        console.error("Sorting error:", err);
      } finally {
        if (isMounted.current) {
          setIsSorting(false);
        }
      }
    };

    return (
      <>
        <main className={styles.container}>
          <Graph array={array} swaps={swappingElements} />
        </main>
        <footer className={styles.status}>
          Steps: {steps}. Time taken {timeTaken}ms.
        </footer>
      </>
    );
  };
  return Component;
};

export default SortComponent;
