import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";

try {
  // Matches all files inside StringSelect, UserSelect, RoleSelect, MentionableSelect, ChannelSelect
  const files = await glob(`${process.cwd().replace(/\\/g, "/")}/src/Interactions/*Select/**/*.js`);

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

    Logger.info(`Loaded Select Menu (${component.type}): ${component.customId}`);
  }
  Logger.success("Select Menu Components loaded successfully!");
} catch (err) {
  Logger.error("Error loading Select Menu Components:", err);
}
