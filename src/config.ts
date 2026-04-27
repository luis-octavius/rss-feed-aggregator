import fs from "fs";
import os from "os";
import path from "path";
import { getUserByName } from "./lib/db/queries/users";
import { exit } from "node:process";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export async function setUser(userName: string) {
  const cfg = readConfig();

  try {
    const exists = await getUserByName(userName);

    if (exists.length === 0) {
      throw new Error(`User ${userName} does not exist`);
    }

    cfg.currentUserName = userName;
  } catch (err) {
    console.error((err as Error).message);
    exit(1);
  }

  writeConfig(cfg);
}

export function readConfig(): Config {
  const cfgFilePath = getConfigFilePath();
  const content = fs.readFileSync(cfgFilePath, { encoding: "utf-8" });

  return validateConfig(JSON.parse(content));
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const cfgFilePath = getConfigFilePath();
  fs.writeFileSync(cfgFilePath, JSON.stringify(cfg));
}

function validateConfig(rawConfig: any): Config {
  const jsonObj = JSON.stringify(rawConfig);
  const cfg = JSON.parse(jsonObj);

  if ("dbUrl" in cfg && "currentUserName" in cfg) {
    return cfg;
  }

  return {
    dbUrl: "",
    currentUserName: "",
  };
}
