import generateRandomArray from "../randomArrays";

const startSorting = () => {
  let STEPS = 0;

  type SortTypeId =
  | "bubble"
  | "selection"
  | "shell"
  | "heap"
  | "quick"
  | "merge"
  | "counting";

  const sorts = {
    bubble: bubbleSort,
    selection: selectionSort,
    shell: shellSort,
    heap: heapSort,
    merge: mergeSort,
    quick: quickSort,
    counting: countingSort
  }

  onmessage = async (message) => {
    const data = message.data;
    console.log('Message received from main script', data);
    const arr = generateRandomArray(data.length, 100);

    data.sorts.forEach((sort: any) => {
      if (sort === 'all') {
        Object.keys(sorts).forEach((key) => {
          const sortFn = sorts[key as SortTypeId];
          const stats = sortFn([...arr]);
          postMessage(stats);
        });
      } else {
        const stats = sorts[sort as SortTypeId]([...arr]);
        postMessage(stats);
      }
    });

  };

  function isSorted(arr: number[]): boolean {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  function bubbleSort(arr: number[]) {
    let steps = 0;
    let sorted = false;
    const start = performance.now();
    while (!sorted) {
      if (steps % 10000 === 0) {
        console.log('steps', steps);
      }
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

  function selectionSort(arr: number[]) {
    let steps = 0;
    const start = performance.now();
    const len = arr.length;
    let percent = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (percent !== (percent = Math.floor((i / len) * 100)) && percent % 10 === 0) console.log(`selectionSort: ${percent}%`);
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

  function shellSort(arr: number[]) {
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

  function heapSort(arr: number[]) {
    let steps = 0;
    const start = performance.now();
    const len = arr.length;

    function siftDown(n: number, i: number) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n) {
        steps++;
        if (arr[left] > arr[largest]) largest = left;
      }
      if (right < n) {
        steps++;
        if (arr[right] > arr[largest]) largest = right;
      }
      if (largest !== i) {
        steps++;
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        siftDown(n, largest);
      }
    }

    for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
      siftDown(len, i);
    }
    for (let i = len - 1; i > 0; i--) {
      steps++;
      [arr[0], arr[i]] = [arr[i], arr[0]];
      siftDown(i, 0);
    }

    const end = performance.now();
    const sorted = isSorted(arr);
    return {
      sortId: "heap" as SortTypeId,
      steps,
      name: "Heap Sort",
      time: Math.floor((end - start) * 100) / 100,
      sorted
    };
  }

  function mergeSort(arr: number[]) {
    console.log("mergeSort started");
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

  function quickSort(arr: number[]) {
    STEPS = 0;
    const start = performance.now();
    const result = quickSortRecursive(arr);
    const end = performance.now();
    const sorted = isSorted(result);
    return {sortId: "quick", steps: STEPS, name: "Quick Sort", time: Math.floor((end - start) * 100) / 100, sorted};
  }

  function countingSort(arr: number[]) {
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

  function quickSortRecursive(arr: number[]): any {
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
  };

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

};

if (typeof self !== "undefined" && typeof window === "undefined") {
  startSorting();
}

export default startSorting;