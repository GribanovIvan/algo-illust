import { BRTreeArrayElement } from "../types/ds.types";

type TreeNodeValue = string | number;

class RBTreeNode {
  public element: TreeNodeValue;
  public left: RBTreeNode | null;
  public right: RBTreeNode | null;
  public red: boolean;
  static RBTreeNode: RBTreeNode;

  constructor(e: TreeNodeValue) {
    this.element = e;
    this.left = null;
    this.right = null;
    this.red = true; 
  }
  isRed() {
    return this.red;
  }

  isBlack() {
    return !this.red;
  }

  setBlack() {
    this.red = false;
  }

  setRed() {
    this.red = true;
  }
}

export type RBTNode = RBTreeNode | null;

// Binary search tree
class BST {
  public root: RBTNode;
  public size: number;

  constructor() {
    this.root = null;
    this.size = 0;
  }

  // Returns true if the element is in the tree
  search(value: TreeNodeValue) {
    let current = this.root; 
    while (current !== null) {
      if (value < current.element) {
        current = current.left;
      } else if (value > current.element) {
        current = current.right;
      } 
      else return true; 
    }
    return false;
  }

  searchNode(value: TreeNodeValue) {
    let current = this.root; 

    while (current != null) {
      if (value < current.element) {
        current = current.left;
      } else if (value > current.element) {
        current = current.right;
      }
      else return current;
    }
    return null;
  }

  insert(value: TreeNodeValue) {
    if (this.root == null)
      this.root = this.createNewNode(value); 
    else {
      // Locate the parent node
      let parent = null;
      let current: RBTNode = this.root;
      while (current != null)
        if (value < current.element) {
          parent = current;
          current = current.left;
        } else if (value > current.element) {
          parent = current;
          current = current.right;
        } else return false; // Duplicate node not inserted

      // Create the new node and attach it to the parent node
      if ( parent === null) return false;
      if (value < parent.element) {
        parent.left = this.createNewNode(value);
      } else {
        parent.right = this.createNewNode(value);
      }
    }
    this.size++;
    return true; 
  }
  createNewNode(value: TreeNodeValue) {
    return new RBTreeNode(value);
  }

  remove(value: TreeNodeValue) {
    let parent = null;
    let current = this.root;
    while (current != null) {
      if (value < current.element) {
        parent = current;
        current = current.left;
      } else if (value > current.element) {
        parent = current;
        current = current.right;
      } else break; // Element is in the tree pointed at by current
    }

    if (current == null) return false; 

    // Case 1: current has no left children
    if (current.left == null) {
      // Connect the parent with the right child of the current node
      if (parent == null) {
        this.root = current.right;
      } else {
        if (value < parent.element) parent.left = current.right;
        else parent.right = current.right;
      }
    } else {
      // Case 2: The current node has a left child
      // Locate the rightmost node in the left subtree of
      // the current node and also its parent
      let parentOfRightMost = current;
      let rightMost = current.left;

      while (rightMost.right != null) {
        parentOfRightMost = rightMost;
        rightMost = rightMost.right; // Keep going to the right
      }

      // Replace the element in current by the element in rightMost
      current.element = rightMost.element;

      // Eliminate rightmost node
      if (parentOfRightMost.right === rightMost)
        parentOfRightMost.right = rightMost.left;
      // Special case: parentOfRightMost == current
      else parentOfRightMost.left = rightMost.left;
    }

    this.size--;
    return true;
  }

  clear() {
    this.root = null;
    this.size = 0;
  }

  isEmpty() {
    return this.root == null;
  }

  getSize() {
    return this.size;
  }

  // Returns a path from the root leading to the specified element
  path(value: TreeNodeValue) {
    let list: RBTNode[] = [];
    let current = this.root; // Start from the root

    while (current != null) {
      list.push(current); // Add the node to the list
      if (value < current.element) {
        current = current.left;
      } else if (value > current.element) {
        current = current.right;
      } else break;
    }

    return list; // Return an array of nodes
  }

  getRoot() {
    return this.root;
  }

  getInOrder(node: RBTNode, t: Array<BRTreeArrayElement>): Array<BRTreeArrayElement> {
    if (node != null) {
      this.getInOrder(node.left, t);
      t.push({ value: node.element, red: node.red });
      this.getInOrder(node.right, t);
      return t;
    } else return [];
  }
  
  getPreorder(root: RBTNode): string {
    if (root != null) {
      return (
        root.element +
        " " +
        this.getPreorder(root.left) +
        " " +
        this.getPreorder(root.right)
      );
    } else return "";
  }
  getPostorder(root: RBTNode): string {
    if (root != null)
      return (
        this.getPostorder(root.left) +
        " " +
        this.getPostorder(root.right) +
        " " +
        root.element
      );
    else return "";
  }
}

