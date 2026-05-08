import { XMLParser } from "fast-xml-parser";
import { createFeed, getFeeds, getFeedUser } from "src/lib/db/queries/feeds";
import type { Feed, User } from "../lib/db/schema";
import { getCurrentUser } from "./users";
import { getUserByName } from "src/lib/db/queries/users";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    method: "GET",
    headers: {
      "User-Agent": "gator",
    },
  });

  const options = {
    processEntities: false,
  };

  const xmlText = await response.text();
  const parser = new XMLParser(options);

  const xmlParsed = parser.parse(xmlText);
  const channel = xmlParsed.rss.channel;

  if (!isValidChannel(channel)) {
    throw new Error("Channel is not valid");
  }

  // extract metadata
  let items = [];

  if ("item" in channel) {
    if (Array.isArray(channel.item)) {
      items = channel.item;
    } else {
      items = [];
    }
  }

  const parsedItems: RSSItem[] = [];
  for (const item of items) {
    if (!isValidItem(item)) {
      continue;
    }

    parsedItems.push({
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: item.pubDate,
    });
  }

  const feed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: parsedItems,
    },
  };

  return feed;
}

function isValidChannel(channel: any): boolean {
  return "title" in channel && "link" in channel && "description" in channel;
}

function isValidItem(item: any): item is RSSItem {
  return (
    typeof item?.title === "string" &&
    typeof item?.link === "string" &&
    typeof item?.description === "string" &&
    typeof item?.pubDate === "string"
  );
}

function printFeed(feed: Feed, userName: string) {
  console.log("-------------------------");
  console.log(`Feed Name: ${feed.name}`);
  console.log(`Feed URL: ${feed.url}`);
  console.log(`User: ${userName}`);
  console.log("-------------------------");
}

/* -------- Handlers ---------------------- */
export async function handlerAgg() {
  try {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed, null, 2));
  } catch (err) {
    console.error(err);
  }
}

export async function handlerCreateFeed(cmdName: string, ...args: string[]) {
  if (args.length != 2) {
    throw new Error("Create feed expects two arguments");
  }

  const [name, url] = args;

  const userName = getCurrentUser();

  try {
    const [user] = await getUserByName(userName);
    const feed = await createFeed(name, url, user.id);
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
      const userName = await getFeedUserName(feed.user_id as string);
      printFeed(feed, userName);
    }
  } catch (error) {}
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
