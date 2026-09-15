import { SortFunc, SortArray, RenderFunc } from "../types/sort.types";
import isSorted from "../isSorted";

export const bubbleSort: SortFunc = async (arr, isASC, render) => {
  const len = arr.length;
  let steps = 0;
  let checked;
  do {
    checked = false;
    for (let i = 0; i < len; i++) {
      if ((arr[i] > arr[i + 1] && isASC) || (arr[i] < arr[i + 1] && !isASC)) {
        if (render) await render([...arr], { green: [i, i + 1] });
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        checked = true;
        steps++;
      }
      if (i === len - 1 && render) render([...arr]);
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
      if (render) await render([...arr], { green: [i], orange: [control] });
      [arr[i], arr[control]] = [arr[control], arr[i]];
      steps++;
    }
    if (i === len - 1 && render) render([...arr]);
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
        if (
          (isASC && arr[i + gap] < arr[i]) ||
          (!isASC && arr[i + gap] > arr[i])
        ) {
          if (render) await render([...arr], { green: [i, i + gap] });
          [arr[i + gap], arr[i]] = [arr[i], arr[i + gap]];
          steps++;
        } else break;
      }
    }
  }
  if (render) await render([...arr]);
  return steps;
};

export const quickSort: SortFunc = async (arr, isASC, render) => {
  let steps = 0;

  async function partition(
    items: SortArray,
    left: number,
    right: number,
    renderFn?: RenderFunc
  ) {
    if (Array.isArray(items[0])) {
      const matrix = [...(items as number[][])];
      const pivot = matrix[Math.floor((right + left) / 2)][0];
      let i = left;
      let j = right;
      while (i <= j) {
        while (matrix[i][0] < pivot) {
          i++;
        }
        while (matrix[j][0] > pivot) {
          j--;
        }
        if (i <= j) {
          [matrix[i], matrix[j]] = [matrix[j], matrix[i]];
          [items[i], items[j]] = [items[j], items[i]];
          i++;
          j--;
        }
      }
      return i;
    } else {
      const pivotIndex = Math.floor((right + left) / 2);
      const pivot = items[pivotIndex];
      let i = left;
      let j = right;
      while (i <= j) {
        while (
          (isASC && items[i] < pivot) ||
          (!isASC && items[i] > pivot)
        ) {
          i++;
        }
        while (
          (isASC && items[j] > pivot) ||
          (!isASC && items[j] < pivot)
        ) {
          j--;
        }
        if (i <= j) {
          [items[i], items[j]] = [items[j], items[i]];
          const indexes = new Array(right - left + 1)
            .fill(0)
            .map((_, idx) => idx + left);
          if (renderFn)
            await renderFn([...items], {
              green: indexes,
              orange: [pivotIndex],
            });
          steps++;
          i++;
          j--;
        }
      }
      return i;
    }
  }

  async function quickSortLocal(
    items: SortArray,
    left: number,
    right: number,
    renderFn?: RenderFunc
  ) {
    if (items.length > 1 && !isSorted(items, isASC)) {
      const index = await partition(items, left, right, renderFn);
      if (left < index - 1) {
        await quickSortLocal(items, left, index - 1, renderFn);
      }
      if (index < right) {
        await quickSortLocal(items, index, right, renderFn);
      }
    }
    return items;
  }

  await quickSortLocal(arr, 0, arr.length - 1, render);
  return steps;
};

export const mergeSort: SortFunc = async (arr, isASC, render) => {
  let steps = 0;

  async function merge(
    mergeArr: SortArray,
    left: number,
    mid: number,
    right: number,
    renderFn?: RenderFunc
  ) {
    let i: number, j: number, k: number;
    const len1 = mid - left + 1;
    const len2 = right - mid;

    const leftArray = mergeArr.slice(left, mid + 1);
    const rightArray = mergeArr.slice(mid + 1, right + 1);

    i = 0;
    j = 0;
    k = left;
    while (i < len1 && j < len2) {
      if (
        (isASC && leftArray[i] <= rightArray[j]) ||
        (!isASC && leftArray[i] > rightArray[j])
      ) {
        mergeArr[k] = leftArray[i];
        i++;
      } else {
        mergeArr[k] = rightArray[j];
        j++;
      }
      k++;
    }

    // Copy the remaining elements of L, if there are any
    while (i < len1) {
      mergeArr[k] = leftArray[i];
      i++;
      k++;
    }

    // Copy the remaining elements of R, if there are any
    while (j < len2) {
      mergeArr[k] = rightArray[j];
      j++;
      k++;
    }

    const indexes = new Array(right - left + 1)
      .fill(0)
      .map((_, idx) => idx + left);
    if (renderFn)
      await renderFn([...mergeArr], { green: indexes, orange: [left, right] });
  }

  const len = arr.length;
  let currSize: number;
  let leftStart: number;

  for (currSize = 1; currSize <= len - 1; currSize = 2 * currSize) {
    for (leftStart = 0; leftStart < len - 1; leftStart += 2 * currSize) {
      const mid = Math.min(leftStart + currSize - 1, len - 1);
      const rightEnd = Math.min(leftStart + 2 * currSize - 1, len - 1);
      await merge(arr, leftStart, mid, rightEnd, render);
      steps++;
    }
  }
  return steps;
};

export const countingSort: SortFunc = async (arr, isASC, render) => {
  if (Array.isArray(arr[0]) || typeof arr[0] === "string") {
    throw new Error("Counting sort can only be used with numbers");
  }
  let steps = 0;
  const len = arr.length;
  let max = arr[0] as number;
  let min = arr[0] as number;
  for (let i = 1; i < len; i++) {
    if ((arr[i] as number) > max) max = arr[i] as number;
    if ((arr[i] as number) < min) min = arr[i] as number;
  }
  const count = new Array(max - min + 1).fill(0);
  for (let i = 0; i < len; i++) {
    count[(arr[i] as number) - min]++;
  }
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  const sorted = new Array(len).fill(0);
  let index: number;
  for (let i = len - 1; i >= 0; i--) {
    index = isASC
      ? --count[(arr[i] as number) - min]
      : len - 1 - --count[(arr[i] as number) - min];
    sorted[index] = arr[i];
    steps++;
    if (render) await render([...sorted], { green: [index] });
  }
  // Copy sorted result back into arr so the caller sees the final state
  for (let i = 0; i < len; i++) {
    arr[i] = sorted[i];
  }
  return steps;
};

export const heapSort: SortFunc = async (arr, isASC, render) => {
  let steps = 0;
  const len = arr.length;

  function compare(a: number | string | number[], b: number | string | number[]): boolean {
    return isASC ? a > b : a < b;
  }

  async function heapify(
    heapArr: SortArray,
    n: number,
    i: number,
    renderFn?: RenderFunc
  ) {
    let target = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && compare(heapArr[left], heapArr[target])) {
      target = left;
    }
    if (right < n && compare(heapArr[right], heapArr[target])) {
      target = right;
    }
    if (target !== i) {
      if (renderFn)
        await renderFn([...heapArr], { green: [i, target] });
      [heapArr[i], heapArr[target]] = [heapArr[target], heapArr[i]];
      steps++;
      await heapify(heapArr, n, target, renderFn);
    }
  }

  // Build max-heap (or min-heap for descending)
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    await heapify(arr, len, i, render);
  }

  // Extract elements one by one
  for (let i = len - 1; i > 0; i--) {
    if (render) await render([...arr], { green: [0, i] });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps++;
    await heapify(arr, i, 0, render);
  }

  if (render) await render([...arr]);
  return steps;
};
