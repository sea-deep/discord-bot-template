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
      // Resolve category fallback based on parent folder name
      if (!command.category) {
        const parts = file.split("/");
        const parentFolder = parts[parts.length - 2];
        command.category = (parentFolder === "PrefixCommands") ? "general" : parentFolder.toLowerCase();
      } else {
        command.category = command.category.toLowerCase();
      }

      client.prefixCommands.set(command.name, command);
    }
  }
  Logger.success(`Loaded ${client.prefixCommands.size} Prefix Commands!`);
} catch (err) {
  Logger.error("Error loading Message Commands:", err);
}
