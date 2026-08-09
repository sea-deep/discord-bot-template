import Event from "../../structures/Event.js";
import Logger from "../../helpers/Logger.js";
import config from "../../../Configs/config.js";

export default new Event({
  event: "error",
  execute: async (error, client) => {
    Logger.error("Discord Client Error:", error);

    // Option to send error details to a specific developer/logging channel
    const errorChannelId = config.errorChannelId || process.env.ERROR_CHANNEL_ID;
    if (errorChannelId) {
      try {
        const channel = await client.channels.fetch(errorChannelId);
        if (channel && channel.isTextBased()) {
          const mention = config.users?.ownerId ? `<@${config.users.ownerId}>` : "";
          await channel.send({
            content: `⚠️ **An error occurred in the bot client:** ${mention}\n\`\`\`js\n${error.stack || error.message || error}\n\`\`\``,
          });
        }
      } catch (err) {
        Logger.error("Failed to send error details to the error channel:", err);
      }
    }
  },
});
