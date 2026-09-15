import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFocus from '../hooks/useFocus';
import TerminalArrow from '../images/TerminalArrow';
import styles from './Home.module.scss';

const Home = () => {
  const [showTittle, setShowTittle] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState(0);
  const [inputFocus, setInputFocus]: any = useFocus();
  const navigate = useNavigate();
  const header = "Let's get started!";

  useEffect(() => {
    const titleTimer = setTimeout(() => {
      setShowTittle(false);
    }, 1700);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSelectedItem(selectedItem => selectedItem + 1 > 2 ? 0 : selectedItem + 1);
      }
      if (e.key === 'ArrowUp') {
        setSelectedItem(selectedItem => selectedItem - 1 < 0 ? 2 : selectedItem - 1);
      }
      if (e.key === 'Enter') {
        // ...
        setSelectedItem(selectedItem => {
          navigate(menuItems[selectedItem].path);
          return selectedItem;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(titleTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {   
    const focusTimer = setTimeout(() => {
      if (inputFocus.current) setInputFocus();
    }, 1000 * (header.length / 2 + 1));
    return () => clearTimeout(focusTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTittle]);

  const menuItems = [
    {name: "sort", path: "sort/bubble"},
    {name: "search", path: "search/binary"},
    {name: "data structures", path: "ds/stack"}
  ];

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
        {showTittle ?
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