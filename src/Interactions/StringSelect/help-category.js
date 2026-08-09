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
    const userId = ctx.user.id;
    const isDev = (config.users.developers || []).includes(userId) || config.users.ownerId === userId;

    // Gather all unique commands, filtering dev/owner commands for non-devs
    const uniqueCommands = new Map();
    client.prefixCommands.forEach((cmd) => {
      if ((cmd.developerOnly || cmd.ownerOnly) && !isDev) return;
      uniqueCommands.set(cmd.name, cmd);
    });
    client.slashCommands.forEach((cmd) => {
      if ((cmd.options?.developerOnly || cmd.options?.ownerOnly) && !isDev) return;
      uniqueCommands.set(cmd.name, cmd);
    });

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
    const currentPrefix = isSlash ? "/" : prefix;

    const embed = {
      type: "rich",
      title: categoryTitle,
      description: config.messages.HELP_DESCRIPTION,
      color: 0xe08e67,
      author: {
        name: client.user.username,
        icon_url: botIcon,
      },
      fields: [
        {
          name: "Commands",
          value: formattedList || "*No commands found in this category.*",
          inline: false,
        }
      ],
      footer: {
        text: `Use ${currentPrefix}help [command] for detailed instructions.`,
      },
    };

    await interaction.update({ embeds: [embed] });
  },
});
