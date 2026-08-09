import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";
import { getLoaderPattern } from "./pathResolver.js";

/**
 * Dynamically registers prefix-based message commands from the PrefixCommands folder.
 */
async function loadPrefixCommands(): Promise<void> {
  try {
    const pattern = getLoaderPattern("PrefixCommands");
    const files = await glob(pattern);

    for (let file of files) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(fileUrl);
      const command = module.default;

      if (command && command.name) {
        // Resolve category fallback based on parent folder name
        if (!command.category) {
          const parts = file.replace(/\\/g, "/").split("/");
          const parentFolder = parts[parts.length - 2];
          command.category = (parentFolder === "PrefixCommands" || parentFolder === "dist") ? "general" : parentFolder.toLowerCase();
        } else {
          command.category = command.category.toLowerCase();
        }

        (client as any).prefixCommands.set(command.name, command);
      }
    }
    Logger.success(`Loaded ${(client as any).prefixCommands.size} Prefix Commands!`);
  } catch (err) {
    Logger.error("Error loading Message Commands:", err);
  }
}

await loadPrefixCommands();
