export const MAX_ARRAY_LENGTH = 200;
export const MAX_BENCHMARK_LENGTH = 5000;

export function validateLength(length: number, max = MAX_ARRAY_LENGTH) {
  if (!Number.isInteger(length) || length < 2 || length > max) {
    throw new Error(`Enter between 2 and ${max} elements.`);
  }
}

export default function parseArray(input: string): number[] {
  if (!input.trim()) throw new Error('Enter numbers separated by commas or spaces.');
  if (input.length > 10000) throw new Error('Input is too long (maximum 10000 characters).');
  const tokens = input.trim().split(/\s*,\s*|\s+/);
  validateLength(tokens.length);
  const numbers = tokens.map(token => {
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(token)) {
      throw new Error(`“${token}” is not a valid number.`);
    }
    const value = Number(token);
    if (!Number.isFinite(value)) throw new Error('Numbers must be finite.');
    return value;
  });
  return numbers;
}
