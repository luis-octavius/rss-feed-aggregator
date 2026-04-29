import {
  createUser,
  getUserByName,
  deleteAllUsers,
  getUsers,
} from "../lib/db/queries/users.js";
import { setUser, readConfig } from "../config.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0 || args[0] === undefined) {
    throw new Error("login expects a name as an argument");
  }

  const userName = args[0];

  await setUser(userName);

  console.log(`User ${userName} has been set.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  const name = args[0];

  try {
    const user = await getUserByName(name);
    if (user.length > 0) {
      throw new Error(`User ${name} already exists.`);
    }
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }

  const createdUser = await createUser(name);
  console.log(`User ${name} was registered successfully`);

  console.log("Created user: ", createdUser);

  await setUser(name);
}

export async function handlerReset() {
  try {
    await deleteAllUsers();

    console.log("Successfully deleted all rows!");
  } catch (err) {
    console.error((err as Error).message);
  }
}

export async function handlerListUsers() {
  const config = readConfig();
  const loggedUser = config.currentUserName;

  const users = await getUsers();

  if (users.length === 0) {
    throw new Error("There are no users to list");
  }

  for (const user of users) {
    const msg =
      user.name === loggedUser ? `* ${user.name} (current)` : `* ${user.name}`;
    console.log(msg);
  }
}
