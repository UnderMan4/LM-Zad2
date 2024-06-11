export const firstLetter = (str: string): [string, string] => {
   if (str.length === 0) {
      return [null, ""];
   }

   return [str.charAt(0), str.slice(1)];
};

export class SyntaxError extends Error {
   constructor(got: string, ...expected: string[]) {
      super(
         expected.length === 0
            ? `Expected ${expected[0]}, but got ${got}`
            : `Expected one of {${[...new Set(expected)].filter((ch) => ch).join(", ")}}, but got ${got}`
      );
   }
}
