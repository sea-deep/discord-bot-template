import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-role-select",
  type: "roleSelect",
  execute: async (interaction, client) => {
    const role = interaction.roles.first();
    await interaction.reply({
      content: `🎖 Role Select Menu selected: **${role?.name || "Unknown"}**`,
      ephemeral: true,
    });
  },
});
