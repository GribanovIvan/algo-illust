import generateRandomArray from '../randomArrays';
import isSorted from '../isSorted';
import { SortStats } from '../types/sort.types';
import { sortFunctions, sorts } from './registry';
import { MAX_BENCHMARK_LENGTH, validateLength } from './parseArray';

export type BenchmarkRequest = { length: number; sorts: string[]; isASC?: boolean };
export type BenchmarkMessage = SortStats | { error: string };

export async function benchmark(data: BenchmarkRequest, report: (message: SortStats) => void) {
  validateLength(data.length, MAX_BENCHMARK_LENGTH);
  if (!Array.isArray(data.sorts) || !data.sorts.length || data.sorts.length > sorts.length ||
      data.sorts.some(id => !sorts.some(sort => sort.id === id))) {
    throw new Error('Select valid algorithms to compare.');
  }
  const source = generateRandomArray(data.length, 100);
  const asc = data.isASC ?? true;
  for (const id of data.sorts) {
    const sortId = id as keyof typeof sortFunctions;
    const array = [...source];
    const start = performance.now();
    const steps = await sortFunctions[sortId](array, asc);
    report({ sortId, steps, name: sorts.find(sort => sort.id === id)!.name,
      time: Math.round((performance.now() - start) * 100) / 100, sorted: isSorted(array, asc) });
  }
}
