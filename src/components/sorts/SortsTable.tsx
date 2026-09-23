import { useCallback, useEffect, useRef, useState } from 'react';
import { SortStats, SortTypeId } from '../../utils/types/sort.types';
import { BenchmarkMessage } from '../../utils/sorts/benchmark';
import { sorts } from '../../utils/sorts/registry';
import { MAX_BENCHMARK_LENGTH, validateLength } from '../../utils/sorts/parseArray';
import styles from './CompareSorts.module.scss';
import SizeForm from '../SizeForm';
import createBenchmarkWorker from '../../utils/workerBuilder';

const INITIAL_LENGTH = 10;

const SortsTable = () => {
  const [stats, setStats] = useState<SortStats[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [error, setError] = useState('');
  const [sortsToRun, setSortsToRun] = useState<SortTypeId[]>(sorts.map(sort => sort.id));
  const [arrayLength, setArrayLength] = useState(INITIAL_LENGTH);
  const worker = useRef<Worker | null>(null);

  const startSorting = useCallback((length: number, selected: SortTypeId[]) => {
    worker.current?.terminate();
    worker.current = null;
    setError('');
    setStats([]);
    const fail = (message: string) => {
      setError(message);
      setIsSorting(false);
      worker.current?.terminate();
      worker.current = null;
    };
    try {
      validateLength(length, MAX_BENCHMARK_LENGTH);
      setArrayLength(length);
      setIsSorting(true);
      const instance = createBenchmarkWorker();
      worker.current = instance;
      let received = 0;
      instance.onmessage = (message: MessageEvent<BenchmarkMessage>) => {
        if (worker.current !== instance) return;
        if ('error' in message.data) return fail(message.data.error);
        const stat = message.data;
        setStats(previous => [...previous, stat]);
        if (++received === selected.length) {
          setIsSorting(false);
          instance.terminate();
          worker.current = null;
        }
      };
      instance.onerror = () => {
        if (worker.current === instance) fail('Could not run the comparison. Please try again.');
      };
      instance.onmessageerror = () => {
        if (worker.current === instance) fail('Could not read the worker response.');
      };
      instance.postMessage({ length, sorts: selected });
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Could not create the worker.');
    }
  }, []);

  useEffect(() => {
    startSorting(INITIAL_LENGTH, sorts.map(sort => sort.id));
    return () => { worker.current?.terminate(); worker.current = null; };
  }, [startSorting]);

  return (
    <>
      <div className={styles.controls}>
        <label htmlFor="sorts">Algorithms:</label>
        <select id="sorts" defaultValue="all" name="sorts" disabled={isSorting}
          onChange={event => setSortsToRun(event.target.value === 'all'
            ? sorts.map(sort => sort.id) : [event.target.value as SortTypeId])}>
          <option value="all">All</option>
          {sorts.map(sort => <option key={sort.id} value={sort.id}>{sort.name}</option>)}
        </select>
        <SizeForm onLengthSubmit={length => startSorting(length, sortsToRun)}
          max={MAX_BENCHMARK_LENGTH} disabled={isSorting} />
      </div>
      {error && <p role="alert">{error}</p>}
      <div className={styles.container}>
        <h2>Size: {arrayLength}</h2>
        {!!stats.length && <table className={styles.table}>
          <thead><tr><th>Sort</th><th>Steps</th><th>Time</th><th>isSorted</th></tr></thead>
          <tbody>{stats.map(stat => <tr key={stat.sortId}>
            <td>{stat.sortId}</td><td>{stat.steps}</td><td>{stat.time}</td>
            <td>{stat.sorted ? 'sorted' : 'not sorted'}</td>
          </tr>)}</tbody>
        </table>}
      </div>
      <span className={styles.status}>{isSorting ? 'Sorting...' : ''}</span>
    </>
  );
};

export default SortsTable;
