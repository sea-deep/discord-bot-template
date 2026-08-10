import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";
import { getLoaderPattern } from "./pathResolver.js";

/**
 * Dynamically registers User and Message Context Menu application commands.
 */
async function loadContextMenus(): Promise<void> {
  try {
    const userPattern = getLoaderPattern("Interactions/UserContextMenus");
    const userFiles = await glob(userPattern);

    for (const file of userFiles) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(fileUrl);
      const command = module.default;

      if (!command || !command.data || !command.name) continue;

      // Resolve category fallback based on parent folder name
      if (!command.category) {
        const parts = file.replace(/\\/g, "/").split("/");
        const parentFolder = parts[parts.length - 2];
        command.category = (parentFolder === "UserContextMenus" || parentFolder === "dist") ? "general" : parentFolder.toLowerCase();
      } else {
        command.category = command.category.toLowerCase();
      }

      client.userContextMenus.set(command.name, command);
      client.slashCommandsArray.push(command.data);
    }

    const messagePattern = getLoaderPattern("Interactions/MessageContextMenus");
    const messageFiles = await glob(messagePattern);

    for (const file of messageFiles) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(fileUrl);
      const command = module.default;

      if (!command || !command.data || !command.name) continue;

      // Resolve category fallback based on parent folder name
      if (!command.category) {
        const parts = file.replace(/\\/g, "/").split("/");
        const parentFolder = parts[parts.length - 2];
        command.category = (parentFolder === "MessageContextMenus" || parentFolder === "dist") ? "general" : parentFolder.toLowerCase();
      } else {
        command.category = command.category.toLowerCase();
      }

      client.messageContextMenus.set(command.name, command);
      client.slashCommandsArray.push(command.data);
    }

    Logger.success(`Loaded ${client.userContextMenus.size} User Context Menus and ${client.messageContextMenus.size} Message Context Menus!`);
  } catch (err) {
    Logger.error("Error loading Context Menus:", err);
  }
}

await loadContextMenus();
