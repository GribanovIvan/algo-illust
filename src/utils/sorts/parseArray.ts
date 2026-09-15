export const MAX_ARRAY_LENGTH = 200;
export const MAX_BENCHMARK_LENGTH = 5000;

export function validateLength(length: number, max = MAX_ARRAY_LENGTH) {
  if (!Number.isInteger(length) || length < 2 || length > max) {
    throw new Error(`Введіть від 2 до ${max} елементів.`);
  }
}

export default function parseArray(input: string): number[] {
  if (!input.trim()) throw new Error('Введіть числа через кому або пробіл.');
  if (input.length > 10000) throw new Error('Ввід надто довгий (максимум 10000 символів).');
  const tokens = input.trim().split(/\s*,\s*|\s+/);
  validateLength(tokens.length);
  const numbers = tokens.map(token => {
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(token)) {
      throw new Error(`«${token}» — некоректне число.`);
    }
    const value = Number(token);
    if (!Number.isFinite(value)) throw new Error('Числа мають бути скінченними.');
    return value;
  });
  return numbers;
}
