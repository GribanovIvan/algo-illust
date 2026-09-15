export const MIN_CUSTOM_LENGTH = 2;
export const MAX_CUSTOM_LENGTH = 100;
// Graph draws each value as a bar of |value| percent height
export const MAX_CUSTOM_VALUE = 100;

export type ParseResult =
  | { array: number[]; error?: undefined }
  | { array?: undefined; error: string };

const parseArray = (input: string): ParseResult => {
  const tokens = input.split(/[\s,]+/).filter(token => token !== "");
  if (tokens.length === 0) {
    return { error: "Enter numbers separated by commas or spaces." };
  }
  const invalid = tokens.find(token => !Number.isFinite(Number(token)));
  if (invalid !== undefined) {
    return { error: `"${invalid}" is not a number.` };
  }
  if (tokens.length < MIN_CUSTOM_LENGTH || tokens.length > MAX_CUSTOM_LENGTH) {
    return { error: `Enter from ${MIN_CUSTOM_LENGTH} to ${MAX_CUSTOM_LENGTH} numbers (got ${tokens.length}).` };
  }
  const array = tokens.map(Number);
  if (array.some(value => Math.abs(value) > MAX_CUSTOM_VALUE)) {
    return { error: `Values must be between -${MAX_CUSTOM_VALUE} and ${MAX_CUSTOM_VALUE}.` };
  }
  return { array };
};

export default parseArray;
