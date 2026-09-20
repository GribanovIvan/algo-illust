import React, { useState } from "react";
import styles from "./CustomArrayForm.module.scss";

export interface CustomArrayFormProps {
  onCustomArraySubmit: (array: number[]) => void;
  disabled?: boolean;
}

export const parseCustomArray = (
  input: string
): { data?: number[]; error?: string } => {
  if (!input || !input.trim()) {
    return { error: "Порожній ввід: введіть числа через кому або пробіл." };
  }

  const tokens = input.trim().split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) {
    return { error: "Порожній ввід: введіть числа через кому або пробіл." };
  }

  const numbers: number[] = [];
  for (const token of tokens) {
    const num = Number(token);
    if (!Number.isFinite(num) || token.trim() === "") {
      return {
        error: `Некоректне значення "${token}": дозволені лише дійсні числа.`,
      };
    }
    numbers.push(num);
  }

  if (numbers.length < 2) {
    return {
      error: "Замало елементів: масив повинен містити щонайменше 2 числа.",
    };
  }

  if (numbers.length > 100) {
    return {
      error: `Забагато елементів: дозволено максимум 100 чисел (введено ${numbers.length}).`,
    };
  }

  return { data: numbers };
};

const CustomArrayForm: React.FC<CustomArrayFormProps> = ({
  onCustomArraySubmit,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseCustomArray(inputValue);
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setErrorMessage(null);
    if (result.data) {
      onCustomArraySubmit(result.data);
    }
  };

  return (
    <form className={styles.customForm} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <label htmlFor="customArrayInput">Custom Array:</label>
        <input
          id="customArrayInput"
          type="text"
          placeholder="e.g. 5, 12, 3, 44, 9"
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
        />
        <button
          type="submit"
          disabled={disabled}
          title="Start sorting custom array"
        >
          Sort Custom
        </button>
      </div>
      {errorMessage && (
        <div
          className={styles.errorMessage}
          role="alert"
          data-testid="custom-array-error"
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default CustomArrayForm;
