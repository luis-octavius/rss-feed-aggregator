import { db } from "..";
import { feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: userId })
    .returning();
  return result;
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedUser(userID: string) {
  const [result] = await db
    .select({ userName: users.name })
    .from(users)
    .innerJoin(feeds, eq(users.id, userID));
  return result;
}
