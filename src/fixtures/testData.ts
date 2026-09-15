export const normalFixtures = {
  standardArray: [64, 34, 25, 12, 22, 11, 90],
  arrayWithNegatives: [-15, 42, 0, -8, 27, 3, -1],
  commaSeparatedInput: "15, 3, 42, 8, 23",
  spaceSeparatedInput: "15 3 42 8 23",
  mixedSeparatedInput: "15,  3   42, 8,  23",
  parsedNumbers: [15, 3, 42, 8, 23],
  searchString: "algorithms visualizer in react and typescript",
  searchTarget: "visualizer",
  searchTargetNotFound: "nonexistent",
  sortedNumbers: [10, 20, 30, 40, 50, 60, 70],
};

export const boundaryFixtures = {
  twoElementsArray: [42, 17],
  twoElementsInput: "42, 17",
  singleElementArray: [99],
  emptyArray: [],
  hundredElementsArray: Array.from({ length: 100 }, (_, i) => 100 - i),
  hundredElementsInput: Array.from({ length: 100 }, (_, i) => i + 1).join(", "),
  alreadySortedAsc: [1, 2, 3, 4, 5, 6, 7, 8],
  alreadySortedDesc: [8, 7, 6, 5, 4, 3, 2, 1],
  allEqualElements: [7, 7, 7, 7, 7, 7],
  searchSingleChar: "a",
  searchInSingleChar: "a",
};

export const exceptionalFixtures = {
  emptyString: "",
  whitespaceOnlyString: "    ",
  singleElementInput: "42",
  nonNumericInput: "10, twenty, 30",
  specialCharsInput: "10, @#$, 30",
  overflowElementsInput: Array.from({ length: 101 }, (_, i) => i + 1).join(", "),
  nonNumericArrayForCountingSort: ["cat", "dog", "bird"] as any,
  hugeRangeArrayForCountingSort: [0, 200000],
  missingSearchPattern: "xyz123",
};
