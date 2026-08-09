import { ApplicationCommandOptionType } from "discord.js";
import HybridCommand from "../../structures/HybridCommand.js";

export default new HybridCommand({
  name: "say",
  description: "Make the bot repeat a message.",
  aliases: ["echo", "repeat"],
  usage: "<channel> <text>",
  examples: [
    "say #general Hello World",
    "echo #announcements Important announcement!"
  ],
  options: [
    {
      name: "channel",
      description: "Channel to send the message in",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "text",
      description: "The text to repeat",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  cooldown: 5000,
  guildOnly: true,
  ephemeral: true, // auto-deferred slash reply will be ephemeral
  permissions: {
    bot: ["SendMessages"],
    user: ["ManageMessages"],
  },
  execute: async (ctx, client) => {
    const channel = ctx.options.getChannel("channel");
    const text = ctx.options.getString("text");

    // Enforce send permission on target channel
    if (!channel.permissionsFor(ctx.guild.members.me).has("SendMessages")) {
      return await ctx.reply({
        content: `❌ I do not have permission to send messages in ${channel}!`,
        ephemeral: true,
      });
    }

    await channel.send({ content: text });

    // With auto-defer enabled, ctx.reply maps to editReply automatically
    await ctx.reply({
      content: `... Sent!`,
      ephemeral: true,
    });
  },
});
