import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";
import { getLoaderPattern } from "./pathResolver.js";

/**
 * Dynamically registers all 5 types of select menu interaction handlers.
 */
async function loadSelectMenus(): Promise<void> {
  try {
    const pattern = getLoaderPattern("Interactions/*Select");
    const files = await glob(pattern);

    for (let file of files) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(fileUrl);
      const component = module.default;

      if (!component || !component.customId || !component.type) continue;

      switch (component.type) {
        case "stringSelect":
          client.stringSelectMenus.set(component.customId, component);
          break;
        case "userSelect":
          client.userSelectMenus.set(component.customId, component);
          break;
        case "roleSelect":
          client.roleSelectMenus.set(component.customId, component);
          break;
        case "mentionableSelect":
          client.mentionableSelectMenus.set(component.customId, component);
          break;
        case "channelSelect":
          client.channelSelectMenus.set(component.customId, component);
          break;
        default:
          Logger.warn(`Unknown select menu type '${component.type}' in file: ${file}`);
          continue;
      }
    }
    const total = 
      client.stringSelectMenus.size + 
      client.userSelectMenus.size + 
      client.roleSelectMenus.size + 
      client.mentionableSelectMenus.size + 
      client.channelSelectMenus.size;

    Logger.success(`Loaded ${total} Select Menu Components!`);
  } catch (err) {
    Logger.error("Error loading Select Menu Components:", err);
  }
}

await loadSelectMenus();
