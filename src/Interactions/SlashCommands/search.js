import { ApplicationCommandOptionType } from "discord.js";
import SlashCommand from "../../structures/SlashCommand.js";

export default new SlashCommand({
  data: {
    name: "search",
    description: "Search command with autocomplete",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "query",
        description: "The search query",
        autocomplete: true,
        required: true,
      },
    ],
  },
  execute: async (interaction, client) => {
    const query = interaction.options.getString("query");
    await interaction.reply({
      content: `🔍 Search completed for: **${query}**`,
      ephemeral: true,
    });
  },
});
