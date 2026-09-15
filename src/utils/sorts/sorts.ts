import { SortFunc, SortArray } from '../types/sort.types';

// Matrix variants compare rows by their first value, consistently with isSorted.
export function sortValue(value: SortArray[number]): number | string {
  return Array.isArray(value) ? value[0] : value;
}

function before(a: SortArray[number], b: SortArray[number], asc: boolean) {
  return asc ? sortValue(a) < sortValue(b) : sortValue(a) > sortValue(b);
}

function validateArray(arr: SortArray) {
  for (const item of arr) {
    const value = sortValue(item);
    if (typeof value !== 'string' && !Number.isFinite(value)) {
      throw new Error('Масив має містити скінченні числа або рядки.');
    }
  }
}

export const bubbleSort: SortFunc = async (arr, isASC, render) => {
  validateArray(arr);
  let steps = 0;
  let changed;
  do {
    changed = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (before(arr[i + 1], arr[i], isASC)) {
        if (render) await render([...arr], { green: [i, i + 1] });
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        steps++;
        changed = true;
      }
    }
  } while (changed);
  if (render) await render([...arr]);
  return steps;
};

export const selectionSort: SortFunc = async (arr, isASC, render) => {
  validateArray(arr);
  let steps = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    let control = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (before(arr[j], arr[control], isASC)) control = j;
    }
    if (i !== control) {
      if (render) await render([...arr], { green: [i], orange: [control] });
      [arr[i], arr[control]] = [arr[control], arr[i]];
      steps++;
    }
  }
  if (render) await render([...arr]);
  return steps;
};

export const shellSort: SortFunc = async (arr, isASC, render) => {
  validateArray(arr);
  let steps = 0;
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let j = gap; j < arr.length; j++) {
      for (let i = j - gap; i >= 0 && before(arr[i + gap], arr[i], isASC); i -= gap) {
        if (render) await render([...arr], { green: [i, i + gap] });
        [arr[i + gap], arr[i]] = [arr[i], arr[i + gap]];
        steps++;
      }
    }
  }
  if (render) await render([...arr]);
  return steps;
};

export const quickSort: SortFunc = async (arr, isASC, render) => {
  validateArray(arr);
  let steps = 0;
  const partition = async (left: number, right: number) => {
    const pivotIndex = Math.floor((left + right) / 2);
    const pivot = arr[pivotIndex];
    let i = left;
    let j = right;
    while (i <= j) {
      while (before(arr[i], pivot, isASC)) i++;
      while (before(pivot, arr[j], isASC)) j--;
      if (i <= j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps++;
        if (render) await render([...arr], { green: [i, j], orange: [pivotIndex] });
        i++;
        j--;
      }
    }
    return i;
  };
  // Explicit stack avoids call-stack overflow for adversarial inputs.
  const ranges = [[0, arr.length - 1]];
  while (ranges.length) {
    const [left, right] = ranges.pop()!;
    if (left >= right) continue;
    const index = await partition(left, right);
    if (left < index - 1) ranges.push([left, index - 1]);
    if (index < right) ranges.push([index, right]);
  }
  if (render) await render([...arr]);
  return steps;
};

export const mergeSort: SortFunc = async (arr, isASC, render) => {
  validateArray(arr);
  let steps = 0;
  for (let size = 1; size < arr.length; size *= 2) {
    for (let left = 0; left < arr.length - size; left += 2 * size) {
      const middle = left + size;
      const right = Math.min(left + 2 * size, arr.length);
      const first = arr.slice(left, middle);
      const second = arr.slice(middle, right);
      let i = 0;
      let j = 0;
      for (let k = left; k < right; k++) {
        if (j === second.length || (i < first.length && !before(second[j], first[i], isASC))) {
          arr[k] = first[i++];
        } else {
          arr[k] = second[j++];
        }
      }
      steps++;
      if (render) await render([...arr], {
        green: Array.from({ length: right - left }, (_, index) => left + index),
        orange: [left, right - 1],
      });
    }
  }
  if (render) await render([...arr]);
  return steps;
};

function countingKeys(counts: Map<number, number>, isASC: boolean) {
  const values = Array.from(counts.keys());
  if (!values.length) return values;
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (values.every(Number.isSafeInteger) && max - min <= 10000) {
    const keys = Array.from({ length: max - min + 1 }, (_, index) => min + index)
      .filter(value => counts.has(value));
    return isASC ? keys : keys.reverse();
  }
  // Sparse/fractional domains need ordered keys; their complexity is O(n + k log k).
  return values.sort((a, b) => isASC ? a - b : b - a);
}

export const countingSort: SortFunc = async (arr, isASC, render) => {
  validateArray(arr);
  const counts = new Map<number, number>();
  for (const value of arr) {
    if (typeof value !== 'number') throw new Error('Counting sort підтримує лише числа.');
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  // Sparse counts support fractions and wide ranges without allocating max-min slots.
  const keys = countingKeys(counts, isASC);
  let index = 0;
  for (const value of keys) {
    for (let count = counts.get(value)!; count > 0; count--) {
      arr[index] = value;
      if (render) await render([...arr], { green: [index] });
      index++;
    }
  }
  if (render) await render([...arr]);
  return index;
};

export const heapSort: SortFunc = async (arr, isASC, render) => {
  validateArray(arr);
  let steps = 0;
  const swap = async (a: number, b: number) => {
    if (render) await render([...arr], { green: [a, b] });
    [arr[a], arr[b]] = [arr[b], arr[a]];
    steps++;
  };
  const siftDown = async (root: number, size: number) => {
    while (root * 2 + 1 < size) {
      let child = root * 2 + 1;
      if (child + 1 < size && before(arr[child], arr[child + 1], isASC)) child++;
      if (!before(arr[root], arr[child], isASC)) break;
      await swap(root, child);
      root = child;
    }
  };
  for (let root = Math.floor(arr.length / 2) - 1; root >= 0; root--) {
    await siftDown(root, arr.length);
  }
  for (let end = arr.length - 1; end > 0; end--) {
    await swap(0, end);
    await siftDown(0, end);
  }
  if (render) await render([...arr]);
  return steps;
};
