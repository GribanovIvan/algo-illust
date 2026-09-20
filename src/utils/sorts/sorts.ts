import { SortFunc, SortArray, RenderFunc } from "../types/sort.types";

export const bubbleSort: SortFunc = async (arr, isASC, render) => {
  console.log("bubbleSort started");
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
      if (i === len - 1 && render) await render([...arr]);
    }
  } while (checked);
  return steps;
};

export const selectionSort: SortFunc = async (arr, isASC, render) => {
  console.log("selectionSort started");
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
    if (i === len - 1 && render) await render([...arr]);
  }
  return steps;
};

export const shellSort: SortFunc = async (arr, isASC, render) => {
  console.log("shellSort started");
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
  console.log("quickSort started");
  const counter = { steps: 0 };
  if (arr.length > 1) {
    await quickSortLocal(arr, 0, arr.length - 1, isASC, counter, render);
  }
  if (render) await render([...arr]);
  return counter.steps;
};

export const mergeSort: SortFunc = async (arr, isASC, render) => {
  console.log("mergeSort started");
  let steps = 0;
  const len = arr.length;
  let currSize;
  let leftStart;

  for (currSize = 1; currSize <= len - 1; currSize = 2 * currSize) {
    for (leftStart = 0; leftStart < len - 1; leftStart += 2 * currSize) {
      const mid = Math.min(leftStart + currSize - 1, len - 1);
      const rightEnd = Math.min(leftStart + 2 * currSize - 1, len - 1);
      await merge(arr, leftStart, mid, rightEnd, isASC, render);
      steps++;
    }
  }
  return steps;
};

export const countingSort: SortFunc = async (arr, isASC, render) => {
  console.log("countingSort started");
  const len = arr.length;
  if (len <= 1) {
    if (render) await render([...arr]);
    return 0;
  }
  if (Array.isArray(arr[0]) || typeof arr[0] === "string") {
    throw new Error("Counting sort can only be used with numbers");
  }
  let steps = 0;
  const numArr = arr as number[];
  if (numArr.some((num) => !Number.isInteger(num))) {
    throw new Error("Counting sort only works with integers");
  }
  const max = Math.max(...numArr);
  const min = Math.min(...numArr);
  if (max - min > 100000) {
    throw new Error("Counting sort range is too large for memory limits");
  }
  const count = new Array(max - min + 1).fill(0);
  for (let i = 0; i < len; i++) {
    count[numArr[i] - min]++;
  }
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  const sorted = new Array(len).fill(0);
  let index;
  for (let i = len - 1; i >= 0; i--) {
    index = isASC
      ? --count[numArr[i] - min]
      : len - 1 - --count[numArr[i] - min];
    sorted[index] = numArr[i];
    steps++;
    if (render) await render([...sorted], { green: [index] });
  }
  for (let i = 0; i < len; i++) {
    arr[i] = sorted[i];
  }
  return steps;
};

type StepCounter = { steps: number };

function partitionMatrix(
  items: SortArray,
  left: number,
  right: number,
  isASC: boolean,
  counter: StepCounter
) {
  const matrix = items as number[][];
  const pivot = matrix[Math.floor((right + left) / 2)][0];
  let i = left;
  let j = right;
  while (i <= j) {
    while (isASC ? matrix[i][0] < pivot : matrix[i][0] > pivot) {
      i++;
    }
    while (isASC ? matrix[j][0] > pivot : matrix[j][0] < pivot) {
      j--;
    }
    if (i <= j) {
      [matrix[i], matrix[j]] = [matrix[j], matrix[i]];
      counter.steps++;
      i++;
      j--;
    }
  }
  return i;
}

