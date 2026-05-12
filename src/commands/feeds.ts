import { createFeed, getFeeds, getFeedUser } from "src/lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";
import type { Feed, User } from "../lib/db/schema";
import { fetchFeed, scrapeFeeds } from "./rss";

export async function handlerAgg(_: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error(`Argument for time not provided <time_between_reqs>`);
  }

  const duration = parseDuration(args[0]);
  if (!duration) {
    throw new Error(`Invalid duration: use 1h 100ms 50ms 100s`);
  }

  console.log(`Collecting feeds every ${duration}`);
  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, duration);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function handlerAddFeed(_: string, user: User, ...args: string[]) {
  if (args.length != 2) {
    throw new Error("Create feed expects two arguments");
  }

  const [name, url] = args;

  try {
    const feed = await createFeed(name, url, user.id);
    await createFeedFollow(user.id, feed.id);
    printFeed(feed, user.name);
  } catch (error) {
    console.error(error);
  }
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
  if (args.length != 0) {
    console.error(`${cmdName} does not need arguments`);
  }

  try {
    const feeds = await getFeeds();
    for (const feed of feeds) {
      const userName = await getFeedUserName(feed.userId);
      printFeed(feed, userName);
    }
  } catch (error) {
    throw new Error(`${cmdName}: Erro`);
  }
}

async function getFeedUserName(userID: string): Promise<string> {
  if (!userID) {
    return "";
  }

  try {
    const { userName } = await getFeedUser(userID);
    return userName;
  } catch (error) {
    console.error("Error getting user");
  }

  return "";
}

function printFeed(feed: Feed, userName: string) {
  console.log("-------------------------");
  console.log(`Feed Name: ${feed.name}`);
  console.log(`Feed URL: ${feed.url}`);
  console.log(`User: ${userName}`);
  console.log("-------------------------");
}

function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) return;

  if (match.length !== 3) return;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return;
  }
}

function handleError(error: unknown) {
  console.error(
    `Error during scrape feeds: ${error instanceof Error ? error.message : "Erro"}`,
  );
}
