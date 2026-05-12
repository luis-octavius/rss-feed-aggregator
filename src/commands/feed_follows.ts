import {
  createFeedFollow,
  FeedFollows,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";
import { getCurrentUser } from "./users";
import { getUserByName } from "src/lib/db/queries/users";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import type { User } from "src/lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length != 1) {
    throw new Error("Single argument (url) not provided");
  }

  const url = args[0];

  try {
    const feed = await getFeedByUrl(url);
    const createdFeedFollows = await createFeedFollow(user.id, feed.id);
    printFeedFollow(createdFeedFollows);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : `${cmdName}: Error in following`,
    );
  }
}

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  try {
    const followedFeeds = await getFeedFollowsForUser(user.id);
    for (const feed of followedFeeds) {
      console.log(feed.feedName);
    }
  } catch (error) {
    throw new Error(`${cmdName}: Erro`);
  }
}

function printFeedFollow(feedFollow: FeedFollows) {
  console.log(`Feed Name: ${feedFollow.feedName}`);
  console.log(`User Name: ${feedFollow.userName}`);
}
