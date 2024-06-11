import chalk from "chalk";
import { createInterface } from "readline";

import { Grammar } from "./productions.js";

const getExpression = () => {
   const readLine = createInterface({
      input: process.stdin,
      output: process.stdout,
   });

   readLine.question("Enter a string: ", (input) => {
      if (!input || input === "") {
         readLine.close();
         return;
      }

      try {
         Grammar.evaluate(input);
      } catch (error) {
         console.error(chalk.red.inverse(error.message));
      }
      readLine.close();

      getExpression();
   });
};

getExpression();
