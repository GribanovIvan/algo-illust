const generateRandomArray = (length: number = 10, max: number = 10, withNegative: boolean = false) => {
  if (!Number.isInteger(length) || length < 0 || length > 5000 || !Number.isFinite(max) || max <= 0) {
    throw new Error("Некоректний розмір або діапазон випадкового масиву.");
  }
  const array = [];
  if (withNegative) {
    for (let i = 0; i < length; i++) {
      array.push(Math.floor(Math.random() * max * 2) - max);
    }
  } else {
    for (let i = 0; i < length; i++) {
      array.push(Math.floor(Math.random() * max));
    }
  }
  return array;
};

export default generateRandomArray;