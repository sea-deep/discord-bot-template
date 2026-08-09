import { Message, Client } from "discord.js";
import MessageCommand from "../../structures/MessageCommand.js";

export default new MessageCommand({
  name: "ping",
  description: "Check the bot's latency.",
  aliases: ["pong", "latency"],
  guildOnly: true,
  cooldown: 5000,
  execute: async (message: Message, args: string[], client: Client) => {
    const msg = await message.reply("Calculating latency...");
    const latency = msg.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    await msg.edit(`🏓 Pong!\n**Latency**: \`${latency}ms\`\n**API Latency**: \`${apiLatency}ms\``);
  },
});
