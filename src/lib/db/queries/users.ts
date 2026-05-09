import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(name: string) {
  const [createdUser] = await db
    .insert(users)
    .values({ name: name })
    .returning();
  return createdUser;
}

export async function getUserByName(name: string) {
  const [user] = await db.select().from(users).where(eq(users.name, name));
  return user;
}

export async function deleteAllUsers() {
  const result = await db.delete(users);
  return result;
}

export async function getUsers() {
  const result = await db.select().from(users);
  return result;
}
