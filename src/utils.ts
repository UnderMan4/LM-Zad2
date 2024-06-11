export const firstLetter = (str: string): [string, string] => {
   if (str.length === 0) {
      return [null, ""];
   }

   return [str.charAt(0), str.slice(1)];
};

export class SyntaxError extends Error {
   constructor(got: string, ...expected: string[]) {
      super(
         expected.length === 1
            ? `Expected '${expected[0]}', but got '${got || "EOF"}'`
            : `Expected one of {${[...new Set(expected)].map((ch) => "'" + ch + "'").join(", ")}}, but got '${got || "EOF"}'`
      );
   }
}
