import { sorts } from "../../utils/sorts/registry";
import { Link } from "react-router-dom";
import HomeIcon from "../../assets/HomeIcon";
import { SortTypeId } from "../../utils/types/sort.types";
import styles from './NavBar.module.scss';

type NavBarProps = {
  type: SortTypeId;
}

const NavBar = ({type}: NavBarProps) => {


  return (
      <nav>
        <Link to="/">
          <HomeIcon/>
        </Link>
        {[...sorts, {id: "compare", name: "Comparison"}].map(sort => (
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
