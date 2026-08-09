import { ApplicationCommandOptionType } from "discord.js";
import SlashCommand from "../../structures/SlashCommand.js";

export default new SlashCommand({
  data: {
    name: "hello",
    description: "Hello command group",
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "world",
        description: "A hello world subcommand example",
      },
    ],
  },
  options: {
    cooldown: 5000,
  },
});
