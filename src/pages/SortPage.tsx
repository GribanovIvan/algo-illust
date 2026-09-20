import NavBar from "../components/navigations/SortNavBar";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { HighlightedElements, SortArray, SortTypeId } from "../utils/types/sort.types";
import styles from "./SortPage.module.scss";
import generateArray from "../utils/sorts/generateArray";
import Params, { DEFAULT_DELAY } from "../components/sorts/Params";
import SizeForm from "../components/SizeForm";
import ArrayForm from "../components/sorts/ArrayForm";
import routeId from "../utils/routeId";


const SortPage = () => {
  const [array, setArray] = useState<SortArray>([]);
  const [swappingElements, setSwappingElements] = useState<HighlightedElements>({});
  const [illustDelay, setIllustDelay] = useState<number>(DEFAULT_DELAY);
  const sortType = routeId(useLocation().pathname) as SortTypeId;
  const [isASC, setIsASC] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [variant, setVariant] = useState<number>(0);

  // the forms are disabled while sorting, so the handlers never run at that time
  const onLengthSubmit = async (length: number) => {
    setLoading(true);
    setError("");
    try {
      setArray(await generateArray(length, variant) as SortArray);
    } catch (e) {
      setError(`Failed to generate array: ${e instanceof Error ? e.message : e}`);
    } finally {
      setLoading(false);
    }
  };

  const onArraySubmit = (array: number[]) => {
    setArray(array);
  };

  return (
    <>
      <header>
        <NavBar type={sortType} />
        <span>
          <button
            className={`${styles.sortWay} ${!isASC && styles.checked}`}
            onClick={() => setIsASC(!isASC)}
            title={`Sort in ${isASC ? "ascending" : "descending"} order`}
          >
            {isASC ? "Asc" : "Desc"}
          </button>
          <Params setIllustDelay={setIllustDelay} setVariant={setVariant} />
        </span>
      </header>
      <span className='centerX'>
          <SizeForm onLengthSubmit={onLengthSubmit} disabled={isSorting} />
          <ArrayForm onArraySubmit={onArraySubmit} disabled={isSorting} />
      </span>
      {error && <span role="alert" className={styles.status}>{error}</span>}
      {loading ?
        <span className={styles.status}>Fetching data...</span> 
      : <Outlet context={[
          [array, setArray],
          [isSorting, setIsSorting],
          [swappingElements, setSwappingElements],
          isASC,
          illustDelay
        ]} />}
    </>
  );
};

export default SortPage;