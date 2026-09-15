import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFocus from "../hooks/useFocus";
import TerminalArrow from "../images/TerminalArrow";
import styles from "./Home.module.scss";

const menuItems = [
  { name: "sort", path: "sort/bubble" },
  { name: "search", path: "search/binary" },
  { name: "data structures", path: "ds/stack" },
];

const Home = () => {
  const [showTitle, setShowTitle] = useState(true);
  const [selectedItem, setSelectedItem] = useState(0);
  const selectedItemRef = useRef(selectedItem);
  selectedItemRef.current = selectedItem;

  const [inputFocus, setInputFocus]: any = useFocus();
  const navigate = useNavigate();
  const header = "Let's get started!";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 1700);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setSelectedItem((prev) => (prev + 1 > 2 ? 0 : prev + 1));
      } else if (e.key === "ArrowUp") {
        setSelectedItem((prev) => (prev - 1 < 0 ? 2 : prev - 1));
      } else if (e.key === "Enter") {
        navigate(menuItems[selectedItemRef.current].path);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    if (showTitle) return;
    const focusTimer = setTimeout(() => {
      if (inputFocus.current) setInputFocus();
    }, 1000 * (header.length / 2 + 1));

    return () => clearTimeout(focusTimer);
  }, [showTitle, inputFocus, setInputFocus, header.length]);

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
      {showTitle ? (
        <h1 className={styles.loadScreen}>Algorithms Visualizer</h1>
      ) : (
        <div className={styles.homeContent}>
          <h1 className={styles.header}>{header}</h1>
          <div className={styles.menu}>
            <span className={styles.terminalInput}>
              <TerminalArrow />
              <input
                type="text"
                onChange={handleInput}
                ref={inputFocus}
                aria-label="Navigation command"
              />
            </span>
            <div className={styles.items}>
              {menuItems.map((item, index) => (
                <Link
                  className={selectedItem === index ? styles.selected : ""}
                  onMouseOver={() => setSelectedItem(index)}
                  to={item.path}
                  key={index}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;