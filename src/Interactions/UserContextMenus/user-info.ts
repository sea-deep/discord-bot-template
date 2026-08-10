import { UserContextMenuCommandInteraction, Client, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } from "discord.js";
import UserContextMenu from "../../structures/UserContextMenu.js";

export default new UserContextMenu({
  data: new ContextMenuCommandBuilder()
    .setName("User Info")
    .setType(ApplicationCommandType.User),
  options: {
    guildOnly: true,
  },
  execute: async (interaction: UserContextMenuCommandInteraction, client: Client) => {
    const targetUser = interaction.targetUser;
    const targetMember = interaction.targetMember;

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${targetUser.tag}`)
      .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
      .setColor(0x5865f2)
      .addFields(
        { name: "User ID", value: `\`${targetUser.id}\``, inline: true },
        { name: "Account Created", value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setTimestamp();

    if (targetMember && "joinedTimestamp" in targetMember && targetMember.joinedTimestamp) {
      embed.addFields({
        name: "Joined Server",
        value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:R>`,
        inline: true,
      });
    }

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
});
