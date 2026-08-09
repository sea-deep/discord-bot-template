import { UserSelectMenuInteraction, Client } from "discord.js";
import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-user-select",
  type: "userSelect",
  execute: async (interaction: UserSelectMenuInteraction, client: Client) => {
    const user = interaction.users.first();
    await interaction.reply({
      content: `👤 User Select Menu selected: **${user?.tag || "Unknown"}**`,
      flags: 64, // MessageFlags.Ephemeral
    });
  },
});
