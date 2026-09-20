import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomArrayForm, { parseCustomArray } from "../components/sorts/CustomArrayForm";
import {
  normalFixtures,
  boundaryFixtures,
  exceptionalFixtures,
} from "../fixtures/testData";

describe("CustomArrayForm & Validation Unit Tests", () => {
  describe("Група 1: Нормальні значення (Normal values)", () => {
    test("1.1 parseCustomArray correctly parses comma-separated numbers", () => {
      const result = parseCustomArray(normalFixtures.commaSeparatedInput);
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual(normalFixtures.parsedNumbers);
    });

    test("1.2 parseCustomArray correctly parses space-separated numbers", () => {
      const result = parseCustomArray(normalFixtures.spaceSeparatedInput);
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual(normalFixtures.parsedNumbers);
    });

    test("1.3 parseCustomArray correctly parses mixed comma and space separated numbers", () => {
      const result = parseCustomArray(normalFixtures.mixedSeparatedInput);
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual(normalFixtures.parsedNumbers);
    });

    test("1.4 parseCustomArray handles negative numbers and decimals", () => {
      const result = parseCustomArray("-10.5, 20, -30.2, 0");
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual([-10.5, 20, -30.2, 0]);
    });

    test("1.5 CustomArrayForm renders and submits valid user input via UI", async () => {
      const onSubmitMock = jest.fn();
      render(<CustomArrayForm onCustomArraySubmit={onSubmitMock} />);

      const input = screen.getByLabelText(/Custom Array:/i);
      const submitBtn = screen.getByRole("button", { name: /Sort Custom/i });

      await userEvent.type(input, "12, 5, 88, 3");
      fireEvent.click(submitBtn);

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith([12, 5, 88, 3]);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Група 2: Граничні значення (Boundary values)", () => {
    test("2.1 accepts minimum boundary size of exactly 2 numbers", () => {
      const result = parseCustomArray(boundaryFixtures.twoElementsInput);
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual(boundaryFixtures.twoElementsArray);
    });

    test("2.2 accepts maximum boundary size of exactly 100 numbers", () => {
      const result = parseCustomArray(boundaryFixtures.hundredElementsInput);
      expect(result.error).toBeUndefined();
      expect(result.data?.length).toBe(100);
    });

    test("2.3 form submits correctly with boundary 2 elements through UI", () => {
      const onSubmitMock = jest.fn();
      render(<CustomArrayForm onCustomArraySubmit={onSubmitMock} />);

      const input = screen.getByLabelText(/Custom Array:/i);
      fireEvent.change(input, { target: { value: "100, 200" } });
      fireEvent.click(screen.getByRole("button", { name: /Sort Custom/i }));

      expect(onSubmitMock).toHaveBeenCalledWith([100, 200]);
    });
  });

  describe("Група 3: Виняткові ситуації (Exceptional situations)", () => {
    test("3.1 rejects empty and whitespace-only input with descriptive error", () => {
      const emptyRes = parseCustomArray(exceptionalFixtures.emptyString);
      expect(emptyRes.data).toBeUndefined();
      expect(emptyRes.error).toMatch(/Порожній ввід/i);

      const wsRes = parseCustomArray(exceptionalFixtures.whitespaceOnlyString);
      expect(wsRes.data).toBeUndefined();
      expect(wsRes.error).toMatch(/Порожній ввід/i);
    });

    test("3.2 rejects single element (< 2) with error message", () => {
      const result = parseCustomArray(exceptionalFixtures.singleElementInput);
      expect(result.data).toBeUndefined();
      expect(result.error).toMatch(/Замало елементів/i);
    });

    test("3.3 rejects non-numeric tokens with descriptive error", () => {
      const result = parseCustomArray(exceptionalFixtures.nonNumericInput);
      expect(result.data).toBeUndefined();
      expect(result.error).toMatch(/Некоректне значення/i);
      expect(result.error).toContain("twenty");
    });

    test("3.4 rejects inputs with special characters", () => {
      const result = parseCustomArray(exceptionalFixtures.specialCharsInput);
      expect(result.data).toBeUndefined();
      expect(result.error).toMatch(/Некоректне значення/i);
    });

    test("3.5 rejects too many elements (> 100) with error message", () => {
      const result = parseCustomArray(exceptionalFixtures.overflowElementsInput);
      expect(result.data).toBeUndefined();
      expect(result.error).toMatch(/Забагато елементів/i);
      expect(result.error).toContain("101");
    });

    test("3.6 UI shows error alert and does NOT trigger callback on invalid input", () => {
      const onSubmitMock = jest.fn();
      render(<CustomArrayForm onCustomArraySubmit={onSubmitMock} />);

      const input = screen.getByLabelText(/Custom Array:/i);
      fireEvent.change(input, { target: { value: "abc, def" } });
      fireEvent.click(screen.getByRole("button", { name: /Sort Custom/i }));

      expect(onSubmitMock).not.toHaveBeenCalled();
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Некоректне значення/i);
    });

    test("3.7 form input and submit button are disabled when sorting is active", () => {
      render(<CustomArrayForm onCustomArraySubmit={jest.fn()} disabled={true} />);
      expect(screen.getByLabelText(/Custom Array:/i)).toBeDisabled();
      expect(screen.getByRole("button", { name: /Sort Custom/i })).toBeDisabled();
    });

    test("3.8 rejects Infinity and -Infinity inputs with error message", () => {
      const posInfRes = parseCustomArray("1, 2, Infinity, 4");
      expect(posInfRes.data).toBeUndefined();
      expect(posInfRes.error).toMatch(/Некоректне значення "Infinity"/i);

      const negInfRes = parseCustomArray("-Infinity, 5, 10");
      expect(negInfRes.data).toBeUndefined();
      expect(negInfRes.error).toMatch(/Некоректне значення "-Infinity"/i);
    });
  });
});
