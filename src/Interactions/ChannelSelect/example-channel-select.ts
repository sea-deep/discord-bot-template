import { ChannelSelectMenuInteraction, Client } from "discord.js";
import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-channel-select",
  type: "channelSelect",
  execute: async (interaction: ChannelSelectMenuInteraction, client: Client) => {
    const channel = interaction.channels.first();
    const name = channel && "name" in channel ? (channel as any).name : "Unknown";
    await interaction.reply({
      content: `📺 Channel Select Menu selected: **#${name}**`,
      flags: 64, // MessageFlags.Ephemeral
    });
  },
});
