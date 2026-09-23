import { useEffect, useMemo, useRef, useState } from "react";
import drawTree from "../../utils/data_structures/drawingTree";
import { RBTree } from "../../utils/data_structures/RedBlackTree";
import { BRTreeArrayElement } from "../../utils/types/ds.types";

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


  function compare(a: BRTreeArrayElement, b: BRTreeArrayElement) {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  }

  function isVowel(char: string) {
    if (char.length === 1) {
      const vowels = ["a", "e", "i", "o", "u"];
      return vowels.includes(char.toLowerCase());
    }
    return null;
  }

  function insert() {
    let nodesArray: Array<BRTreeArrayElement> = [];
    let input = inputRef.current;
    if (input === null) return;

    var value = input.value.trim();
    if (!isChar) {
      if (value === "" || !Number.isFinite(+value)) return;
      if (tree.search(+value)) {
        setMessage("key " + value + " is already in the tree");
      } else {
        setMessage("");
        tree.insert(+value);
        console.log(tree.getInOrder(tree.root, nodesArray));
        if (nodesArray.length > 1) {
          let sorted = nodesArray.sort(compare);
          let parent = tree.path(sorted[1].value);
          console.log(sorted[1], parent[parent.length - 2]);
        }
        drawTree(canvasRef?.current, tree, isChar);
      }
    } else {
      if (value === "" || value.length !== 1 || !value.match(/[a-z]/i)) return;
      if (tree.search(value.charCodeAt(0))) {
        setMessage("key " + value + " is already in the tree");
      } else {
        setMessage("");
        tree.insert(value.charCodeAt(0));
        console.log(tree.getInOrder(tree.root, nodesArray));
        let sorted = nodesArray.filter(e => !isVowel(String.fromCharCode(+e.value)));
        sorted = sorted.map(e => {
          return { value: String.fromCharCode(+e.value), red: e.red };
        });
        console.log(sorted);
        sorted.forEach((e) =>
          console.log({...tree.searchNode(e.value), element: e.value})
        );
        drawTree(canvasRef?.current, tree, isChar);
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          gap: "5px",
          borderRadius: "5px",
        }}
      >
        <button onClick={() => insert()}>Insert</button>
        <input
          ref={inputRef}
          type="text"
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
        <span>Char tree</span>
        <input type="checkbox" onChange={() => setIsChar(!isChar)} />
        {message && <span role="alert">{message}</span>}
      </div>

      <div>
        <canvas ref={canvasRef} id="canvas" width="10" height="500"></canvas>
      </div>
    </div>
  );
};

export default Tree;
