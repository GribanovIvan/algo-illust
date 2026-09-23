import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFocus from '../hooks/useFocus';
import TerminalArrow from '../images/TerminalArrow';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/300-italic.css';
import '@fontsource/roboto-mono/600-italic.css';
import styles from './Home.module.scss';

const menuItems = [
  {name: "sort", path: "sort/bubble"},
  {name: "search", path: "search/binary"},
  {name: "data structures", path: "ds/stack"}
];

const header = "Let's get started!";

const Home = () => {
  const [showTitle, setShowTitle] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState(0);
  const selectedItemRef = React.useRef(selectedItem);
  const [inputFocus, setInputFocus] = useFocus();
  const navigate = useNavigate();

  useEffect(() => {
    selectedItemRef.current = selectedItem;
  }, [selectedItem]);

  useEffect(() => {
    const titleTimer = setTimeout(() => {
      setShowTitle(false);
    }, 1700);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSelectedItem(selectedItem => selectedItem + 1 > 2 ? 0 : selectedItem + 1);
      }
      if (e.key === 'ArrowUp') {
        setSelectedItem(selectedItem => selectedItem - 1 < 0 ? 2 : selectedItem - 1);
      }
      if (e.key === 'Enter') {
        navigate(menuItems[selectedItemRef.current].path);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(titleTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      if (inputFocus.current) setInputFocus();
    }, 1000 * (header.length / 2 + 1));
    return () => clearTimeout(focusTimer);
  }, [showTitle, inputFocus, setInputFocus]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 2) return;
    menuItems.forEach((item, index) => {
      if (item.name.includes(e.target.value.toLowerCase())) {
        setSelectedItem(index); 
      }
    });
  };

  return (
      <div className={styles.central}>
        {showTitle ?
          <h1 className={styles.loadScreen}>Algorithms Visualizer</h1>
          :
          <div className={styles.homeContent}>
            <h1 className={styles.header}>{header}</h1>
            <div className={styles.menu}>
              <span className={styles.terminalInput} >
                <TerminalArrow />
                <input type="text" onChange={handleInput} ref={inputFocus}/>
              </span>
              <div className={styles.items}>
                {menuItems.map((item, index) => (
                  <Link
                    className={selectedItem === index ? styles.selected : ''}
                    onMouseOver={() => setSelectedItem(index)}
                    to={item.path}
                    key={index}>
                      {item.name}
                  </Link>
                  ))
                }
              </div>
            </div>
          </div>
        }
      </div>
  )
};

export default Home;