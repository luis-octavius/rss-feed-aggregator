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
  handlerAddFeed,
  handlerListFeeds,
} from "./commands/feeds.js";
import {
  handlerFollow,
  handlerFollowing,
  handlerUnfollow,
} from "./commands/feed_follows.js";
import { middlewareLoggedIn } from "./lib/middleware.js";

async function main() {
  let registry: CommandsRegistry = {};

  // registering handlers
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerListUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerListFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));

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
