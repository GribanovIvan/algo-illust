import { Link } from "react-router-dom";
import HomeIcon from "../../assets/HomeIcon";
import { SortType, SortTypeId } from "../../utils/types/sort.types";
import { SORTS } from "../../utils/sorts/sortList";
import styles from './NavBar.module.scss';

type NavBarProps = {
  type: SortTypeId;
}

const NavBar = ({type}: NavBarProps) => {

  const sorts: SortType[] = [...SORTS, {id: 'compare', name: 'Comparison'}];

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