async function partitionFlat(
  items: SortArray,
  left: number,
  right: number,
  isASC: boolean,
  counter: StepCounter,
  render?: RenderFunc
) {
  const pivotIndex = Math.floor((right + left) / 2);
  const pivot = items[pivotIndex];
  let i = left;
  let j = right;
  while (i <= j) {
    while ((isASC && items[i] < pivot) || (!isASC && items[i] > pivot)) {
      i++;
    }
    while ((isASC && items[j] > pivot) || (!isASC && items[j] < pivot)) {
      j--;
    }
    if (i <= j) {
      [items[i], items[j]] = [items[j], items[i]];
      const indexes = new Array(right - left + 1)
        .fill(0)
        .map((_, idx) => idx + left);
      if (render) {
        await render([...items], {
          green: indexes,
          orange: [pivotIndex],
        });
      }
      counter.steps++;
      i++;
      j--;
    }
  }
  return i;
}

async function partition(
  items: SortArray,
  left: number,
  right: number,
  isASC: boolean,
  counter: StepCounter,
  render?: RenderFunc
) {
  if (Array.isArray(items[0])) {
    return partitionMatrix(items, left, right, isASC, counter);
  }
  return partitionFlat(items, left, right, isASC, counter, render);
}

async function quickSortLocal(
  items: SortArray,
  left: number,
  right: number,
  isASC: boolean,
  counter: StepCounter,
  render?: RenderFunc
) {
  if (left < right) {
    const index = await partition(items, left, right, isASC, counter, render);
    if (left < index - 1) {
      await quickSortLocal(items, left, index - 1, isASC, counter, render);
    }
    if (index < right) {
      await quickSortLocal(items, index, right, isASC, counter, render);
    }
  }
  return items;
}

async function merge(
  arr: SortArray,
  left: number,
  mid: number,
  right: number,
  isASC: boolean,
  render?: RenderFunc
) {
  let i, j, k;
  const len1 = mid - left + 1;
  const len2 = right - mid;

  const leftArray = arr.slice(left, mid + 1);
  const rightArray = arr.slice(mid + 1, right + 1);

  i = 0;
  j = 0;
  k = left;
  while (i < len1 && j < len2) {
    if (
      (isASC && leftArray[i] <= rightArray[j]) ||
      (!isASC && leftArray[i] > rightArray[j])
    ) {
      arr[k] = leftArray[i];
      i++;
    } else {
      arr[k] = rightArray[j];
      j++;
    }
    k++;
  }

  while (i < len1) {
    arr[k] = leftArray[i];
    i++;
    k++;
  }

  while (j < len2) {
    arr[k] = rightArray[j];
    j++;
    k++;
  }

  const indexes = new Array(right - left + 1)
    .fill(0)
    .map((_, idx) => idx + left);
  if (render) {
    await render([...arr], { green: indexes, orange: [left, right] });
  }
}

function compareElements(a: any, b: any, isASC: boolean) {
  const valA = Array.isArray(a) ? a[0] : a;
  const valB = Array.isArray(b) ? b[0] : b;
  return isASC ? valA > valB : valA < valB;
}

async function heapify(
  arr: SortArray,
  n: number,
  i: number,
  isASC: boolean,
  counter: StepCounter,
  render?: RenderFunc
) {
  let extreme = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    counter.steps++;
    if (render) await render([...arr], { green: [left, extreme] });
    if (compareElements(arr[left], arr[extreme], isASC)) {
      extreme = left;
    }
  }

  if (right < n) {
    counter.steps++;
    if (render) await render([...arr], { green: [right, extreme] });
    if (compareElements(arr[right], arr[extreme], isASC)) {
      extreme = right;
    }
  }

  if (extreme !== i) {
    counter.steps++;
    [arr[i], arr[extreme]] = [arr[extreme], arr[i]];
    if (render) await render([...arr], { orange: [i, extreme] });
    await heapify(arr, n, extreme, isASC, counter, render);
  }
}

export const heapSort: SortFunc = async (arr, isASC, render) => {
  console.log("heapSort started");
  const len = arr.length;
  if (len <= 1) {
    if (render) await render([...arr]);
    return 0;
  }
  const counter = { steps: 0 };

  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    await heapify(arr, len, i, isASC, counter, render);
  }

  for (let i = len - 1; i > 0; i--) {
    counter.steps++;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    if (render) await render([...arr], { orange: [0, i] });
    await heapify(arr, i, 0, isASC, counter, render);
  }

  if (render) await render([...arr]);
  return counter.steps;
};
