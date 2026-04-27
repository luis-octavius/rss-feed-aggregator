import { setUser } from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = {
  commands: Record<string, CommandHandler>;
};

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0 || args[0] === undefined) {
    throw new Error("login expects a name as an argument");
  }

  const userName = args[0];

  setUser(userName);

  console.log(`User ${userName} has been set.`);
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry.commands[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry.commands[cmdName];

  handler(cmdName, ...args);
}
