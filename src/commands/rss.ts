import { XMLParser } from "fast-xml-parser";
import {
  getNextFeedToFetch,
  markFeedAsFetched,
} from "src/lib/db/queries/feeds";
import { Feed } from "src/lib/db/schema";

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

export async function scrapeFeeds() {
  try {
    const nextFeed = (await getNextFeedToFetch()) as Feed;
    if (!nextFeed) {
      throw new Error("There isn't a feed to fetch");
    }

    markFeedAsFetched(nextFeed.id);

    const fetchedFeed = await fetchFeed(nextFeed.url);
    for (const feed of fetchedFeed.channel.item) {
      console.log(feed.title);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Erro");
  }
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
