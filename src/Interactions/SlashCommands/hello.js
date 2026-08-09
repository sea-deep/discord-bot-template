import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/SlashCommand.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Hello command group")
    .addSubcommand((sub) =>
      sub
        .setName("world")
        .setDescription("A hello world subcommand example")
    ),
  options: {
    cooldown: 5000,
  },
});
