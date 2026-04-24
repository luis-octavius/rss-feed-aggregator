import { readConfig, setUser } from "./config.js";

function main() {
  const testOne = readConfig();
  console.log(testOne);

  setUser("Luis");

  const testTwo = readConfig();
  console.log(testTwo);
}

main();
