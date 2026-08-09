import { Guild, Client } from "discord.js";
import Event from "../../structures/Event.js";
import Logger from "../../helpers/Logger.js";

export default new Event({
  event: "guildCreate",
  execute: async (guild: Guild, client: Client) => {
    Logger.info(`Joined a new server: ${guild.name} (ID: ${guild.id})`);
    Logger.info(`Bot is now in ${client.guilds.cache.size} servers.`);
  },
});
