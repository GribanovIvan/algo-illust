import NavBar from "../components/navigations/SortNavBar";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { HighlightedElements, SortArray, SortTypeId } from "../utils/types/sort.types";
import styles from "./SortPage.module.scss";
import generateArray from "../utils/sorts/generateArray";
import Params from "../components/sorts/Params";
import ArrayForm from "../components/sorts/ArrayForm";
import { validateLength } from "../utils/sorts/parseArray";
import SizeForm from "../components/SizeForm";


const SortPage = () => {
  const [array, setArray] = useState<SortArray>([]);
  const [swappingElements, setSwappingElements] = useState<HighlightedElements>({});
  const [illustDelay, setIllustDelay] = useState<number>(250);
  const sortType = useLocation().pathname.split("/").pop() as SortTypeId;
  const [error, setError] = useState("");
  const [isASC, setIsASC] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [variant, setVariant] = useState<number>(0);

  const onLengthSubmit = async (length: number) => {
    if (isSorting || loading) return;
    setError("");
    setLoading(true);
    try {
      validateLength(length);
      const generated = await generateArray(length, variant);
      if (!generated.length) throw new Error("Цей варіант створив порожній масив. Спробуйте ще раз.");
      setArray(generated as SortArray);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Не вдалося створити масив.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <NavBar type={sortType} />
        <span>
          <button
            className={`${styles.sortWay} ${!isASC && styles.checked}`}
            disabled={isSorting || loading}
            onClick={() => setIsASC(!isASC)}
            title={`Sort in ${isASC ? "ascending" : "descending"} order`}
          >
            {isASC ? "Asc" : "Desc"}
          </button>
          <Params setIllustDelay={setIllustDelay} setVariant={setVariant} disabled={isSorting || loading} />
        </span>
      </header>
      <span className='centerX'>
          <SizeForm onLengthSubmit={onLengthSubmit} disabled={isSorting || loading} />
      </span>
      <div className='centerX'><ArrayForm onArraySubmit={setArray} disabled={isSorting || loading} /></div>
      {error && <p role="alert">{error}</p>}
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