import { MentionableSelectMenuInteraction, Client } from "discord.js";
import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-mentionable-select",
  type: "mentionableSelect",
  execute: async (interaction: MentionableSelectMenuInteraction, client: Client) => {
    const mentionable = interaction.members.first() || interaction.roles.first();
    const name = mentionable 
      ? ("displayName" in mentionable ? (mentionable as any).displayName : (mentionable as any).name)
      : "Unknown";

    await interaction.reply({
      content: `👥 Mentionable Select Menu selected: **${name}**`,
      flags: 64, // MessageFlags.Ephemeral
    });
  },
});
