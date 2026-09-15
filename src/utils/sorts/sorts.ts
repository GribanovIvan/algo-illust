import { SortFunc, SortArray, RenderFunc } from "../types/sort.types";
import isSorted from "../isSorted";

// Per-call state, so that simultaneous sorts do not share counters
type SortState = {
  isASC: boolean;
  steps: number;
  render?: RenderFunc;
};

export const bubbleSort: SortFunc = async (arr,  isASC, render) => {
  const len = arr.length;
  let steps = 0;
  let checked;
  do {
    checked = false;
    for (let i = 0; i < len; i++) {
      if ((arr[i] > arr[i + 1] && isASC) || (arr[i] < arr[i + 1] && !isASC)) {
        if (render)  await render([...arr], {green: [i, i + 1]});      
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        checked = true;
        steps++;
      }
    }
  } while (checked);
  return steps;
};

export const selectionSort: SortFunc = async (arr, isASC, render) => {
  const len = arr.length;
  let steps = 0;
  for (let i = 0; i < len; i++) {
    let control = i;
    for (let j = i + 1; j < len; j++) {
      if (
        (arr[j] < arr[control] && isASC) ||
        (arr[j] > arr[control] && !isASC)
      ) {
        control = j;
      }
    }
    if (i !== control) {
      if (render) await render([...arr], {green: [i], orange: [control]});
      [arr[i], arr[control]] = [arr[control], arr[i]];
      steps++;
    }
  }
  return steps;
};

export const shellSort: SortFunc = async (arr, isASC, render) => {
  let steps = 0;
  for (
    let gap = Math.floor(arr.length / 2);
    gap > 0;
    gap = Math.floor(gap / 2)
  ) {
    for (let j = gap; j < arr.length; j++) {
      for (let i = j - gap; i >= 0; i -= gap) {
        if ((isASC && arr[i + gap] < arr[i] )|| (!isASC && arr[i + gap] > arr[i])) {
          if (render) await render([...arr], {green: [i, i + gap]});
          [arr[i + gap], arr[i]] = [arr[i], arr[i + gap]];
          steps++;
        } else break;
      }
    }
  }
  if (render) await render([...arr]);
  return steps;
}

export const quickSort: SortFunc = async (arr, isASC, render) => {
  const state: SortState = { isASC, steps: 0, render };
  await quickSortLocal(arr, 0, arr.length - 1, state);
  return state.steps;
};

export const mergeSort: SortFunc = async (arr, isASC, render) => {
  const state: SortState = { isASC, steps: 0, render };
  const len = arr.length;
  let currSize;
  let leftStart;

  for (currSize = 1; currSize <= len - 1; currSize = 2 * currSize) {
    for (leftStart = 0; leftStart < len - 1; leftStart += 2 * currSize) {
      const mid = Math.min(leftStart + currSize - 1, len - 1);
      const rightEnd = Math.min(leftStart + 2 * currSize - 1, len - 1);
      await merge(arr, leftStart, mid, rightEnd, state);
      state.steps++;
    }
  }
  return state.steps;
}

export const countingSort: SortFunc = async (arr, isASC, render) => {
  if (!arr.every(Number.isInteger)) {
    throw new Error("Counting sort works only with integers");
  }
  const numbers = arr as number[];
  let steps = 0;
  const len = numbers.length;
  const max = numbers.reduce((a, b) => Math.max(a, b), -Infinity);
  const min = numbers.reduce((a, b) => Math.min(a, b), Infinity);
  const count = new Array(max - min + 1).fill(0);
  for (let i = 0; i < len; i++) {
    count[numbers[i] - min]++;
  }
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  const sorted = new Array(len).fill(0);
  let index;
  for (let i = len - 1; i >= 0; i--) {
    index = isASC ? (--count[numbers[i] - min]) : ((len - 1) - (--count[numbers[i] - min]));
    sorted[index] = numbers[i];
    steps++;
    if (render) await render([...sorted], {green: [index]});
  }
  sorted.forEach((value, i) => { arr[i] = value; });
  return steps;
};

async function partition (
  items: SortArray,
  left: number,
  right: number,
  state: SortState
) {
  const { isASC, render } = state;
  if (Array.isArray(items[0])) {
    let matrix = [...(items as number[][])];
    let pivot = matrix[Math.floor((right + left) / 2)][0]; //middle elemen
    let i = left; //left pointer
    let j = right; //right pointer
    while (i <= j) {
      while (matrix[i][0] < pivot) {
        i++;
      }
      while (matrix[j][0] > pivot) {
        j--;
      }
      if (i <= j) {
        // swap
        [matrix[i], matrix[j]] = [matrix[j], matrix[i]];
        [items[i], items[j]] = [items[j], items[i]];
        i++; j--;
      }
    }
    return i;
  } else {
    const pivotIndex = Math.floor((right + left) / 2);
    const pivot = items[pivotIndex]; //middle element
    let i = left; //left pointer
    let j = right; //right pointer
    while (i <= j) {
      while ((isASC && items[i] < pivot) || (!isASC && items[i] > pivot)) {
        i++;
      }
      while ((isASC && items[j] > pivot) || (!isASC && items[j] < pivot)) {
        j--;
      }
      if (i <= j) {
        [items[i], items[j]] = [items[j], items[i]];
        const indexes = new Array(right - left + 1).fill(0).map((_, i) => i + left);
        if (render) await render([...items], {green: indexes, orange: [pivotIndex]});
        state.steps++;
        i++; j--;
      }
    }
    return i;
  }
}

async function quickSortLocal (
  items: SortArray,
  left: number,
  right: number,
  state: SortState
) {
  let index;
  if (items.length > 1 && !isSorted(items, state.isASC)) {
    index = await partition(items, left, right, state);
    if (left < index - 1) {
      await quickSortLocal(items, left, index - 1, state);
    }
    if (index < right) {
      await quickSortLocal(items, index, right, state);
    }
  }
  return items;
}

async function merge (
  arr: SortArray,
  left: number,
  mid: number,
  right: number,
  { isASC, render }: SortState
) {
  let i, j, k;
  let len1 = mid - left + 1;
  let len2 = right - mid;

  let leftArray = arr.slice(left, mid + 1);
  let rightArray = arr.slice(mid + 1, right + 1);

  i = 0; j = 0; k = left;
  while (i < len1 && j < len2) {
    if ((isASC && leftArray[i] <= rightArray[j]) || (!isASC && leftArray[i] > rightArray[j])) {
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

  const indexes = new Array(right - left + 1).fill(0).map((_, i) => i + left);
  if (render) await render([...arr], {green: indexes, orange: [left, right]});
}

export const heapSort: SortFunc = async (arr, isASC, render) => {
  let steps = 0;
  // max-heap for ascending order, min-heap for descending
  const outOfOrder = (parent: number, child: number) =>
    isASC ? arr[child] > arr[parent] : arr[child] < arr[parent];

  const siftDown = async (root: number, size: number) => {
    while (2 * root + 1 < size) {
      let target = 2 * root + 1;
      if (target + 1 < size && outOfOrder(target, target + 1)) target++;
      if (!outOfOrder(root, target)) return;
      if (render) await render([...arr], {green: [root, target]});
      [arr[root], arr[target]] = [arr[target], arr[root]];
      steps++;
      root = target;
    }
  };

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    await siftDown(i, arr.length);
  }
  for (let end = arr.length - 1; end > 0; end--) {
    if (render) await render([...arr], {green: [0], orange: [end]});
    [arr[0], arr[end]] = [arr[end], arr[0]];
    steps++;
    await siftDown(0, end);
  }
  if (render) await render([...arr]);
  return steps;
};
