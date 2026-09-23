import { RBTNode, RBTree } from "./RedBlackTree";

  const vGap = 40;
  const radius = 20;

 function draw(canvas: HTMLCanvasElement | null, tree: RBTree, isChar: boolean) {
    if (canvas === null) return;
    // let canvas: any = canvasRef.current;
    const context = canvas?.getContext("2d"); //.current.getContext("2d");
    if (context === null) return;

    // Reset size will clear the canvas, but not for IE9
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 180;
    context?.clearRect(0, 0, canvas.width, canvas.height); // For IE 9

    context.font = "14px sans-serif";
    context.strokeStyle = "#100"; // Set a pen color
    context.strokeStyle = "#fff";
    context.lineWidth = 2;

    if (tree.isEmpty()) {
      context.fillText("tree is empty", canvas.width / 2 - 50, 15);
    } else {
      const x = canvas.width / 2;
      const y = 30;

      drawTree(context, x, y, radius, tree.root, canvas.width / 4, isChar);
    }

    context.stroke();
  }

  function drawTree(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    root: RBTNode,
    hGap: number,
    isChar: boolean
  ) {
    if (root === null) return;
    if (root.isRed()) {
      context.fillStyle = "#EB0D1B";
    } else {
      context.fillStyle = "black";
    }

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();

    context.fillStyle = "white";

    if (!isChar) {
      if ((root.element + "").length === 1)
        context.fillText(root.element + "", x - 3, y + 5);
      else if ((root?.element + "").length === 2)
        context.fillText(root.element + "", x - 8, y + 5);
      else if ((root.element + "").length === 3)
        context.fillText(root.element + "", x - 12, y + 5);
      else if ((root?.element + "").length === 4)
        context.fillText(root.element + "", x - 16, y + 5);
      else context.fillText(root.element + "", x - 8, y + 5);
    } else {
      context.fillText(String.fromCharCode(+root.element) + "", x - 4, y + 5);
    }

    if (root.left != null) {
      connectTwoCircles(context, x, y, x - hGap, y + vGap);
      context.moveTo(x - hGap + radius, y + vGap);
      drawTree(context, x - hGap, y + vGap, radius, root.left, hGap / 2, isChar);
    }

    if (root.right != null) {
      connectTwoCircles(context, x, y, x + hGap, y + vGap);
      context.moveTo(x + hGap + radius, y + vGap);
      drawTree(context, x + hGap, y + vGap, radius, root.right, hGap / 2, isChar);
    }
  }

  // Connect two circles centered at (x1, y1) and (x2, y2)
  function connectTwoCircles(
    context:CanvasRenderingContext2D ,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    context.fillStyle = "black";
    const d = Math.sqrt(vGap * vGap + (x2 - x1) * (x2 - x1));
    const x11 = x1 - (radius * (x1 - x2)) / d;
    const y11 = y1 - (radius * (y1 - y2)) / d;
    const x21 = x2 + (radius * (x1 - x2)) / d;
    const y21 = y2 + (radius * (y1 - y2)) / d;
    context.moveTo(x11, y11);
    context.lineTo(x21, y21);

    context.stroke();
  }

  export default draw;