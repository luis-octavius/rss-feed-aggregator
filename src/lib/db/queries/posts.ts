import { db } from "..";
import { feedFollows, posts } from "../schema";
import type { RSSItem } from "../../../commands/rss";
import { eq, desc } from "drizzle-orm";

export async function createPost(post: RSSItem, feedId: string) {
  const [newPost] = await db
    .insert(posts)
    .values({
      url: post.link,
      title: post.title,
      description: post.description ?? "",
      publishedAt: post.pubDate,
      feedId: feedId,
    })
    .onConflictDoNothing()
    .returning();

  return newPost;
}

export async function getPostsForUser(userId: string, limit?: number) {
  const userPosts = await db
    .select({
      title: posts.title,
      description: posts.description,
      url: posts.url,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .limit(limit ? limit : 10)
    .orderBy(desc(posts.publishedAt));
  return userPosts;
}
