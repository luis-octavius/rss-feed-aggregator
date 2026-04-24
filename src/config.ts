import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(user: string) {
  let cfg = {
    dbUrl: "postgres://example",
    currentUserName: user,
  };

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
