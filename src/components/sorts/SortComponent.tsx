import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Graph from "./Graph";
import styles from "./SortComponent.module.scss";
import isSorted from "../../utils/isSorted";
import { SortFunc, OutletContextSort, RenderFunc } from "../../utils/types/sort.types";

const SortComponent = (sort: SortFunc) => {
  const Component = function () {
    const [timeTaken, setTimeTaken] = useState<number>(0);
    const [steps, setSteps] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const isMounted = useRef<boolean>(false);
    const [
      arrayState,
      isSortingState,
      swappingElementsState,
      isASC,
      delay
    ]: OutletContextSort = useOutletContext();
    const [isSorting, setIsSorting] = isSortingState;
    const [array, setArray] = arrayState;
    const [swappingElements, setSwappingElements] = swappingElementsState;

    useEffect(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
      if (!isSorting && array.length > 0 && array.length < 600 && !isSorted(array, isASC)) {
        startSorting();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [array]);

    const startSorting = async () => {
      setIsSorting(true);
      setError("");
      let animationTime = 0;
      // after unmount the sort finishes instantly without touching the shared array
      const renderChanges: RenderFunc = async (arr, toSwap) => {
        if (!isMounted.current) return;
        setArray(arr);
        setSwappingElements(toSwap || {});
        const waitStart = performance.now();
        await new Promise((resolve) => setTimeout(resolve, delay));
        animationTime += performance.now() - waitStart;
      };
      try {
        const startTime = performance.now();
        const stepsSpent = await sort([...array], isASC, renderChanges);
        if (!isMounted.current) return;
        const sortTime = performance.now() - startTime - animationTime;
        setSteps(stepsSpent);
        setTimeTaken(Math.round(sortTime * 100) / 100);
        setSwappingElements({ sorted: true });
      } catch (e) {
        if (isMounted.current) setError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsSorting(false);
      }
    };

    return (
      <>
        <main className={styles.container}>
          <Graph array={array} swaps={swappingElements} />
        </main>
        <footer className={styles.status}>
          {error ? <span role="alert">{error}</span> : `Steps: ${steps}. Time taken ${timeTaken}ms.`}
        </footer>
      </>
    );
  };
  return Component;
};

export default SortComponent;
