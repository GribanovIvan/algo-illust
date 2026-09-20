import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SortNavBar from "../components/navigations/SortNavBar";
import SizeForm from "../components/SizeForm";
import SortsTable from "../components/sorts/SortsTable";
import WorkerBuilder from "../utils/workerBuilder";

// Mock dependencies with Jest mock objects as required
jest.mock("../utils/workerBuilder", () => {
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => ({
        postMessage: jest.fn(),
        terminate: jest.fn(),
        onmessage: null,
      })),
    },
  };
});

describe("React Components & Integration Tests", () => {
  test("SortNavBar renders all sorting links including new Heap Sort", () => {
    const setTypeMock = jest.fn();
    render(
      <BrowserRouter>
        <SortNavBar type="bubble" setType={setTypeMock} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Bubble Sort/i)).toBeInTheDocument();
    expect(screen.getByText(/Heap Sort/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Sort/i)).toBeInTheDocument();
    expect(screen.getByText(/Merge Sort/i)).toBeInTheDocument();

    const heapLink = screen.getByText(/Heap Sort/i);
    fireEvent.click(heapLink);
    expect(setTypeMock).toHaveBeenCalledWith("heap");
  });

  test("SizeForm submits array length accurately and renders form elements", () => {
    const onLengthSubmitMock = jest.fn();
    render(<SizeForm onLengthSubmit={onLengthSubmitMock} />);

    expect(screen.getByLabelText(/Array Length:/i)).toBeInTheDocument();
    const lengthInput = screen.getByPlaceholderText(/length/i);
    expect(lengthInput).toHaveAttribute("type", "number");
    const submitBtn = screen.getByTitle(/Start/i);
    expect(submitBtn).toHaveAttribute("type", "submit");

    fireEvent.change(lengthInput, { target: { value: "35" } });
    fireEvent.click(submitBtn);

    expect(onLengthSubmitMock).toHaveBeenCalledWith(35);
  });

  test("SortsTable renders selection and invokes mocked WorkerBuilder", async () => {
    render(
      <BrowserRouter>
        <SortsTable />
      </BrowserRouter>
    );

    expect(screen.getByText(/Heap Sort/i)).toBeInTheDocument();
    expect(WorkerBuilder.create).toHaveBeenCalled();
  });
});
