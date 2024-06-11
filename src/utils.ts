export const firstLetter = (str: string): [string, string] => {
  if (str.length === 0) {
    return [null, ''];
  }

  return [str.charAt(0), str.slice(1)];
};

export const getErrorMessage = (got: string, ...expected: string[]) => {
  return `Expected one of {${[...new Set(expected)].filter((ch) => ch).join(', ')}}, but got ${got}`;
};
