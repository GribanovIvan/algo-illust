export type SearchTypeId = 
  | 'binary'
  | 'kmp'
  | 'bm';

export type SearchType = {
  id: SearchTypeId;
  name: string;
};

export type OutletContextSearch = [string, string, number, number];

export type HighlightedElements = {
  orange?: {searchIn: number; searchFor: number};
  red?: {searchIn: number; searchFor: number};
  found?: number[];
}