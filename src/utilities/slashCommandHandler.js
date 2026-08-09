import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";

client.slashCommandsArray = [];

try {
  const files = await glob(`${process.cwd().replace(/\\/g, "/")}/src/Interactions/SlashCommands/**/*.js`);

  for (let file of files) {
    const fileUrl = pathToFileURL(file).href;
    const module = await import(fileUrl);
    const command = module.default;

    if (!command) continue;

    if (command.subCommand) {
      client.subCommands.set(command.subCommand, command);
      Logger.info(`Loaded Subcommand: ${command.subCommand}`);
      continue;
    }

    if (command.data && command.data.name) {
      client.slashCommands.set(command.data.name, command);
      client.slashCommandsArray.push(command.data);
      Logger.info(`Loaded Slash Command: ${command.data.name}`);
    }
  }
  Logger.success("Slash Commands loaded successfully!");
} catch (err) {
  Logger.error("Error loading Slash Commands:", err);
}
