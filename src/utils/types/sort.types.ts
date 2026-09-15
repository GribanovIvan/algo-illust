export type SortTypeId =
  | "bubble"
  | "selection"
  | "shell"
  | "heap"
  | "quick"
  | "merge"
  | "counting"
  | "compare";

export type SortType = {
  id: SortTypeId;
  name: string;
};

export type SortArray = (number | string | number[])[];

export type HighlightedElements = {
  green?: number[];
  orange?: number[];
  sorted?: boolean;
}

export type RenderFunc = (
  arr: SortArray, 
  highlightedElements?: HighlightedElements
) => Promise<unknown>;

export type SortFunc = (
  arr: SortArray,
  isASC: boolean,
  render?: RenderFunc
) => Promise<number>;


export type OutletContextSort = [
  [SortArray, (array: SortArray) => void],
  [boolean, (state: boolean) => void],
  [HighlightedElements, (elements: HighlightedElements) => void],
  boolean,
  number
];

export type SortStats = {
  sortId: SortTypeId;
  steps: number;
  name: string;
  time: number;
  sorted?: boolean;
}

export type SortWithStatsFunc = (array: SortArray) => Promise<SortStats>;
