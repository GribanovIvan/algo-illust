const getString = (text: string, varient: number) => {
  switch (varient) {
    case 12: {
      const loremLines = text.split('\n');
      [loremLines[0], loremLines[loremLines.length - 1]] = [loremLines[loremLines.length - 1], loremLines[0]];
      const loremString = loremLines.join('\n');
      return loremString;
    }
    case 8: {
      const pattern = /([a-zA-Z]{\d})|(\([a-zA-Z]*\){\d})/g;
      const matches = text.match(pattern);
      console.log(matches);
      
      if (matches) {
        matches.forEach(match => {
          if (match !== null) {
            // if it's first group
            if (match[0] !== '(') {
              const [char, count] = match.split('{');
              const newChar = char.repeat(Number(count.slice(0, count.length - 1)));
              text = text.replace(match, newChar);
            }
            // if it's second group
            else {
              const [bracketed, count] = match.split('{');
              const group = bracketed.slice(1, bracketed.length - 1);
              const newGroup = group.repeat(Number(count.slice(0, count.length - 1)));
              text = text.replace(match, newGroup);
            } 
          }
        });
        console.log(text);
      }
      return text;
    }
    default: {
      return text;
    }
  }
}

export default getString;
