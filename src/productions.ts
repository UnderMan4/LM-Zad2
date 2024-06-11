import { SyntaxError, firstLetter } from "./utils.js";

type Productions = "S" | "W" | "C" | "O";

/**
 * This class defines grammar for this productions:
 *
 * S = (W, ";"), ({W, ";"});
 * W = ((C, {C}),  ['.', (C, {C})] | ("(", W, ")")), [O, W];
 * C = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
 * O = "+" | "-" | "*" | ":" | "^";
 **/
export class Grammar {
   private evaluate = (input: string) => {
      this.s(input);
   };

   private first = (prod: Productions) => {
      switch (prod) {
         case "S":
            return ["(", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
         case "W":
            return ["(", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
         case "C":
            return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
         case "O":
            return ["+", "-", "*", ":", "^"];
      }
   };

   private s = (x: string) => {
      console.log("s", x);

      if (x.length === 0) {
         return;
      }

      const [firstChar] = firstLetter(x);

      if (!this.first("S").includes(firstChar)) {
         throw new SyntaxError(firstChar, ...this.first("S"));
      }

      let restAfterSemicolon = x;

      do {
         const restAfterW = this.w(restAfterSemicolon);

         const [firstCharAfterW] = firstLetter(restAfterW);

         if (firstCharAfterW !== ";") {
            throw new SyntaxError(firstCharAfterW, ";");
         }

         restAfterSemicolon = restAfterW.slice(1);
      } while (this.first("S").includes(restAfterSemicolon.charAt(0)));
   };

   private w = (x: string): string => {
      console.log("w", x);

      if (x.length === 0) {
         return "";
      }

      const [firstChar, rest] = firstLetter(x);

      if (!this.first("W").includes(firstChar)) {
         throw new SyntaxError(firstChar, ...this.first("W"));
      }

      let restAfterP: null | string = null;

      if (firstChar === "(") {
         const restAfterW = this.w(rest);

         const [firstCharAfterW, restAfterClosingParenthesis] =
            firstLetter(restAfterW);

         if (firstCharAfterW !== ")") {
            throw new SyntaxError(firstCharAfterW, ")");
         }

         restAfterP = restAfterClosingParenthesis;
      } else {
         let restAfterC = x;
         let restAfterC2: null | string = null;
         do {
            restAfterC = this.c(restAfterC);
         } while (this.first("C").includes(restAfterC.charAt(0)));

         if (restAfterC.startsWith(".")) {
            restAfterC2 = restAfterC.slice(1);
            do {
               restAfterC2 = this.c(restAfterC2);
            } while (this.first("C").includes(restAfterC2.charAt(0)));
         }

         restAfterP = restAfterC2 || restAfterC;
      }

      if (this.first("O").includes(restAfterP.charAt(0))) {
         const restAfterO = this.o(restAfterP);
         const restAfterW = this.w(restAfterO);
         return restAfterW;
      }

      return restAfterP;
   };
   private c = (x: string): string => {
      console.log("c", x);

      if (x.length === 0) {
         return "";
      }

      const [firstChar] = firstLetter(x);

      if (!this.first("C").includes(firstChar)) {
         throw new SyntaxError(firstChar, ...this.first("C"));
      }

      return x.slice(1);
   };
   private o = (x: string): string => {
      console.log("o", x);

      if (x.length === 0) {
         return "";
      }

      const [firstChar] = firstLetter(x);

      if (!this.first("O").includes(firstChar)) {
         throw new SyntaxError(firstChar, ...this.first("O"));
      }

      return x.slice(1);
   };

   public static readonly evaluate = (input: string) => {
      new Grammar().evaluate(input);
   };
}

