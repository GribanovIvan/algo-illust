import generateRandomArray from "../randomArrays";

const startSorting = () => {
  type SortTypeId =
  | "bubble"
  | "selection"
  | "shell"
  | "quick"
  | "merge"
  | "counting"
  | "heap";

  const sorts = {
    bubble: bubbleSort,
    selection: selectionSort,
    shell: shellSort,
    merge: mergeSort,
    quick: quickSort,
    counting: countingSort,
    heap: heapSort
  }

  onmessage = async (message) => {
    const data = message.data;
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

  function shellSort(arr: number[]) {
    let steps = 0;
    const start = performance.now();
    let gap = Math.floor(arr.length / 2);
    while (gap > 0) {
      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i];
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

  function mergeSort(arr: number[]) {
    let steps = 0;
    const len = arr.length;
    let currSize;
    let leftStart;
    const start = performance.now();

    for (currSize = 1; currSize <= len - 1; currSize = 2 * currSize) {
      for (leftStart = 0; leftStart < len - 1; leftStart += 2 * currSize) {
        const mid = Math.min(leftStart + currSize - 1, len - 1);
        const rightEnd = Math.min(leftStart + 2 * currSize - 1, len - 1);
        merge(arr, leftStart, mid, rightEnd);
      }
    }
    const end = performance.now();
    const sorted = isSorted(arr);
    return {sortId: "merge", steps, name: "Merge Sort", time: Math.floor((end - start) * 100) / 100, sorted};

    function merge(mergeArr: number[], left: number, mid: number, right: number) {
      let i, j, k;
      const len1 = mid - left + 1;
      const len2 = right - mid;

      const leftArray = mergeArr.slice(left, mid + 1);
      const rightArray = mergeArr.slice(mid + 1, right + 1);

      i = 0; j = 0; k = left;
      while (i < len1 && j < len2) {
        steps++;
        if (leftArray[i] <= rightArray[j]) {
          mergeArr[k] = leftArray[i];
          i++;
        } else {
          mergeArr[k] = rightArray[j];
          j++;
        }
        k++;
      }

      while (i < len1) {
        mergeArr[k] = leftArray[i];
        i++; k++;
      }

      while (j < len2) {
        mergeArr[k] = rightArray[j];
        j++; k++;
      }
    }
  }

  function quickSort(arr: number[]) {
    let steps = 0;
    const start = performance.now();
    const result = quickSortRecursive(arr);
    const end = performance.now();
    const sorted = isSorted(result);
    return {sortId: "quick", steps, name: "Quick Sort", time: Math.floor((end - start) * 100) / 100, sorted};

    function quickSortRecursive(qArr: number[]): number[] {
      if (qArr.length <= 1 || isSorted(qArr)) {
        return qArr;
      }
      const pivot = qArr[0];
      const left: number[] = [];
      const right: number[] = [];
      for (let i = 1; i < qArr.length; i++) {
        steps++;
        qArr[i] < pivot ? left.push(qArr[i]) : right.push(qArr[i]);
      }
      return quickSortRecursive(left).concat(pivot, quickSortRecursive(right));
    }
  }

  function countingSort(arr: number[]) {
    let steps = 0;
    const start = performance.now();
    let max = 0;
    const min = 0;
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
      let count = num;
      while (count > 0) {
        steps++;
        arr[sortedIndex++] = i + min;
        count--;
      }
    });
    const end = performance.now();
    const sorted = isSorted(arr);
    return {sortId: "counting", steps, name: "Counting Sort", time: Math.floor((end - start) * 100) / 100, sorted};
  }

  function heapSort(arr: number[]) {
    let steps = 0;
    const start = performance.now();
    const n = arr.length;

    function heapify(heapArr: number[], size: number, i: number) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < size && heapArr[left] > heapArr[largest]) {
        largest = left;
      }
      if (right < size && heapArr[right] > heapArr[largest]) {
        largest = right;
      }
      if (largest !== i) {
        [heapArr[i], heapArr[largest]] = [heapArr[largest], heapArr[i]];
        steps++;
        heapify(heapArr, size, largest);
      }
    }

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      steps++;
      heapify(arr, i, 0);
    }

    const end = performance.now();
    const sorted = isSorted(arr);
    return {sortId: "heap", steps, name: "Heap Sort", time: Math.floor((end - start) * 100) / 100, sorted};
  }
};

export default startSorting;