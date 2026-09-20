import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DiceIcon from "../assets/DiceIcon";
import DSNavBar from "../components/navigations/DSNavBar";
import { DSArray, DSClassMap, DSStats } from "../utils/types/ds.types";
import { DSTypeId } from "../utils/types/ds.types";
import styles from "./DataStructuresPage.module.scss";
import "../components/Form.scss";
import {
  StackDS,
  QueueDS,
  DequeDS,
  LinkedListDS,
  DoublyLinkedListDS,
  CircularListDS,
} from "../utils/types/ds.types";
import testDS from "../utils/data_structures/test";
import { Outlet } from "react-router-dom";

const MAX_RANDOM = 100;

const validDSTypes: DSTypeId[] = [
  "stack",
  "queue",
  "linked-list",
  "doubly-linked",
  "circular-linked",
  "deque",
  "tree",
];

const dsClasses: DSClassMap = {
  stack: StackDS,
  queue: QueueDS,
  deque: DequeDS,
  "linked-list": LinkedListDS,
  "doubly-linked": DoublyLinkedListDS,
  "circular-linked": CircularListDS,
  tree: StackDS,
};

const DataStructuresPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const type: DSTypeId = validDSTypes.includes(lastSegment as DSTypeId)
    ? (lastSegment as DSTypeId)
    : "stack";

  const setType = (newType: DSTypeId) => {
    navigate(`/ds/${newType}`);
  };

  const [array, setArray] = React.useState<DSArray>([]);
  const [stats, setStats] = React.useState<DSStats | null>(null);

  const stringifyStats = (stats: DSStats) => {
    if (!stats) return "";
    return `
      Length: ${stats.length},
      Searching: ${stats.searchValue}, Found: ${
      stats.foundIndex !== null ? stats.foundIndex : "Not Found"
    },
      Min: ${stats.min}, Max: ${stats.max},
      El before min: ${stats.elBeforeMin}, El after max: ${stats.elAfterMax},
      Third from end: ${stats.thirdFromEnd}, Second from start: ${
      stats.secondFromStart
    },
      Merged: ${stats.mergedArray}
    `;
  };

  const checkInput = (value: string | number) => {
    if (array.length > 11 || array.includes(value) || value === "")
      return false;

    if (isNaN(+value) && value.toString().length > 1) {
      alert("Strings are not allowed");
      return false;
    }
    if (
      array.length &&
      ((isNaN(+array[0]) && !isNaN(+value)) ||
        (!isNaN(+array[0]) && isNaN(+value)))
    ) {
      alert("Only numbers OR chars allowed");
      return false;
    }
    return true;
  };

  const randomValue = () => {
    let value = Math.round(Math.random() * MAX_RANDOM),
      i = 0;
    while (array.includes(value) && i < MAX_RANDOM) {
      value = Math.round(Math.random() * MAX_RANDOM);
      i++;
    }
    return value;
  };

  const pushElement = (val: string = "") => {
    const value = val !== "" ? val : randomValue();
    const numberishValue = isNaN(+value) ? value : +value; // converts to number if possible

    if (checkInput(numberishValue)) {
      setStats(null);
      setArray([...array, numberishValue]);
    }
  };

  const runStats = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const toFindData = data.get("toFind")?.toString() || "0";
    const toFind = isNaN(+toFindData) ? toFindData : +toFindData;
    setStats(testDS(array, toFind, dsClasses[type]));
  };

  return (
    <>
      <header>
        <DSNavBar type={type} setType={setType} />
        {type === "tree" ? null : (
          <span>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pushElement(e.currentTarget.value);

                  e.currentTarget.value = "";
                }
              }}
              placeholder="Enter to add el"
            />
            <DiceIcon onClick={() => pushElement()} />
          </span>
        )}
      </header>
      {type === "tree" ? null : (
        <form onSubmit={runStats} className="centerX">
          <span>
            <label htmlFor="toFind">Find:</label>
            <input id="toFind" name="toFind" placeholder="value" defaultValue="1" />
          </span>
          <input type="submit" value="Start" title="Get Stats" />
        </form>
      )}
      <main>
        <Outlet context={[[array, setArray], type, [stats, setStats]]} />
      </main>
      <footer className={styles.bottomRight}>
        {stats && stringifyStats(stats)}
      </footer>
    </>
  );
};

export default DataStructuresPage;
