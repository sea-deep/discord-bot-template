import { ChatInputCommandInteraction, Client } from "discord.js";
import SubCommand from "../../../structures/SubCommand.js";

export default new SubCommand({
  subCommand: "hello world",
  execute: async (interaction: ChatInputCommandInteraction, client: Client) => {
    await interaction.reply({
      content: "👋 Hello, World! This response was routed dynamically from a subcommand file!",
      flags: 64, // MessageFlags.Ephemeral
    });
  },
});
