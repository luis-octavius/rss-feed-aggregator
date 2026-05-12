import type { CommandHandler, UserCommandHandler } from "src/commands/commands";
import type { User } from "./db/schema";
import { getCurrentUser } from "src/commands/users";
import { getUserByName } from "./db/queries/users";

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const userName = getCurrentUser();
    try {
      const user = await getUserByName(userName);
      if (!user) {
        throw new Error(`User ${userName} does not exist`);
      }
      await handler(cmdName, user, ...args);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Erro");
    }
  };
}
