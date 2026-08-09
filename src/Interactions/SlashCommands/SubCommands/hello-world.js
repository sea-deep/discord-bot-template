import SubCommand from "../../../structures/SubCommand.js";

export default new SubCommand({
  subCommand: "hello world",
  execute: async (interaction, client) => {
    await interaction.reply({
      content: "👋 Hello, World! This response was routed dynamically from a subcommand file!",
      ephemeral: true,
    });
  },
});
