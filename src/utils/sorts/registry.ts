import { SortFunc, SortType } from '../types/sort.types';
import { bubbleSort, selectionSort, shellSort, mergeSort, quickSort, countingSort, heapSort } from './sorts';

export const sorts: SortType[] = [
  { id: 'bubble', name: 'Bubble Sort' },
  { id: 'selection', name: 'Selection Sort' },
  { id: 'shell', name: 'Shell Sort' },
  { id: 'merge', name: 'Merge Sort' },
  { id: 'quick', name: 'Quick Sort' },
  { id: 'counting', name: 'Counting Sort' },
  { id: 'heap', name: 'Heap Sort' },
];

export const sortFunctions: Record<Exclude<SortType['id'], 'compare'>, SortFunc> = {
  bubble: bubbleSort, selection: selectionSort, shell: shellSort,
  merge: mergeSort, quick: quickSort, counting: countingSort, heap: heapSort,
};
