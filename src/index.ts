import { argv, exit } from "node:process";
import { readConfig, setUser } from "./config.js";
import {
  registerCommand,
  type CommandsRegistry,
  handlerLogin,
  runCommand,
} from "./commands.js";

function main() {
  let registry: CommandsRegistry = {
    commands: {},
  };

  registerCommand(registry, "login", handlerLogin);

  const cliArgs = argv.slice(2);

  if (cliArgs.length === 0) {
    console.error("At least one argument must be provided");
    exit(1);
  }

  console.log(cliArgs);
  const [commandName, args] = cliArgs;

  runCommand(registry, commandName, args);
}

main();
