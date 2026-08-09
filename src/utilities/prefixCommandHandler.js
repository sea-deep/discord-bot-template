import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";

try {
  const files = await glob(`${process.cwd().replace(/\\/g, "/")}/src/PrefixCommands/**/*.js`);

  for (let file of files) {
    const fileUrl = pathToFileURL(file).href;
    const module = await import(fileUrl);
    const command = module.default;

    if (command && command.name) {
      client.prefixCommands.set(command.name, command);
      Logger.info(`Loaded Message Command: ${command.name}`);
    }
  }
  Logger.success(`Message Commands loaded successfully!`);
} catch (err) {
  Logger.error("Error loading Message Commands:", err);
}
