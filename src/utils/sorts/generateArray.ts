import { findLastIndex } from "../findLastIndex";
import generateRandomArray from "../randomArrays";

// This functions are needed for my university. You can use just random numbers (by choosing "rand" for var)

const getRandomUser = async () => {
  const response = await fetch("https://randomuser.me/api/");
  if (!response.ok) {
    throw new Error(`randomuser.me responded with ${response.status}`);
  }
  const { results } = await response.json();
  if (!Array.isArray(results) || !results[0]?.name || !results[0]?.location) {
    throw new Error("Unexpected response from randomuser.me");
  }
  return results[0];
};

const getName = async () => (await getRandomUser()).name.first;

const getCity = async () => (await getRandomUser()).location.city;

const generateArray = async (length: number, variant: number) => {
  console.log("Generating array...");
  let array: number[] = generateRandomArray(length, 100);
  switch (variant) {
    case 0:
      array = generateRandomArray(length, 100);
      return array;
    case 1:
      array = Array.from(
        { length },
        () => Math.round(Math.random() * 1000) / 10
      );
      const max = Math.max(...array);
      const min = Math.min(...array);
      const arrayWithoutMaxMin = array.filter((el) => el !== max && el !== min);
      return arrayWithoutMaxMin;
    case 2:
      // too hard and i'm too lazy
      return array;
    case 3:
      array = Array.from(
        { length },
        () => Math.floor(Math.random() * 1000) / 10
      );
      const arrayEven = array.filter(el => ((el * 10 % 10 === 0) ? el : el * 10 % 2) === 0);
      const arrayWithSqrt = arrayEven.map((el) => Math.round(Math.sqrt(Math.abs(el - 10)) * 10) / 10) ;
      return arrayWithSqrt;
    case 4:
      // mb later
      return array;
    case 8:
      const names = (await Promise.all(
        Array(length).fill(0).map(getName)
      )) as string[];
      console.log("Names: ", names);
      return names;
    case 9:
      array = Array.from(
        { length },
        () =>
          (Math.round(Math.random() * 1000) / 10) *
          (Math.floor(Math.random() * 10) % 2 === 0 ? 1 : -1)
      );
      console.log("Array: ", array);
      const firstNegative = array.findIndex((el) => el < 0);
      const lastNegative = findLastIndex(array, (el) => el < 0);
      console.log("First negative: ", firstNegative);
      console.log("Last negative: ", lastNegative);
      const resultArray = firstNegative === -1 ? [] : array.slice(firstNegative + 1, lastNegative);
      console.log("Sliced array: ", resultArray);
      return resultArray;
    case 10:
      const secondArray = generateRandomArray(length, 100)
      const result = array
        .filter((num) => num % 2 !== 0)
        .concat(secondArray.filter((num) => num % 2 === 0));
      return result;
    case 11:
      let matrix_ = Array.from({ length: length }, () => generateRandomArray(length, 100));
      return matrix_;
    case 12:
      array = Array.from(
        { length },
        () => Math.round(Math.random() * 1000) / 10
      );
      console.log("Random array", array);
      const maxIndex = array.indexOf(Math.max(...array));
      const arrayAfterMax = array.slice(maxIndex);
      console.log("Array after max: ", arrayAfterMax);
      return arrayAfterMax;
    case 13:
      array = generateRandomArray(length, 10, true);
      const arrayWithoutMultiples = array.filter((item) => item % 3 !== 0);
      console.log("Array without multiples: ", arrayWithoutMultiples);
      const arrayWithPower2 = arrayWithoutMultiples.map((item) => Math.floor((item) * (item) * 100) / 100);
      console.log("Array with power 2: ", arrayWithPower2);
      return arrayWithPower2;
    case 14:
      const cities = (await Promise.all(
        Array(length).fill(0).map(getCity)
      )) as string[];
      const shortCities = cities.filter((item) => item.length < 8);
      console.log("Cities: ", shortCities);
      return shortCities;
    case 15:
      const matrix = Array.from({ length: length }, () => generateRandomArray(length, 100));
      console.log("Matrix: ", matrix);
      return matrix;
    case 16:
      array = Array.from(
        { length },
        () =>
          (Math.round(Math.random() * 100) / 10) *
          (Math.floor(Math.random() * 10) % 2 === 0 ? 1 : -1)
      );
      const minEl = Math.min(...array);
      const arrayWithMin = array.map((item) =>
        Math.round((item < 0 ? item * minEl : item ) * 10) / 10
      );
      return arrayWithMin;
    case 17:
      const arrayWithTg = array.map((item) =>
        Math.round(item % 2 === 0 ? Math.tan(item) - item : Math.abs(item) * 10) / 10
      );
      return arrayWithTg;
  }
  return array;
};

export default generateArray;
