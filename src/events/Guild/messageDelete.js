import Event from "../../structures/Event.js";
import Logger from "../../helpers/Logger.js";

export default new Event({
  event: "messageDelete",
  execute: async (message, client) => {
    // Ignore direct messages or bots
    if (!message.guild || message.author?.bot) return;

    Logger.info(`Message deleted in channel #${message.channel.name} (Guild: ${message.guild.name})`);
    
    // A clean console/log preview of deleted content
    if (message.content) {
      Logger.info(`Deleted Content (Author: ${message.author?.tag || "Unknown"}): "${message.content}"`);
    }
  },
});
