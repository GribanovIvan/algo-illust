import CircularList from "../data_structures/circularList";
import Deque from "../data_structures/deque";
import DoublyLinkedList from "../data_structures/doublyLinkedList";
import LinkedList from "../data_structures/linkedList";
import Queue from "../data_structures/queue";
import Stack from "../data_structures/stack";

export const StackDS = Stack;
export const QueueDS = Queue;
export const DequeDS = Deque;
export const LinkedListDS = LinkedList;
export const DoublyLinkedListDS = DoublyLinkedList;
export const CircularListDS = CircularList;

export type OutletContextDS = [
  [DSArray, (array: DSArray) => void],
  DSTypeId,
  [DSStats | null, (stats: DSStats | null) => void]
];

export type DSTypeId =
  | "stack"
  | "queue"
  | "deque"
  | "linked-list"
  | "doubly-linked"
  | "circular-linked"
  | "tree";

export type DSClass =
  | typeof StackDS
  | typeof QueueDS
  | typeof DequeDS
  | typeof LinkedListDS
  | typeof DoublyLinkedListDS
  | typeof CircularListDS;

// the tree page has no statistics, so only linear structures map to a class
export type DSClassMap = {
  [key in Exclude<DSTypeId, "tree">]: DSClass;
};

export type DSType = {
  id: DSTypeId;
  name: string;
};

export type DSArrayElement = number | string;

export type DSArray = (number | string)[];

export type DSStats = {
  length: number;
  min: DSArrayElement;
  elBeforeMin: DSArrayElement;
  max: DSArrayElement;
  elAfterMax: DSArrayElement;
  thirdFromEnd: DSArrayElement;
  secondFromStart: DSArrayElement;
  searchValue: DSArrayElement;
  foundIndex: number | null;
  mergedArray: DSArray;
};


export type BRTreeArrayElement = {value: number | string; red: boolean};