import { ApplicationCommandOptionType } from "discord.js";
import HybridCommand from "../../structures/HybridCommand.js";

export default new HybridCommand({
  name: "say",
  description: "Make the bot repeat a message.",
  aliases: ["echo", "repeat"],
  usage: "<channel> <text>",
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
  permissions: {
    bot: ["SendMessages"],
    user: ["ManageMessages"],
  },
  run: async (ctx, client) => {
    const channel = ctx.options.getChannel("channel");
    const text = ctx.options.getString("text");

    // Check permissions
    if (!channel.permissionsFor(ctx.guild.members.me).has("SendMessages")) {
      return await ctx.reply({
        content: `❌ I do not have permission to send messages in ${channel}!`,
        ephemeral: true,
      });
    }

    await ctx.defer(true);

    await channel.send({ content: text });

    await ctx.editReply({
      content: `✅ Successfully sent message to ${channel}!`,
      ephemeral: true,
    });
  },
});
