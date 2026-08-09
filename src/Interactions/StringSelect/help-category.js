import Component from "../../structures/Component.js";
import CommandContext from "../../helpers/CommandContext.js";
import config from "../../../Configs/config.js";

export default new Component({
  customId: "help-category",
  type: "stringSelect",
  execute: async (interaction, client) => {
    const ctx = new CommandContext(interaction);

    // 1. Ownership check - only the user who ran the help command can paginate
    if (ctx.user.id !== ctx.originalAuthor.id) {
      return await interaction.reply({
        content: "❌ You cannot control this help menu! Run your own `/help` or `d!help` command.",
        ephemeral: true,
      });
    }

    const selectedCategory = interaction.values[0];

    // Gather all unique commands
    const uniqueCommands = new Map();
    client.prefixCommands.forEach((cmd) => uniqueCommands.set(cmd.name, cmd));
    client.slashCommands.forEach((cmd) => uniqueCommands.set(cmd.name, cmd));

    const prefix = config.commands.prefix;
    const isSlash = ctx.messageInteraction !== null;

    // Filter commands belonging to selected category
    const categoryCommands = Array.from(uniqueCommands.values()).filter(
      (cmd) => cmd.category === selectedCategory
    );

    const formattedList = categoryCommands
      .map((cmd) => {
        let cmdFormat = "";
        if (cmd.commandType === "prefix") {
          cmdFormat = `\`${prefix}${cmd.name}\``;
        } else if (cmd.commandType === "slash") {
          cmdFormat = `\`/${cmd.name}\``;
        } else {
          cmdFormat = isSlash ? `\`/${cmd.name}\`` : `\`${prefix}${cmd.name}\``;
        }
        return `🔹 ${cmdFormat} - *${cmd.description || "No description provided."}*`;
      })
      .join("\n");

    const categoryTitle = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    const botIcon = client.user.displayAvatarURL();

    const embed = {
      type: "rich",
      title: `📖 HELP PANEL - ${categoryTitle}`,
      description: formattedList || "*No commands found in this category.*",
      color: 0xe08e67,
      author: {
        name: `${client.user.username} - Help Desk`,
        icon_url: botIcon,
      },
      thumbnail: {
        url: botIcon,
      },
      timestamp: new Date().toISOString(),
      footer: {
        text: "Use /help [command] for detailed instructions.",
        icon_url: botIcon,
      },
    };

    await interaction.update({ embeds: [embed] });
  },
});
