import { Guild, Client } from "discord.js";
import Event from "../../structures/Event.js";
import Logger from "../../helpers/Logger.js";

export default new Event({
  event: "guildDelete",
  execute: async (guild: Guild, client: Client) => {
    Logger.info(`Left/kicked from server: ${guild.name} (ID: ${guild.id})`);
    Logger.info(`Bot is now in ${client.guilds.cache.size} servers.`);
  },
});
