import NavBar from "../components/navigations/SortNavBar";
import SortsTable from "../components/sorts/SortsTable";

// the comparison lives outside the sort page layout, so it brings its own navigation
const ComparePage = () => (
  <>
    <header>
      <NavBar type="compare" />
    </header>
    <SortsTable />
  </>
);

export default ComparePage;
