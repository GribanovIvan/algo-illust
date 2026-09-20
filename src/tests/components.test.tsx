import { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import SortNavBar from "../components/navigations/SortNavBar";
import SizeForm from "../components/SizeForm";
import SortsTable from "../components/sorts/SortsTable";
import SortComponent from "../components/sorts/SortComponent";
import SearchPage from "../pages/SearchPage";
import Binary from "../components/searches/Binary";
import KMP from "../components/searches/KMP";
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

  test("SortComponent subtracts actual animation frame delays correctly", async () => {
    const mockSort = jest.fn(async (arr, isASC, render) => {
      if (render) await render([...arr], { green: [0, 1] });
      if (render) await render([...arr]);
      return 1;
    });

    const TestSortHOC = SortComponent(mockSort);

    const MockParent = () => {
      const [arr, setArr] = useState<any[]>([5, 2]);
      const [isSorting, setIsSorting] = useState(false);
      const [swaps, setSwaps] = useState({});
      return (
        <Outlet
          context={[
            [arr, setArr],
            [isSorting, setIsSorting],
            [swaps, setSwaps],
            true,
            25,
          ]}
        />
      );
    };

    render(
      <MemoryRouter initialEntries={["/sort/test"]}>
        <Routes>
          <Route path="/sort" element={<MockParent />}>
            <Route path="test" element={<TestSortHOC />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Steps: 1\./i)).toBeInTheDocument();
    });

    const footer = screen.getByText(/Steps: 1\./i);
    const match = footer.textContent?.match(/Time taken ([\d.]+)ms/);
    expect(match).toBeTruthy();
    const timeTaken = parseFloat(match![1]);
    // The two 25ms delays (total 50ms) are subtracted, so time taken is small
    expect(timeTaken).toBeLessThan(40);
  });

  test("SearchPage dynamically syncs type with route preventing e.map error on Binary navigation", () => {
    render(
      <MemoryRouter initialEntries={["/search/kmp", "/search/binary"]} initialIndex={1}>
        <Routes>
          <Route path="/search" element={<SearchPage />}>
            <Route path="binary" element={<Binary />} />
            <Route path="kmp" element={<KMP />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Array Length:/i)).toBeInTheDocument();
    expect(screen.getByText(/Binary Search/i)).toBeInTheDocument();
  });

  test("SearchPage navigates from kmp to binary without e.map failure", () => {
    render(
      <MemoryRouter initialEntries={["/search/kmp"]}>
        <Routes>
          <Route path="/search" element={<SearchPage />}>
            <Route path="binary" element={<Binary />} />
            <Route path="kmp" element={<KMP />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Search in.../i)).toBeInTheDocument();
    const binaryLink = screen.getByText(/Binary Search/i);
    fireEvent.click(binaryLink);

    expect(screen.getByLabelText(/Array Length:/i)).toBeInTheDocument();
  });
});
