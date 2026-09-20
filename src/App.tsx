import SortPage from "./pages/SortPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SortComponent from "./components/sorts/SortComponent";
import { useMemo } from "react";
import {
  bubbleSort,
  selectionSort,
  shellSort,
  heapSort,
  countingSort,
  quickSort,
  mergeSort,
} from "./utils/sorts/sorts";
import Home from "./pages/Home";
import SortsTable from "./components/sorts/SortsTable";
import DataStructuresPage from "./pages/DataStructuresPage";
import DataStructure from "./components/data_structures/DataStructure";
import Tree from "./components/data_structures/Tree";
import SearchPage from "./pages/SearchPage";
import KMP from "./components/searches/KMP";
import BM from "./components/searches/BM";
import Binary from "./components/searches/Binary";

function App() {
  const BubbleSort = useMemo(() => SortComponent(bubbleSort), []);
  const SelectionSort = useMemo(() => SortComponent(selectionSort), []);
  const ShellSort = useMemo(() => SortComponent(shellSort), []);
  const HeapSort = useMemo(() => SortComponent(heapSort), []);
  const MergeSort = useMemo(() => SortComponent(mergeSort), []);
  const QuickSort = useMemo(() => SortComponent(quickSort), []);
  const CountingSort = useMemo(() => SortComponent(countingSort), []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="sort/" element={<SortPage />}>
            <Route index element={<Navigate to="bubble" replace />} />
            <Route path="bubble" element={<BubbleSort />} />
            <Route path="selection" element={<SelectionSort />} />
            <Route path="shell" element={<ShellSort />} />
            <Route path="heap" element={<HeapSort />} />
            <Route path="merge" element={<MergeSort />} />
            <Route path="quick" element={<QuickSort />} />
            <Route path="counting" element={<CountingSort />} />
          </Route>
          <Route path="sort/compare" element={<SortsTable />} />
          <Route path="ds/" element={<DataStructuresPage/>} >
            <Route index element={<Navigate to="stack" replace />} />
            <Route path="stack" element={<DataStructure/>} />
            <Route path="queue" element={<DataStructure/>} />
            <Route path="linked-list" element={<DataStructure/>} />
            <Route path="doubly-linked" element={<DataStructure/>} />
            <Route path="circular-linked" element={<DataStructure/>} />
            <Route path="deque" element={<DataStructure/>} />
            <Route path="tree" element={<Tree/>} />
          </Route>
          <Route path="search/" element={<SearchPage/>} >
            <Route index element={<Navigate to="binary" replace />} />
            <Route path="binary" element={<Binary/>} />
            <Route path="kmp" element={<KMP/>} />
            <Route path="bm" element={<BM/>} />
            <Route path="hash" element={<div>hash</div>} />
          </Route>
          <Route path="*" element={<h1 style={{color: "white"}}>404</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
