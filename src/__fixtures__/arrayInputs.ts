import { MAX_CUSTOM_LENGTH, MAX_CUSTOM_VALUE } from "../utils/sorts/parseArray";

export const validInputs = [
  { input: "5, 3, 8, 1", expected: [5, 3, 8, 1] },
  { input: "5 3 8 1", expected: [5, 3, 8, 1] },
  { input: "-2.5,0,  7", expected: [-2.5, 0, 7] },
];

export const boundaryInputs = [
  { input: "1 2", expected: [1, 2] },
  { input: `${MAX_CUSTOM_VALUE}, -${MAX_CUSTOM_VALUE}`, expected: [MAX_CUSTOM_VALUE, -MAX_CUSTOM_VALUE] },
  { input: "  ,3,, 4 ,\n", expected: [3, 4] },
  { input: Array(MAX_CUSTOM_LENGTH).fill("1").join(","), expected: Array(MAX_CUSTOM_LENGTH).fill(1) },
];

export const invalidInputs = [
  { input: "", error: /Enter numbers/ },
  { input: " , ,", error: /Enter numbers/ },
  { input: "1, two, 3", error: /"two" is not a number/ },
  { input: "1 Infinity", error: /"Infinity" is not a number/ },
  { input: "7", error: /from 2 to 100 numbers \(got 1\)/ },
  { input: Array(MAX_CUSTOM_LENGTH + 1).fill("1").join(" "), error: /got 101/ },
  { input: `1, ${MAX_CUSTOM_VALUE + 1}`, error: /between -100 and 100/ },
];
