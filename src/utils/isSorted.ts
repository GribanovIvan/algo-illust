import { SortArray } from './types/sort.types';
import { sortValue } from './sorts/sorts';

function isSorted(arr: SortArray, asc: boolean): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    const current = sortValue(arr[i]);
    const next = sortValue(arr[i + 1]);
    if (asc ? current > next : current < next) return false;
  }
  return true;
}

export default isSorted;
