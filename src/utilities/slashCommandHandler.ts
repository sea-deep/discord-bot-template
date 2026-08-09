import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";
import { getLoaderPattern } from "./pathResolver.js";

(client as any).slashCommandsArray = [];

/**
 * Dynamically registers standard application commands and subcommands.
 */
async function loadSlashCommands(): Promise<void> {
  try {
    const pattern = getLoaderPattern("Interactions/SlashCommands");
    const files = await glob(pattern);

    for (let file of files) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(fileUrl);
      const command = module.default;

      if (!command) continue;

      if (command.subCommand) {
        (client as any).subCommands.set(command.subCommand, command);
        continue;
      }

      if (command.data && command.data.name) {
        // Resolve category fallback based on parent folder name
        if (!command.category) {
          const parts = file.replace(/\\/g, "/").split("/");
          const parentFolder = parts[parts.length - 2];
          command.category = (parentFolder === "SlashCommands" || parentFolder === "dist") ? "general" : parentFolder.toLowerCase();
        } else {
          command.category = command.category.toLowerCase();
        }

        (client as any).slashCommands.set(command.data.name, command);
        (client as any).slashCommandsArray.push(command.data);
      }
    }
    Logger.success(`Loaded ${(client as any).slashCommands.size} Slash Commands and ${(client as any).subCommands.size} Subcommands!`);
  } catch (err) {
    Logger.error("Error loading Slash Commands:", err);
  }
}

await loadSlashCommands();
