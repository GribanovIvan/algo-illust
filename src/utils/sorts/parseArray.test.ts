import { boundaryInputs, invalidInputs, validInputs } from "../../__fixtures__/arrayInputs";
import parseArray from "./parseArray";

describe("parseArray", () => {
  describe("normal values", () => {
    test.each(validInputs)("parses '$input'", ({ input, expected }) => {
      expect(parseArray(input)).toEqual({ array: expected });
    });
  });

  describe("boundary values", () => {
    test.each(boundaryInputs)("accepts boundary input #%#", ({ input, expected }) => {
      expect(parseArray(input)).toEqual({ array: expected });
    });
  });

  describe("exceptional situations", () => {
    test.each(invalidInputs)("rejects input #%# with a message", ({ input, error }) => {
      const result = parseArray(input);
      expect(result.array).toBeUndefined();
      expect(result.error).toMatch(error);
    });
  });
});
