export const firstLetter = (str: string): [string, string] => {
   if (str.length === 0) {
      return [null, ""];
   }

   return [str.charAt(0), str.slice(1)];
};

export class SyntaxError extends Error {
   constructor(expression: string, got: string, charNo: number, ...expected: string[]) {
      super(
         expected.length === 1
            ? `Expected '${expected[0]}', but got ${got ? "'" + got + "'" : "EOF"}\n` +
                 `${expression}\n${" ".repeat(charNo)}^`
            : `Expected one of {${[...new Set(expected)].map((ch) => "'" + ch + "'").join(", ")}}, but got ${got ? "'" + got + "'" : "EOF"}\n` +
                 `${expression}\n${" ".repeat(charNo)}^`
      );
   }
}
