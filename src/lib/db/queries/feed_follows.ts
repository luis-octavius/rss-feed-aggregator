import { db } from "..";
import { feeds, feedFollows, users } from "../schema";
import { eq, and } from "drizzle-orm";

export type FeedFollows = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  feedName: string;
  userName: string;
};

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({
      userId: userId,
      feedId: feedId,
    })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .where(
      and(
        eq(users.id, newFeedFollow.userId),
        eq(feeds.id, newFeedFollow.feedId),
      ),
    );
  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId));

  return result;
}
