import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";
import { getLoaderPattern } from "./pathResolver.js";

/**
 * Dynamically registers monolithic hybrid commands, binding them
 * as both legacy prefix commands and standard slash commands.
 */
async function loadHybridCommands(): Promise<void> {
  try {
    const pattern = getLoaderPattern("HybridCommands");
    const files = await glob(pattern);

    for (let file of files) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(fileUrl);
      const command = module.default;

      if (!command || !command.name) continue;

      // Resolve category fallback based on parent folder name
      if (!command.category) {
        const parts = file.replace(/\\/g, "/").split("/");
        const parentFolder = parts[parts.length - 2];
        command.category = (parentFolder === "HybridCommands" || parentFolder === "dist") ? "general" : parentFolder.toLowerCase();
      } else {
        command.category = command.category.toLowerCase();
      }

      // 1. Register as Prefix Command (with aliases)
      client.prefixCommands.set(command.name, command);
      if (command.aliases && Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
          client.prefixCommands.set(alias, command);
        }
      }

      // 2. Register as Slash Command (data mapped automatically)
      client.slashCommands.set(command.name, command);
      client.slashCommandsArray.push(command.data);
    }
    
    const hybridCount = client.slashCommandsArray.filter((cmd: any) => client.prefixCommands.has(cmd.name)).length;
    Logger.success(`Loaded ${hybridCount} Hybrid Commands!`);
  } catch (err) {
    Logger.error("Error loading Hybrid Commands:", err);
  }
}

await loadHybridCommands();
