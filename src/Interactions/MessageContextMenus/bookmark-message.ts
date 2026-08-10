import { MessageContextMenuCommandInteraction, Client, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } from "discord.js";
import MessageContextMenu from "../../structures/MessageContextMenu.js";

export default new MessageContextMenu({
  data: new ContextMenuCommandBuilder()
    .setName("Bookmark Message")
    .setType(ApplicationCommandType.Message),
  options: {
    guildOnly: true,
  },
  execute: async (interaction: MessageContextMenuCommandInteraction, client: Client) => {
    const targetMessage = interaction.targetMessage;

    const embed = new EmbedBuilder()
      .setTitle("📑 Bookmarked Message")
      .setDescription(targetMessage.content || "*(No text content)*")
      .setAuthor({
        name: targetMessage.author.tag,
        iconURL: targetMessage.author.displayAvatarURL(),
      })
      .setColor(0xfee75c)
      .addFields(
        { name: "Channel", value: `<#${targetMessage.channelId}>`, inline: true },
        { name: "Jump Link", value: `[Go to Message](${targetMessage.url})`, inline: true }
      )
      .setTimestamp(targetMessage.createdAt);

    try {
      await interaction.user.send({ embeds: [embed] });
      await interaction.reply({
        content: "✅ Message bookmarked to your Direct Messages!",
        flags: 64,
      });
    } catch {
      await interaction.reply({
        content: "❌ Failed to send DM. Please check your privacy settings.",
        flags: 64,
      });
    }
  },
});
