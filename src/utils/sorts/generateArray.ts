import { findLastIndex } from "../findLastIndex";
import generateRandomArray from "../randomArrays";

const FALLBACK_NAMES = ["Alex", "Ivan", "Olena", "Dmytro", "Anna", "Taras", "Maria", "Yaroslav"];
const FALLBACK_CITIES = ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro", "Poltava", "Ternopil"];

const getName = async (index: number) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch("https://randomuser.me/api/", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Network response not ok");
    const { results } = await response.json();
    return results[0].name.first as string;
  } catch {
    return FALLBACK_NAMES[index % FALLBACK_NAMES.length];
  }
};

const getCity = async (index: number) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch("https://randomuser.me/api/", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Network response not ok");
    const { results } = await response.json();
    return results[0].location.city as string;
  } catch {
    return FALLBACK_CITIES[index % FALLBACK_CITIES.length];
  }
};

type VariantHandler = (length: number, baseArray: number[]) => Promise<any> | any;

const variantHandlers: Record<number, VariantHandler> = {
  0: (_len, base) => base,
  1: (length) => {
    const arr = Array.from({ length }, () => Math.round(Math.random() * 1000) / 10);
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    return arr.filter((el) => el !== max && el !== min);
  },
  2: (_len, base) => base,
  3: (length) => {
    const arr = Array.from({ length }, () => Math.floor(Math.random() * 1000) / 10);
    const arrayEven = arr.filter((el) => ((el * 10 % 10 === 0) ? el : el * 10 % 2) === 0);
    return arrayEven.map((el) => Math.round(Math.sqrt(Math.abs(el - 10)) * 10) / 10);
  },
  4: (_len, base) => base,
  8: (length) => Promise.all(Array.from({ length }, (_, i) => getName(i))),
  9: (length) => {
    const arr = Array.from(
      { length },
      () => (Math.round(Math.random() * 1000) / 10) * (Math.floor(Math.random() * 10) % 2 === 0 ? 1 : -1)
    );
    const firstNegative = arr.findIndex((el) => el < 0);
    const lastNegative = findLastIndex(arr, (el) => el < 0);
    if (firstNegative !== -1 && lastNegative !== -1 && firstNegative < lastNegative) {
      return arr.slice(firstNegative + 1, lastNegative);
    }
    return arr;
  },
  10: (length, base) => {
    const secondArray = generateRandomArray(length, 100);
    return base.filter((num) => num % 2 !== 0).concat(secondArray.filter((num) => num % 2 === 0));
  },
  11: (length) => Array.from({ length }, () => generateRandomArray(length, 100)),
  12: (length) => {
    const arr = Array.from({ length }, () => Math.round(Math.random() * 1000) / 10);
    const maxIndex = arr.indexOf(Math.max(...arr));
    return arr.slice(maxIndex);
  },
  13: (length) => {
    const arr = generateRandomArray(length, 10, true);
    return arr
      .filter((item) => item % 3 !== 0)
      .map((item) => Math.floor(item * item * 100) / 100);
  },
  14: async (length) => {
    const cities = await Promise.all(Array.from({ length }, (_, i) => getCity(i)));
    const filtered = cities.filter((item) => item.length < 8);
    return filtered.length > 0 ? filtered : cities;
  },
  15: (length) => Array.from({ length }, () => generateRandomArray(length, 100)),
  16: (length) => {
    const arr = Array.from(
      { length },
      () => (Math.round(Math.random() * 100) / 10) * (Math.floor(Math.random() * 10) % 2 === 0 ? 1 : -1)
    );
    const minEl = Math.min(...arr);
    return arr.map((item) => Math.round((item < 0 ? item * minEl : item) * 10) / 10);
  },
  17: (_length, base) =>
    base.map((item) =>
      Math.round(item % 2 === 0 ? Math.tan(item) - item : Math.abs(item) * 10) / 10
    ),
};

const generateArray = async (length: number, variant: number) => {
  const baseArray = generateRandomArray(length, 100);
  const handler = variantHandlers[variant];
  if (handler) {
    return await handler(length, baseArray);
  }
  return baseArray;
};

export default generateArray;
