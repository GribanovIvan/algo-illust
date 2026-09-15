import { SortStats } from "../utils/types/sort.types";
import { SORTS } from "../utils/sorts/sortList";

export const normalArrays: Record<string, number[]> = {
  random: [5, 3, 8, 1, 9, 2],
  withDuplicates: [4, 1, 4, 2, 1, 3],
  withNegatives: [-3, 7, 0, -10, 2],
};

export const boundaryArrays: Record<string, number[]> = {
  empty: [],
  single: [42],
  pair: [2, 1],
  sortedAsc: [1, 2, 3, 4, 5],
  sortedDesc: [5, 4, 3, 2, 1],
  allEqual: [7, 7, 7, 7],
  extremes: [100, -100, 0, 100, -100],
};

export const nonIntegerArrays = {
  decimals: [1.5, 0.5, 2],
  strings: ["b", "a"],
};

export const benchmarkStats: SortStats[] = SORTS.map((sort, i) => ({
  sortId: sort.id,
  name: sort.name,
  steps: 10 * (i + 1),
  time: i / 10,
  sorted: true,
}));
