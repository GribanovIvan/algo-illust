import { SortStats, SortTypeId } from "../types/sort.types";

// Synchronous versions of the sorts for the comparison table; steps count comparisons
export type BenchmarkSortId = Exclude<SortTypeId, "compare">;

let STEPS = 0;

function isSorted(arr: number[]): boolean {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

function bubbleSort(arr: number[]): SortStats {
  let steps = 0;
  let sorted = false;
  const start = performance.now();
  while (!sorted) {
    sorted = true;
    for (let i = 0; i < arr.length - 1; i++) {
      steps++;
      if (arr[i] > arr[i + 1]) {
        sorted = false;
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
  }
  const end = performance.now();
  sorted = isSorted(arr);
  return {sortId: "bubble", steps, name: "Bubble Sort", time: Math.floor((end - start) * 10) / 10, sorted}
}

function selectionSort(arr: number[]): SortStats {
  let steps = 0;
  const start = performance.now();
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      steps++;
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
  const end = performance.now();
  const sorted = isSorted(arr);
  return {sortId: "selection", steps, name: "Selection Sort", time: Math.floor((end - start) * 100) / 100, sorted};
}

function shellSort(arr: number[]): SortStats {
  let steps = 0;
  const start = performance.now();
  let gap = Math.floor(arr.length / 2);
  while (gap > 0) {
    for (let i = gap; i < arr.length; i++) {
      let temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        steps++;
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  const end = performance.now();
  const sorted = isSorted(arr);
  return {sortId: "shell", steps, name: "Shell Sort", time: Math.floor((end - start) * 100) / 100, sorted};
}

function mergeSort(arr: number[]): SortStats {
  STEPS = 0;
  const len = arr.length;
  let currSize;
  let leftStart;
  let start = performance.now();

  for (currSize = 1; currSize <= len - 1; currSize = 2 * currSize) {
    for (leftStart = 0; leftStart < len - 1; leftStart += 2 * currSize) {
      const mid = Math.min(leftStart + currSize - 1, len - 1);
      const rightEnd = Math.min(leftStart + 2 * currSize - 1, len - 1);
      merge(arr, leftStart, mid, rightEnd);
    }
  }
  const end = performance.now();
  const sorted = isSorted(arr);
  return {sortId: "merge", steps: STEPS, name: "Merge Sort", time: Math.floor((end - start) * 100) / 100, sorted};
}

function quickSort(arr: number[]): SortStats {
  STEPS = 0;
  const start = performance.now();
  const result = quickSortRecursive(arr);
  const end = performance.now();
  const sorted = isSorted(result);
  return {sortId: "quick", steps: STEPS, name: "Quick Sort", time: Math.floor((end - start) * 100) / 100, sorted};
}

function countingSort(arr: number[]): SortStats {
  STEPS = 0;
  const start = performance.now();
  const min = 0;
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  const countArr = new Array(max - min + 1).fill(0);
  arr.forEach((num) => {
    countArr[num - min]++;
  });
  let sortedIndex = 0;
  countArr.forEach((num, i) => {
    while (num > 0) {
      STEPS++;
      arr[sortedIndex++] = i + min;
      num--;
    }
  });
  const end = performance.now();
  const sorted = isSorted(arr);
  return {sortId: "counting", steps: STEPS, name: "Counting Sort", time: Math.floor((end - start) * 100) / 100, sorted};
}

function heapSort(arr: number[]): SortStats {
  STEPS = 0;
  const start = performance.now();
  const siftDown = (root: number, size: number) => {
    while (2 * root + 1 < size) {
      let target = 2 * root + 1;
      STEPS++;
      if (target + 1 < size && arr[target + 1] > arr[target]) target++;
      if (arr[root] >= arr[target]) return;
      [arr[root], arr[target]] = [arr[target], arr[root]];
      root = target;
    }
  };
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    siftDown(i, arr.length);
  }
  for (let end = arr.length - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(0, end);
  }
  const end = performance.now();
  const sorted = isSorted(arr);
  return {sortId: "heap", steps: STEPS, name: "Heap Sort", time: Math.floor((end - start) * 100) / 100, sorted};
}

function quickSortRecursive(arr: number[]): number[] {
  if (arr.length <= 1 || isSorted(arr)) {
    return arr;
  }
  const pivot = arr[0];
  const left = []; 
  const right = [];
  for (let i = 1; i < arr.length; i++) {
    STEPS++;
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
  }
  return quickSortRecursive(left).concat(pivot, quickSortRecursive(right));
}

function merge(arr: number[],
  left: number,
  mid: number,
  right: number) {
  let i, j, k;
  let len1 = mid - left + 1;
  let len2 = right - mid;

  let leftArray = arr.slice(left, mid + 1);
  let rightArray = arr.slice(mid + 1, right + 1);

  i = 0; j = 0; k = left;
  while (i < len1 && j < len2) {
    STEPS++;
    if (leftArray[i] <= rightArray[j]) {
      arr[k] = leftArray[i];
      i++;
    } else {
      arr[k] = rightArray[j];
      j++;
    }
    k++;
  }

  // Copy the remaining elements of L, if there are any
  while (i < len1) {
    arr[k] = leftArray[i];
    i++; k++;
  }

  // Copy the remaining elements of R, if there are any
  while (j < len2) {
    arr[k] = rightArray[j];
    j++; k++;
  }
}

const benchmarkSorts: Record<BenchmarkSortId, (arr: number[]) => SortStats> = {
  bubble: bubbleSort,
  selection: selectionSort,
  shell: shellSort,
  merge: mergeSort,
  quick: quickSort,
  counting: countingSort,
  heap: heapSort
};

export default benchmarkSorts;
