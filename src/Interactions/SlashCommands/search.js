import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/SlashCommand.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search command with autocomplete")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The search query")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  execute: async (interaction, client) => {
    const query = interaction.options.getString("query");
    await interaction.reply({
      content: `🔍 Search completed for: **${query}**`,
      ephemeral: true,
    });
  },
});
