import generateRandomArray from "../randomArrays";

export const generateArray8 = () => {
    console.log("VARIANT 8");
    const matrix = Array.from({length: 5}, () => generateRandomArray(4, 10, true));
    console.log("Table: ", matrix.map((row) => [...row]));
    // binary search needs sorted rows, so sort them here and not as a side effect of the log
    matrix.forEach((row) => row.sort((a, b) => a - b));
    console.log("Sorted: ", matrix);
    return matrix;
}

export const processArray12 = (array: number[], found: number[]) => {
  const negativeAbs = array.reduce((acc, cur) => acc + (cur < 0 ? Math.abs(cur) : 0), 0);
  console.log("Absolute sum of negative values: ", negativeAbs);
  const arrayWithoutZeros = array.map((item, index) => found.includes(index) ? negativeAbs : item );
  console.log("Result: ", arrayWithoutZeros);
}