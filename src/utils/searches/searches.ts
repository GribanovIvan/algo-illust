type SearchArray = string | number[];
type TableObjectType = {[key: string]: number};

export const binarySearch = async (arr: SearchArray, target: number | string, render: Function): Promise<[number[] | null, number]> => {
  let start = 0;
  let end = arr.length - 1;
  let steps = 0;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    steps++;
    await render(mid);
    if (arr[mid] === target) {
      let cur = mid;
      const result = [mid];
      // find all occurences
      while (arr[--cur] === target) {
        result.unshift(cur);
        await render(cur);
      } 
      cur = mid;
      while (arr[++cur] === target) {
        result.push(cur);
        await render(cur);
      }
      return [result, steps];
    } else if (arr[mid] < target) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return [null, steps];
};

export const kmpSearch = async (str: string, target: string, render: Function): Promise<[number | null, number]> => {
  const lps = getLps(target);
  let i = 0;
  let j = 0;
  let steps = 0;
  while (i < str.length) {
    steps++;
    if (str[i] === target[j]) {
      await render({red: {searchIn: i, searchFor: j}});
      i++;
      j++;
      if (j === target.length) {
        const found = i - j;
        await render({found: Array.from({length: target.length}, (_, index) => index + found)});
        return [found, steps];
      }
    } else if (j > 0) {
      await render({orange: {searchIn: i, searchFor: j}});
      j = lps[j - 1];
      i -= j;
      j =  0;
    } else {
      await render({orange: {searchIn: i, searchFor: j}});
      i++;
    }
  }
  return [null, steps];
}

const buildBadMatchTable = (str: string) => {
  const tableObj: TableObjectType = {}
  const strLength = str.length
  for (let i = 0; i < strLength - 1; i++) {
    tableObj[str[i]] = Math.max(strLength - 1 - i, 1);
  }
  if (tableObj[str[strLength - 1]] === undefined) {
    tableObj[str[strLength - 1]] = strLength
  }
  return tableObj;
}

export const bmSearch = async (str: string, target: string, render: Function): Promise<[number | null, number]> => {
  const badMatchTable: TableObjectType = buildBadMatchTable(target);

  let offset = 0;
  const maxOffset = str.length - target.length;
  const lastTargetIndex = target.length - 1;
  let steps = 0;
  while (offset <= maxOffset) {
    let scanIndex = lastTargetIndex;
    steps++;
    while (target[scanIndex] === str[scanIndex + offset]) {
      await render({red: {searchIn: offset + scanIndex, searchFor: scanIndex}});
      if (scanIndex === 0) {
        const found = offset;
        await render({found: Array.from({length: target.length}, (_, index) => index + found)});
        return [found, steps]
      }
      scanIndex--;
    }
    const badMatchChar = str[offset + lastTargetIndex]
    if (badMatchTable[badMatchChar as keyof TableObjectType]) {
      offset += badMatchTable[badMatchChar];
    } else {
      offset += target.length;
    }
    await render({orange: {searchIn: offset, searchFor: scanIndex}});
  }
  return [null, steps]
}

const getLps = (target: string): number[] => {
  const lps = new Array(target.length).fill(0);
  let i = 1;
  let j = 0;
  while (i < target.length) {
    if (target[i] === target[j]) {
      lps[i] = j + 1;
      i++;
      j++;
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
  return lps;
}
