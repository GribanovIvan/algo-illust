import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SearchNavBar from '../components/navigations/SearchNavBar';
import SizeForm from '../components/SizeForm';
import generateRandomArray from '../utils/randomArrays';
import { SearchTypeId } from '../utils/types/search.types';
import styles from './SearchPage.module.scss';

const MAX = 15; 

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const type: SearchTypeId = (lastSegment === 'kmp' || lastSegment === 'bm')
    ? lastSegment
    : 'binary';

  const setType = (newType: SearchTypeId) => {
    navigate(`/search/${newType}`);
  };

  const [text, setText] = React.useState<string>("Some text");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [variant, setVariant] = React.useState<number>(8);
  // TODO: Get rid of this state
  const [binaryArray, setBinaryArray] = React.useState<number[]>(generateRandomArray(10).sort((a, b) => a - b));

  const startSearching = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const searchIn = data.get('searchIn')?.toString() || text;
    const searchFor = data.get('searchFor')?.toString() || '';
    console.log(searchIn, searchFor);
    setText(searchIn)
    setSearchValue(searchFor)
  }

  return (
    <>
      <header>
        <SearchNavBar type={type} setType={setType}/>      
      </header>
      <span className={styles.center}>
        <select name="variants" onChange={e => setVariant(parseInt(e.target.value))}>
          <option value={8}>Var 8</option>
          <option value={12}>Var 12</option>
        </select>
        {type === 'binary' ? 
          <SizeForm onLengthSubmit={length => 
            setBinaryArray(generateRandomArray(length, MAX, true).sort((a, b) => a - b))}/> :
          <form onSubmit={startSearching}>
            <textarea name="searchIn" placeholder="Search in..." rows={3} cols={30} />
            <input type="text" name="searchFor" placeholder="Search for..." />
            <input type="submit" value="Run" title="Start" />
          </form>
        }
      </span>   
      <main>
        {type === 'binary' ? 
          <Outlet context={[[binaryArray, setBinaryArray], variant]} /> : 
          // TODO: Make it HOC
          <Outlet context={[text, searchValue, variant]} />}
      </main>
    </>

  )
}

export default SearchPage;