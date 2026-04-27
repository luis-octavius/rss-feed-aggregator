import { argv, exit } from "node:process";
import { handlerLogin, handlerRegister } from "./commands/users.js";
import {
  runCommand,
  registerCommand,
  type CommandsRegistry,
} from "./commands/commands.js";

async function main() {
  let registry: CommandsRegistry = {};

  // registering handlers
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);

  const cliArgs = argv.slice(2);

  if (cliArgs.length === 0) {
    console.error("At least one argument must be provided");
    exit(1);
  }

  const [commandName, args] = cliArgs;

  try {
    await runCommand(registry, commandName, args);
  } catch (err) {
    console.error((err as Error).message);
  }

  process.exit(0);
}

main();
