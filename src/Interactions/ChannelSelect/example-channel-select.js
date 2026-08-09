import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-channel-select",
  type: "channelSelect",
  execute: async (interaction, client) => {
    const channel = interaction.channels.first();
    await interaction.reply({
      content: `📺 Channel Select Menu selected: **#${channel?.name || "Unknown"}**`,
      ephemeral: true,
    });
  },
});
