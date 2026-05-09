import { argv, exit } from "node:process";
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerListUsers,
} from "./commands/users.js";
import {
  runCommand,
  registerCommand,
  type CommandsRegistry,
} from "./commands/commands.js";
import {
  handlerAgg,
  handlerCreateFeed,
  handlerListFeeds,
} from "./commands/feeds.js";
import { handlerFollow, handlerFollowing } from "./commands/feed_follows.js";

async function main() {
  let registry: CommandsRegistry = {};

  // registering handlers
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerListUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerCreateFeed);
  registerCommand(registry, "feeds", handlerListFeeds);
  registerCommand(registry, "follow", handlerFollow);
  registerCommand(registry, "following", handlerFollowing);

  const cliArgs = argv.slice(2);

  if (cliArgs.length === 0) {
    console.error("At least one argument must be provided");
    exit(1);
  }

  const [commandName, ...args] = cliArgs;

  try {
    await runCommand(registry, commandName, ...args);
  } catch (err) {
    console.error(err);
    exit(1);
  }

  exit(0);
}

main();
