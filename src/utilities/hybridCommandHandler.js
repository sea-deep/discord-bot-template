import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";

try {
  const files = await glob(`${process.cwd().replace(/\\/g, "/")}/src/HybridCommands/**/*.js`);

  for (let file of files) {
    const fileUrl = pathToFileURL(file).href;
    const module = await import(fileUrl);
    const command = module.default;

    if (!command || !command.name) continue;

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

    Logger.info(`Loaded Hybrid Command: ${command.name}`);
  }
  Logger.success(`Loaded ${client.slashCommandsArray.filter(cmd => client.prefixCommands.has(cmd.name)).length} Hybrid Commands!`);
} catch (err) {
  Logger.error("Error loading Hybrid Commands:", err);
}
