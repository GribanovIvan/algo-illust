import { Link } from "react-router-dom";
import HomeIcon from "../../assets/HomeIcon";
import { SortType, SortTypeId } from "../../utils/types/sort.types";
import styles from './NavBar.module.scss';

type NavBarProps = {
  type: SortTypeId;
  setType: (type: SortTypeId) => void;
}

const NavBar = ({type, setType}: NavBarProps) => {

  const sorts: SortType[] = [
    {id: 'bubble', name: 'Bubble Sort'},
    {id: 'selection', name: 'Selection Sort'},
    {id: 'shell', name: 'Shell Sort'},
    {id: 'merge', name: 'Merge Sort'},
    {id: 'quick', name: 'Quick Sort'},
    {id: 'counting', name: 'Counting Sort'},
    {id: 'heap', name: 'Heap Sort'},
    {id: 'compare', name: 'Comparison'}
  ];

  return (
      <nav>
        <Link to="/">
          <HomeIcon/>
        </Link>
        {sorts.map(sort => (
          <Link
            key={sort.id}
            to={'/sort/' + sort.id}
            className={`${type === sort.id && styles.textSelected}`}
            onClick={() => setType(sort.id)}
            title={sort.name}
          >
            <div className={`${type === sort.id && styles.selected}`}></div>
            {sort.name}
          </Link>
        ))}
      </nav>      
  );
};

export default NavBar;
