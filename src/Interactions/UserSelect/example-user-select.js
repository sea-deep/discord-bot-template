import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-user-select",
  type: "userSelect",
  execute: async (interaction, client) => {
    const user = interaction.users.first();
    await interaction.reply({
      content: `👤 User Select Menu selected: **${user?.tag || "Unknown"}**`,
      ephemeral: true,
    });
  },
});
