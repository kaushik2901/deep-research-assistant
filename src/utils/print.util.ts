import chalk from "chalk";

export function printGreen(...text: unknown[]) {
  console.log(chalk.green(text));
}

export function printYellow(...text: unknown[]) {
  console.log(chalk.yellow(text));
}
