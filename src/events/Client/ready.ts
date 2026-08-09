import { ActivityType, Client } from "discord.js";
import Event from "../../structures/Event.js";
import Logger from "../../helpers/Logger.js";
import registerCommands from "../../utilities/registerCommands.js";

export default new Event({
  event: "ready",
  once: true,
  execute: async (client: Client) => {
    Logger.success(`Logged in as ${client.user!.tag}!`);

    // Register / Update application commands dynamically
    await registerCommands(client);

    // Set activity
    client.user!.setActivity({
      name: "d!help or /help",
      type: ActivityType.Listening,
    });
  },
});
