import chalk from "chalk";
import { createInterface } from "readline";

import { Grammar } from "./productions.js";

const getExpression = () => {
   const readLine = createInterface({
      input: process.stdin,
      output: process.stdout,
   });

   readLine.question(chalk.inverse("Enter an Expression:") + " ", (input) => {
      if (!input || input === "") {
         readLine.close();
         return;
      }

      try {
         console.log();

         Grammar.evaluate(input.replace(/\s/g, ""));

         console.log(chalk.green("The expression is correct!"));
      } catch (error) {
         console.error(chalk.red(error.message));
      }
      console.log();
      console.log();
      readLine.close();

      getExpression();
   });
};

getExpression();
