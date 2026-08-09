import { REST, Routes } from "discord.js";
import config from "../../Configs/config.js";
import Logger from "../helpers/Logger.js";

/**
 * Registers application commands globally or to a specific development guild.
 * @param {import("discord.js").Client} client 
 */
export default async function registerCommands(client) {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN || client.token);

  const commandData = client.slashCommandsArray || [];

  if (commandData.length === 0) {
    Logger.info("No Slash Commands to register.");
    return;
  }

  try {
    Logger.info(`Started refreshing ${commandData.length} application (/) commands...`);

    if (config.development.enabled) {
      Logger.info(`Registering commands to development guild: ${config.development.guildId}`);
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, config.development.guildId),
        { body: commandData }
      );
    } else {
      Logger.info("Registering commands globally...");
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commandData }
      );
    }

    Logger.success("Successfully reloaded application (/) commands!");
  } catch (error) {
    Logger.error("Failed to register application (/) commands:", error);
  }
}
