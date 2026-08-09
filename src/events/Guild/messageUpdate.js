import Event from "../../structures/Event.js";
import Logger from "../../helpers/Logger.js";

export default new Event({
  event: "messageUpdate",
  execute: async (oldMessage, newMessage, client) => {
    // Ignore direct messages or bots, or if content didn't change
    if (!newMessage.guild || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    Logger.info(`Message edited in channel #${newMessage.channel.name} (Guild: ${newMessage.guild.name})`);
    Logger.info(`Old Content: "${oldMessage.content || "[No Content]"}"`);
    Logger.info(`New Content: "${newMessage.content || "[No Content]"}"`);
  },
});
