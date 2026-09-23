import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import SearchNavBar from '../components/navigations/SearchNavBar';
import SizeForm from '../components/SizeForm';
import generateRandomArray from '../utils/randomArrays';
import { SearchTypeId } from '../utils/types/search.types';
import styles from './SearchPage.module.scss';

const MAX = 15; 

const SearchPage = () => {
  const type = useLocation().pathname.split("/").pop() as SearchTypeId;
  const [request, setRequest] = React.useState(0);
  const [error, setError] = React.useState("");
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
    if (!searchFor.trim() || searchIn.length > 5000 || searchFor.length > 200) {
      setError("Enter a nonempty pattern of up to 200 characters and text of up to 5000 characters.");
      return;
    }
    setError("");
    setRequest(previous => previous + 1);
    setText(searchIn)
    setSearchValue(searchFor)
  }

  return (
    <>
      <header>
        <SearchNavBar type={type}/>      
      </header>
      <span className={styles.center}>
        <select name="variants" aria-label="Variant" onChange={e => setVariant(parseInt(e.target.value))}>
          <option value={8}>Var 8</option>
          <option value={12}>Var 12</option>
        </select>
        {type === 'binary' ? 
          <SizeForm onLengthSubmit={length => 
            setBinaryArray(generateRandomArray(length, MAX, true).sort((a, b) => a - b))}/> :
          <form onSubmit={startSearching}>
            <textarea name="searchIn" aria-label="Search in" placeholder="Search in..." rows={3} cols={30} />
            <input type="text" name="searchFor" aria-label="Search for" placeholder="Search for..." />
            <input type="submit" value="Run" title="Start" />
          </form>
        }
      </span>   
      {error && <p role="alert">{error}</p>}
      <main>
        {type === 'binary' ? 
          <Outlet context={[[binaryArray, setBinaryArray], variant]} /> : 
          // TODO: Make it HOC
          <Outlet context={[text, searchValue, variant, request]} />}
      </main>
    </>

  )
}

export default SearchPage;