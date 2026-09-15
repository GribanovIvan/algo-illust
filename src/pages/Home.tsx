import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFocus from '../hooks/useFocus';
import TerminalArrow from '../images/TerminalArrow';
import styles from './Home.module.scss';

const Home = () => {
  const [showTittle, setShowTittle] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState(0);
  const [inputFocus, setInputFocus] = useFocus();
  const navigate = useNavigate();
  const header = "Let's get started!";

  useEffect(() => {
    setTimeout(() => {
      setShowTittle(false);
    }, 1700);

    onkeydown = (e) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {   
    setTimeout(() => {
      if (inputFocus.current) setInputFocus();
    }, 1000 * (header.length / 2 + 1));
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