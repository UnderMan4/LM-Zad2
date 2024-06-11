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
   openedParens = 0;
   iterator = 0;
   expression = "";

   private evaluate = (input: string) => {
      this.s(input);
   };

   /**
    * Get the first set of a production
    * @param prod
    * @returns array of first set
    * */
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

   /**
    * Get the follow set of a production. This is used only for error handling.
    * @param prod
    * @returns array of follow set
    * */
   private follow = (prod: Productions) => {
      switch (prod) {
         case "S":
            return [];
         case "W":
            if (this.openedParens > 0) {
               return [")", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            }
            return [";", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
         case "C":
            if (this.openedParens > 0) {
               return ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", ":", "^", ")"];
            }
            return ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", ":", "^", ";"];
         case "O":
            return ["(", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      }
   };

   /**
    * Production S = (W, ";"), ({W, ";"});
    * @param x
    * @returns
    * @throws SyntaxError
    * */
   private s = (x: string) => {
      this.expression = x;

      if (x.length === 0) {
         return;
      }

      const [firstChar] = firstLetter(x);

      if (!this.first("S").includes(firstChar)) {
         throw new SyntaxError(this.expression, firstChar, this.iterator, ...this.first("S"));
      }

      let restAfterSemicolon = x;

      do {
         const restAfterW = this.w(restAfterSemicolon);

         const [firstCharAfterW] = firstLetter(restAfterW);

         if (firstCharAfterW !== ";") {
            throw new SyntaxError(this.expression, firstCharAfterW, this.iterator, ";");
         }

         this.iterator++;

         restAfterSemicolon = restAfterW.slice(1);
      } while (this.first("S").includes(restAfterSemicolon.charAt(0)));
   };

   /**
    * Production W = ((C, {C}),  ['.', (C, {C})] | ("(", W, ")")), [O, W];
    * @param x
    * @returns
    * @throws SyntaxError
    * */
   private w = (x: string): string => {
      if (x.length === 0) {
         return "";
      }

      const [firstChar, rest] = firstLetter(x);

      if (!this.first("W").includes(firstChar)) {
         throw new SyntaxError(this.expression, firstChar, this.iterator, ...this.first("W"));
      }

      let restAfterP: null | string = null;

      if (firstChar === "(") {
         // ("(", W, ")"), [O, W];
         this.openedParens++;

         this.iterator++;

         const restAfterW = this.w(rest);

         const [firstCharAfterW, restAfterClosingParenthesis] = firstLetter(restAfterW);

         if (!this.follow("W").includes(firstCharAfterW)) {
            throw new SyntaxError(
               this.expression,
               firstCharAfterW,
               this.iterator,
               ...this.follow("W").filter((ch) => ch !== ";")
            );
         }

         if (![";", ...this.first("O")].includes(restAfterClosingParenthesis.charAt(0))) {
            if (this.openedParens === 0) {
               throw new SyntaxError(
                  this.expression,
                  restAfterClosingParenthesis.charAt(0),
                  this.iterator,
                  ";",
                  ...this.first("O")
               );
            }
            if (!restAfterClosingParenthesis.startsWith(")")) {
               throw new SyntaxError(
                  this.expression,
                  restAfterClosingParenthesis.charAt(0),
                  this.iterator,
                  ";",
                  ")",
                  ...this.first("O")
               );
            }
         }

         restAfterP = restAfterClosingParenthesis;

         this.iterator++;

         this.openedParens--;
      } else if (this.first("C").includes(firstChar)) {
         // (C, {C}),  ['.', (C, {C})] | ("(", W, ")")), [O, W];
         let restAfterC = x;
         let restAfterC2: null | string = null;
         do {
            restAfterC = this.c(restAfterC);
         } while (this.first("C").includes(restAfterC.charAt(0)));

         if (![".", ...this.follow("W"), ...this.first("O")].includes(restAfterC.charAt(0))) {
            throw new SyntaxError(
               this.expression,
               restAfterC.charAt(0),
               this.iterator,
               ".",
               ...this.follow("W"),
               ...this.first("O")
            );
         }

         if (restAfterC.startsWith(".")) {
            // ['.', (C, {C})]
            restAfterC2 = restAfterC.slice(1);

            this.iterator++;
            do {
               restAfterC2 = this.c(restAfterC2);
            } while (this.first("C").includes(restAfterC2.charAt(0)));
         }

         restAfterP = restAfterC2 || restAfterC;
      }

      if (this.first("O").includes(restAfterP.charAt(0))) {
         // [O, W];
         const restAfterO = this.o(restAfterP);
         const restAfterW = this.w(restAfterO);
         return restAfterW;
      }

      return restAfterP;
   };

   /**
    * Production C = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    * @param x
    * @returns
    * @throws SyntaxError
    * */
   private c = (x: string): string => {
      if (x.length === 0) {
         return "";
      }

      const [firstChar] = firstLetter(x);

      if (!this.first("C").includes(firstChar)) {
         throw new SyntaxError(this.expression, firstChar, this.iterator, ...this.first("C"));
      }

      this.iterator++;

      return x.slice(1);
   };

   /**
    * Production O = "+" | "-" | "*" | ":" | "^";
    * @param x
    * @returns
    * @throws SyntaxError
    * */
   private o = (x: string): string => {
      if (x.length === 0) {
         return "";
      }

      const [firstChar] = firstLetter(x);

      if (!this.first("O").includes(firstChar)) {
         throw new SyntaxError(this.expression, firstChar, this.iterator, ...this.first("O"));
      }

      this.iterator++;

      return x.slice(1);
   };

   /**
    * Evaluate the input string
    * @param input
    * @throws SyntaxError
    * */
   public static readonly evaluate = (input: string) => {
      new Grammar().evaluate(input);
   };
}
