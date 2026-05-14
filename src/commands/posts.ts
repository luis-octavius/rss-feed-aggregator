import { getPostsForUser } from "src/lib/db/queries/posts";
import type { User } from "src/lib/db/schema";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit;
  if (args && args.length == 1) {
    limit = Number(args[0]);
    if (Number.isNaN(limit)) {
      limit = 2;
    }
  }

  try {
    const posts = await getPostsForUser(user.id, limit);
    if (posts.length === 0) {
      throw new Error("There is no posts for the actual user");
    }
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Error at handlerBrowse",
    );
  }
}
