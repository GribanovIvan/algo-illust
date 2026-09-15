import { findLastIndex } from "../findLastIndex";
import generateRandomArray from "../randomArrays";

// Local dictionaries keep the teaching variants available offline.
const names = ['Anna', 'Ivan', 'Maria', 'Taras', 'Olena', 'Mark', 'Sofia'];
const cities = ['Lviv', 'Kyiv', 'Odesa', 'Dnipro', 'Warsaw', 'Bratislava'];
const pick = (values: string[]) => values[Math.floor(Math.random() * values.length)];
const getName = () => pick(names);
const getCity = () => pick(cities);

const generateArray = async (length: number, variant: number) => {
  let array: number[] = generateRandomArray(length, 100);
  switch (variant) {
    case 1: {
      array = Array.from(
        { length },
        () => Math.round(Math.random() * 1000) / 10
      );
      const max = Math.max(...array);
      const min = Math.min(...array);
      const arrayWithoutMaxMin = array.filter((el) => el !== max && el !== min);
      return arrayWithoutMaxMin;
    }
    case 3: {
      array = Array.from(
        { length },
        () => Math.floor(Math.random() * 1000) / 10
      );
      const arrayEven = array.filter(el => ((el * 10 % 10 === 0) ? el : el * 10 % 2) === 0);
      const arrayWithSqrt = arrayEven.map((el) => Math.round(Math.sqrt(Math.abs(el - 10)) * 10) / 10) ;
      return arrayWithSqrt;
    }
    case 8: {
      const names = (await Promise.all(
        Array(length).fill(0).map(getName)
      )) as string[];
      return names;
    }
    case 9: {
      array = Array.from(
        { length },
        () =>
          (Math.round(Math.random() * 1000) / 10) *
          (Math.floor(Math.random() * 10) % 2 === 0 ? 1 : -1)
      );
      const firstNegative = array.findIndex((el) => el < 0);
      const lastNegative = findLastIndex(array, (el) => el < 0);
      const resultArray = firstNegative < 0 ? [] : array.slice(firstNegative + 1, lastNegative); 
      return resultArray;
    }
    case 10: {
      const secondArray = generateRandomArray(length, 100)
      const result = array
        .filter((num) => num % 2 !== 0)
        .concat(secondArray.filter((num) => num % 2 === 0));
      return result;
    }
    case 11:
    case 15: {
      const matrix_ = Array.from({ length: length }, () => generateRandomArray(length, 100));
      return matrix_;
    }
    case 12: {
      array = Array.from(
        { length },
        () => Math.round(Math.random() * 1000) / 10
      );
      const maxIndex = array.indexOf(Math.max(...array));
      const arrayAfterMax = array.slice(maxIndex);
      return arrayAfterMax;
    }
    case 13: {
      array = generateRandomArray(length, 10, true);
      const arrayWithoutMultiples = array.filter((item) => item % 3 !== 0);
      const arrayWithPower2 = arrayWithoutMultiples.map((item) => Math.floor((item) * (item) * 100) / 100);
      return arrayWithPower2;
    }
    case 14: {
      const cities = (await Promise.all(
        Array(length).fill(0).map(getCity)
      )) as string[];
      return cities.filter((item) => item.length < 8);
    }
    case 16: {
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
    }
    case 17: {
      const arrayWithTg = array.map((item) =>
        Math.round(item % 2 === 0 ? Math.tan(item) - item : Math.abs(item) * 10) / 10
      );
      return arrayWithTg;
    }
  }
  return array;
};

export default generateArray;
