export const normalArrays = [
  [8, 3, 1, 9, 4],
  [3, -1, 2.5, 0, -1, 9.75],
  [1e100, -1e100, 0, 1e-100],
];
export const boundaryArrays = [[], [7], [2, 1], [1, 2, 3], [3, 2, 1], [0, 0, 0]];
export const validInputs = [
  { text: '3, -1, 2.5', array: [3, -1, 2.5] },
  { text: ' 3  -1\t2.5\n0 ', array: [3, -1, 2.5, 0] },
  { text: '1e2, +.5 -3', array: [100, .5, -3] },
];
export const invalidInputs = ['', '  ', '1', '1,cat', 'NaN 2', 'Infinity 1', '1e999 2', '1,,2', ',1,2', '1,2,', '0x10 2', Array(201).fill('1').join(' ')];
export const searchCases = [
  { text: 'ababcabcabababd', target: 'ababd', found: 10 },
  { text: 'aaaaaaab', target: 'aaaab', found: 3 },
  { text: 'hello world', target: 'world', found: 6 },
  { text: 'abc', target: 'z', found: null },
  { text: 'abc', target: 'abcd', found: null },
];