export class RBTree extends BST {
  static RBTree: BST;

  remove(value: TreeNodeValue) {
    return this.delete(value);
  }

  createNewNode(value: TreeNodeValue): RBTreeNode {
    return new RBTreeNode(value);
  }

  insert(value: TreeNodeValue) {
    let successful = BST.prototype.insert.call(this, value);
    if (!successful) return false; // e is already in the tree
    else {
      this.ensureRBTree(value);
    }

    return true; // e is inserted
  }
  /** Ensure that the tree is a red-black tree */
  ensureRBTree(e: TreeNodeValue) {
    // Get the path that leads to element e from the this.root
    let path = this.path(e);

    let i = path.length - 1; // Index to the current node in the path

    // u is the last node in the path. u contains element e
    let u = path[i];

    // v is the parent of of u, if exists
    let v = u === this.root ? null : path[i - 1];

    u?.setRed(); // It is OK to set u red

    if (u === this.root)
      // If e is inserted as the this.root, set this.root black
      u?.setBlack();
    else if (v?.isRed()) this.fixDoubleRed(u, v, path, i); // Fix double red violation at u
  }
  /** Fix double red violation at node u */
  fixDoubleRed(
    u: RBTNode,
    v: RBTNode,
    path: RBTNode[],
    i: number
  ) {
    // w is the grandparent of u; a path shorter than that has nothing to fix
    // (undefined slips past a === null check, so compare loosely)
    let w = path[i - 2];
    if (u == null || v == null || w == null) return;
    let parentOfw = w === this.root ? null : path[i - 3];

    // Get v's sibling named x
    let x = (w.left === v ? w.right : w.left);
    if (x == null || x.isBlack()) {
      // Case 1: v's sibling x is black
      if (w.left === v && v.left === u) {
        // Case 1.1: u < v < w, Restructure and recolor nodes
        this.restructureRecolor(u, v, w, w, parentOfw);

        w.left = v.right; // v.right is y3 in Figure 11.7
        v.right = w;
      } else if (w.left === v && v.right === u) {
        // Case 1.2: v < u < w, Restructure and recolor nodes
        this.restructureRecolor(v, u, w, w, parentOfw);
        v.right = u?.left ?? null;
        w.left = u?.right ?? null;
        u.left = v;
        u.right = w;
      } else if (w.right === v && v.right === u) {
        // Case 1.3: w < v < u, Restructure and recolor nodes
        this.restructureRecolor(w, v, u, w, parentOfw);
        w.right = v.left;
        v.left = w;
      } else {
        // Case 1.4: w < u < v, Restructure and recolor nodes
        this.restructureRecolor(w, u, v, w, parentOfw);
        w.right = u.left;
        v.left = u.right;
        u.left = w;
        u.right = v;
      }
    } else {
      // Case 2: v's sibling x is red
      // Recolor nodes
      w.setRed();
      u.setRed();
      (w.left)?.setBlack();
      (w.right)?.setBlack();

      if (w === this.root) {
        w.setBlack();
      } else if (parentOfw?.isRed()) {
        // Propagate along the path to fix new double red violation
        u = w;
        v = parentOfw;
        this.fixDoubleRed(u, v, path, i - 2); // i – 2 propagates upward
      }
    }
  }
  /** Connect b with parentOfw and recolor a, b, c for a < b < c */
  restructureRecolor(
    a: RBTNode,
    b: RBTNode,
    c: RBTNode,
    w: RBTNode,
    parentOfw: RBTNode
  ) {
    if (parentOfw == null) this.root = b;
    else if (parentOfw.left === w) parentOfw.left = b;
    else parentOfw.right = b;

    b?.setBlack(); // b becomes the this.root in the subtree
    a?.setRed(); // a becomes the left child of b
    c?.setRed(); // c becomes the right child of b
  }
  /** Delete the last node from the path. */
  deleteLastNodeInPath(path: RBTNode[]) {
    let i = path.length - 1; // Index to the node in the path

    // u is the last node in the path
    let u = path[i];
    let parentOfu = u === this.root ? null : path[i - 1];
    let grandparentOfu =
      parentOfu == null || parentOfu === this.root ? null : path[i - 2];
    let childOfu = u?.left == null ? u?.right : u.left;

    // Delete node u. Connect childOfu with parentOfu
    this.connectNewParent(parentOfu, u, childOfu ?? null);

    // Recolor the nodes and fix double black if needed
    if (childOfu === this.root || u?.isRed())
      return; // Done if childOfu is this.root or if u is red
    else if (childOfu != null && childOfu.isRed())
      childOfu.setBlack(); // Set it black, done
    // u is black, childOfu is null or black
    // Fix double black on parentOfu
    else this.fixDoubleBlack(grandparentOfu, parentOfu, childOfu ?? null, path, i);
  }
  /** Fix the double black problem at node parent */
  fixDoubleBlack(
    grandparent: RBTNode,
    parent: RBTNode,
    db: RBTNode,
    path: RBTNode[],
    i: number
  ) {
    // Obtain y, y1, and y2
    let y = parent?.right === db ? parent.left : parent?.right ?? null;
    let y1 = y?.left ?? null;
    let y2 = y?.right ?? null;
    if (parent === null || y === null) return;
    if (y?.isBlack() && y1 != null && y1.isRed()) {
      if (parent?.right === db) {
        // Case 1.1: y is a left black sibling and y1 is red
        this.connectNewParent(grandparent, parent, y);
        this.recolor(parent, y, y1); // Adjust colors

        // Adjust child links
        parent.left = y.right;
        y.right = parent;
      } else {
        // Case 1.3: y is a right black sibling and y1 is red
        this.connectNewParent(grandparent, parent, y1);
        this.recolor(parent, y1, y); // Adjust colors

        // Adjust child links

        parent.right = y1.left;
        y.left = y1.right;
        y1.left = parent;
        y1.right = y;
      }
    } else if (y?.isBlack() && y2 != null && y2.isRed()) {
      if (parent?.right === db) {
        // Case 1.2: y is a left black sibling and y2 is red
        this.connectNewParent(grandparent, parent, y2);
        this.recolor(parent, y2, y); // Adjust colors

        // Adjust child links
        y.right = y2.left;
        parent.left = y2.right;
        y2.left = y;
        y2.right = parent;
      } else {
        // Case 1.4: y is a right black sibling and y2 is red
        this.connectNewParent(grandparent, parent, y);
        this.recolor(parent, y, y2); // Adjust colors

        // Adjust child links
        y.left = parent;
        parent.right = y1;
      }
    } else if (y?.isBlack()) {
      // Case 2: y is black and y's children are black or null
      y.setRed(); // Change y to red
      if (parent.isRed()) parent.setBlack(); // Done
      else if (parent !== this.root) {
        // Propagate double black to the parent node
        // Fix new appearance of double black recursively
        db = parent;
        parent = grandparent;
        grandparent = i >= 3 ? path[i - 3] : null;
        this.fixDoubleBlack(grandparent, parent, db, path, i - 1);
      }
    } else {
      // y.isRed()
      if (parent.right === db) {
        // Case 3.1: y is a left red child of parent
        parent.left = y2;
        y.right = parent;
      } else {
        // Case 3.2: y is a right red child of parent
        parent.right = y?.left ?? null;
        y.left = parent;
      }

      parent.setRed(); // Color parent red
      y?.setBlack(); // Color y black
      this.connectNewParent(grandparent, parent, y); // y is new parent
      this.fixDoubleBlack(y, parent, db, path, i - 1);
    }
  }
  /** Recolor parent, newParent, and c. Case 1 removal */
  recolor(
    parent: RBTNode,
    newParent: RBTNode,
    c: RBTNode
  ) {
    // Retain the parent's color for newParent
    if (parent?.isRed()) newParent?.setRed();
    else newParent?.setBlack();

    // c and parent become the children of newParent, set them black
    parent?.setBlack();
    c?.setBlack();
  }
  /** Connect newParent with grandParent */
  connectNewParent(
    grandparent: RBTNode,
    parent: RBTNode,
    newParent: RBTNode
  ) {
    if (parent === this.root) {
      this.root = newParent;
      if (this.root != null) newParent?.setBlack();
    } else if (grandparent?.left === parent) grandparent.left = newParent;
    else if (grandparent !== null) grandparent.right = newParent;
  }
  delete(e: TreeNodeValue) {
    // Locate the node to be deleted
    let current = this.root;
    while (current != null) {
      if (e < current.element) {
        current = current.left;
      } else if (e > current.element) {
        current = current.right;
      } else break; // Element is in the tree pointed by current
    }

    if (current == null) return false; // Element is not in the tree

    let path;

    // current node is an internal node
    if (current.left != null && current.right != null) {
      // Locate the rightmost node in the left subtree of current
      let rightMost = current.left;
      while (rightMost.right != null) {
        rightMost = rightMost.right; // Keep going to the right
      }

      path = this.path(rightMost.element); // Get path before replacement

      // Replace the element in current by the element in rightMost
      current.element = rightMost.element;
    } else path = this.path(e); // Get path to current node

    // Delete the last node in the path and propagate if needed
    this.deleteLastNodeInPath(path);

    this.size--; // After one element deleted
    return true; // Element deleted
  }
}