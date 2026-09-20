import NavBar from "../components/navigations/SortNavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { HighlightedElements, SortArray, SortTypeId } from "../utils/types/sort.types";
import styles from "./SortPage.module.scss";
import generateArray from "../utils/sorts/generateArray";
import Params from "../components/sorts/Params";
import SizeForm from "../components/SizeForm";
import CustomArrayForm from "../components/sorts/CustomArrayForm";

const validSortTypes: SortTypeId[] = [
  "bubble",
  "selection",
  "shell",
  "heap",
  "merge",
  "quick",
  "counting",
  "compare",
];

const SortPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const sortType: SortTypeId = validSortTypes.includes(lastSegment as SortTypeId)
    ? (lastSegment as SortTypeId)
    : "bubble";

  const setSortType = (newType: SortTypeId) => {
    if (newType === "compare") {
      navigate("/sort/compare");
    } else {
      navigate(`/sort/${newType}`);
    }
  };

  const [array, setArray] = useState<SortArray>([]);
  const [swappingElements, setSwappingElements] = useState<HighlightedElements>({});
  const [illustDelay, setIllustDelay] = useState<number>(250);
  const [isASC, setIsASC] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [variant, setVariant] = useState<number>(0);

  const onLengthSubmit = async (length: number) => {
    if (!isSorting) {
      setLoading(true);
      const array = await generateArray(length, variant);
      setLoading(false);
      setArray(array as SortArray);
    } else {
      alert("Please wait for the current sorting to finish.");
    }
  };

  const onCustomArraySubmit = (customArray: number[]) => {
    if (!isSorting) {
      setSwappingElements({});
      setArray([...customArray]);
    } else {
      alert("Please wait for the current sorting to finish.");
    }
  };

  return (
    <>
      <header>
        <NavBar type={sortType} setType={setSortType} />
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
          <SizeForm onLengthSubmit={onLengthSubmit} />
      </span>
      <span className='centerX'>
          <CustomArrayForm onCustomArraySubmit={onCustomArraySubmit} disabled={isSorting} />
      </span>
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