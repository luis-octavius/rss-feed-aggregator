import { db } from "..";
import { feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
  const [createdFeed] = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
  return createdFeed;
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedUser(userID: string) {
  const [feed] = await db
    .select({ userName: users.name })
    .from(users)
    .innerJoin(feeds, eq(users.id, userID));
  return feed;
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}
