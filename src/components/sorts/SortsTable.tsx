import { useEffect, useRef, useState } from 'react'
import { SortStats, SortTypeId } from '../../utils/types/sort.types';
import styles from './CompareSorts.module.scss';
import SizeForm from '../SizeForm';
import createBenchmarkWorker from '../../utils/sorts/createBenchmarkWorker';
import { SORTS as sorts } from '../../utils/sorts/sortList';

const INITIAL_LENGTH = 10;

const SortsTable = () => {
  const [stats, setStats] = useState<SortStats[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [sortsToRun, setSortsToRun] = useState<SortTypeId[]>(sorts.map(sort => sort.id));
  const [arrayLength, setArrayLength] = useState<number>(INITIAL_LENGTH);
  const worker = useRef<Worker | null>(null);
  const expectedStats = useRef<number>(0);

  const stopWorker = () => {
    worker.current?.terminate();
    worker.current = null;
  };

  useEffect(() => {
    startSorting();
    return stopWorker;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSorting && stats.length === expectedStats.current) {
      stopWorker();
      setIsSorting(false);
    }
  }, [stats, isSorting]);

  // the form is disabled while the comparison runs, so this is only a safety net
  const startSorting = (length?: number) => {
    if (isSorting) return;
    const size = length || arrayLength;
    setIsSorting(true);
    setArrayLength(size);
    setStats([]);
    expectedStats.current = sortsToRun.length;
    stopWorker();
    worker.current = createBenchmarkWorker();
    worker.current.onmessage = (message: MessageEvent<SortStats>) => {
      setStats((prevStats) => [...prevStats, message.data]);
    };
    worker.current.onerror = () => {
      stopWorker();
      setIsSorting(false);
    };
    worker.current.postMessage({length: size, sorts: sortsToRun});
  };

  return (
    <>
      <div>
        <select defaultValue={'all'} name="sorts" id="sorts" onChange={e => {
            if (e.target.value === 'all') {
              setSortsToRun(sorts.map(sort => sort.id));
            } else {
              setSortsToRun([sorts.find(sort => sort.id === e.target.value)?.id || 'bubble']);
            }
          }}>
          <option value="all">All</option>
          {sorts.map((sort) => (
            <option key={sort.id} value={sort.id}>
              {sort.name}
            </option>
          ))}
        </select>
        <SizeForm onLengthSubmit={startSorting} disabled={isSorting} />
      </div>
      <div className={styles.container}>
        <h2>Size: {arrayLength}</h2>
        {stats.length ?
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sort</th>
              <th>Steps</th>
              <th>Time</th>
              <th>isSorted</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.sortId}>
                <td>{stat.sortId}</td>
                <td>{stat.steps}</td>
                <td>{stat.time}</td>
                <td>{stat.sorted ? 'sorted' : 'not sorted'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        : "Sorting..."}
      </div>
      <span className={styles.status}>{isSorting ? "Sorting..." : ""}</span>
    </>
  )
}

export default SortsTable