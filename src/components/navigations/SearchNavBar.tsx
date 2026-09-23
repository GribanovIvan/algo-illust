import { Link } from "react-router-dom";
import HomeIcon from "../../assets/HomeIcon";
import { SearchType, SearchTypeId } from "../../utils/types/search.types";
import styles from './NavBar.module.scss';

type NavBarProps = {
  type: SearchTypeId;
}

const NavBar = ({type}: NavBarProps) => {
  
  const searches: SearchType[] = [
    {id: 'binary', name: 'Binary Search'},
    {id: 'kmp', name: 'KMP Search'},
    {id: 'bm', name: 'Boyer-Moore Search'},
  ];

  return (
      <nav>
        <Link to="/" aria-label="Home">
          <HomeIcon/>
        </Link>
        {searches.map(search => (
          <Link
            key={search.id}
            to={'/search/' + search.id}
            className={`${type === search.id && styles.textSelected}`}
            title={search.name}
          >
            <div className={`${type === search.id && styles.selected}`}></div>
            {search.name}
          </Link>
        ))}
      </nav>      
  );
};

export default NavBar;
