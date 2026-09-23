import { useEffect, useMemo, useRef, useState } from "react";
import drawTree from "../../utils/data_structures/drawingTree";
import { RBTree } from "../../utils/data_structures/RedBlackTree";
import styles from "./Tree.module.scss";

const Tree = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = useState("");
  const [isChar, setIsChar] = useState(false);
  const [message, setMessage] = useState("");
  const tree = useMemo(() => new RBTree(), []);

  useEffect(() => {
    const canvas = canvasRef?.current;
    drawTree(canvas, tree, isChar);
  }, [tree, isChar]);


  function insert() {
    const input = inputRef.current;
    if (input === null) return;

    const value = input.value.trim();
    if (!isChar) {
      if (value === "" || !Number.isFinite(+value)) return;
      if (tree.search(+value)) {
        setMessage("key " + value + " is already in the tree");
      } else {
        setMessage("");
        tree.insert(+value);
        drawTree(canvasRef?.current, tree, isChar);
      }
    } else {
      if (value === "" || value.length !== 1 || !value.match(/[a-z]/i)) return;
      if (tree.search(value.charCodeAt(0))) {
        setMessage("key " + value + " is already in the tree");
      } else {
        setMessage("");
        tree.insert(value.charCodeAt(0));
        drawTree(canvasRef?.current, tree, isChar);
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form
        className={styles.controls}
        onSubmit={(e) => {
          e.preventDefault();
          insert();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          aria-label={isChar ? "Letter to insert" : "Number to insert"}
          placeholder={isChar ? "letter" : "number"}
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
        <button type="submit">Insert</button>
        <label>
          <input type="checkbox" onChange={() => setIsChar(!isChar)} />
          Char tree
        </label>
        {message && <span role="alert">{message}</span>}
      </form>

      <div>
        <canvas ref={canvasRef} id="canvas" width="10" height="500"></canvas>
      </div>
    </div>
  );
};

export default Tree;
