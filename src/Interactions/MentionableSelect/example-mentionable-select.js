import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-mentionable-select",
  type: "mentionableSelect",
  execute: async (interaction, client) => {
    const mentionable = interaction.members.first() || interaction.roles.first();
    await interaction.reply({
      content: `👥 Mentionable Select Menu selected: **${mentionable?.displayName || mentionable?.name || "Unknown"}**`,
      ephemeral: true,
    });
  },
});
