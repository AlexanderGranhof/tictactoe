import chalk from "chalk";

export const createLogger = (tag: string) => (...args: any[]) => console.log(chalk.yellow(tag), ...args);