import { ApplicationCommandOptionType } from "discord.js";
import HybridCommand from "../../structures/HybridCommand.js";
import config from "../../../Configs/config.js";

const optionTypeNames = {
  [ApplicationCommandOptionType.Subcommand]: "Subcommand",
  [ApplicationCommandOptionType.SubcommandGroup]: "Subcommand Group",
  [ApplicationCommandOptionType.String]: "String",
  [ApplicationCommandOptionType.Integer]: "Integer",
  [ApplicationCommandOptionType.Boolean]: "Boolean",
  [ApplicationCommandOptionType.User]: "User",
  [ApplicationCommandOptionType.Channel]: "Channel",
  [ApplicationCommandOptionType.Role]: "Role",
  [ApplicationCommandOptionType.Mentionable]: "Mentionable",
  [ApplicationCommandOptionType.Number]: "Number",
  [ApplicationCommandOptionType.Attachment]: "Attachment",
};

export default new HybridCommand({
  name: "help",
  description: "View the help menu or details of a specific command.",
  aliases: ["h", "commands"],
  usage: "[command|subcommand]",
  category: "information",
  options: [
    {
      name: "command",
      description: "The command or subcommand to view detailed help for.",
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true,
    },
  ],
  cooldown: 3000,
  guildOnly: false,
  execute: async (ctx, client) => {
    const prefix = config.commands.prefix;
    const isSlash = ctx.isSlash;

    // Helper to format command name based on type and context
    const formatCmd = (cmd) => {
      if (cmd.commandType === "prefix") return `${prefix}${cmd.name}`;
      if (cmd.commandType === "slash") return `/${cmd.name}`;
      return isSlash ? `/${cmd.name}` : `${prefix}${cmd.name}`;
    };

    const query = ctx.options.getString("command")?.toLowerCase().trim();

    // Gather unique commands map
    const uniqueCommands = new Map();
    client.prefixCommands.forEach((cmd) => uniqueCommands.set(cmd.name.toLowerCase(), cmd));
    client.slashCommands.forEach((cmd) => uniqueCommands.set(cmd.data.name.toLowerCase(), cmd));

    // --- CASE 1: Detailed Command/Subcommand View ---
    if (query) {
      let targetCmd = uniqueCommands.get(query);
      let isSub = false;

      // Check if it's a subcommand directly (e.g. "hello world")
      if (!targetCmd && client.subCommands.has(query)) {
        targetCmd = client.subCommands.get(query);
        isSub = true;
      }

      if (!targetCmd) {
        return await ctx.reply({
          content: `❌ Command or Subcommand \`${query}\` was not found.`,
          ephemeral: true,
        });
      }

      const botIcon = client.user.displayAvatarURL();
      const embed = {
        type: "rich",
        color: 0xe08e67,
        author: {
          name: client.user.username,
          icon_url: botIcon,
        },
        fields: [],
      };

      if (isSub) {
        // Subcommand details
        const formattedPath = query.split(" ").map(w => w.toLowerCase()).join(" ");
        embed.title = query.toUpperCase();
        embed.description = `*${targetCmd.description || "No description provided."}*`;
        embed.fields.push(
          { name: "Format", value: `\`/${formattedPath}\``, inline: true },
          { name: "Parent Command", value: `\`/${query.split(" ")[0]}\``, inline: true }
        );

        // Subcommand options
        const subOptions = targetCmd.options || [];
        if (subOptions.length > 0) {
          const list = subOptions
            .map(opt => `🔹 **${opt.name}** (${optionTypeNames[opt.type] || "Unknown"})${opt.required ? ' *' : ''}: *${opt.description}*`)
            .join("\n");
          embed.fields.push({ name: "Options (* = required)", value: list });
        }
      } else {
        // Parent Command details
        embed.title = targetCmd.name.toUpperCase();
        embed.description = `*${targetCmd.description || "No description provided."}*`;
        
        embed.fields.push(
          { name: "Format", value: `\`${formatCmd(targetCmd)} ${targetCmd.usage || ""}\``.trim(), inline: true },
          { name: "Category", value: targetCmd.category ? targetCmd.category.toUpperCase() : "GENERAL", inline: true }
        );

        if (targetCmd.aliases && targetCmd.aliases.length > 0) {
          embed.fields.push({ name: "Aliases", value: targetCmd.aliases.map(a => `\`${prefix}${a}\``).join(", "), inline: true });
        }

        if (targetCmd.cooldown) {
          embed.fields.push({ name: "Cooldown", value: `\`${targetCmd.cooldown / 1000}s\``, inline: true });
        }

        // Programmatic Permissions Display
        if (targetCmd.permissions?.user && targetCmd.permissions.user.length > 0) {
          embed.fields.push({
            name: "Required Permissions",
            value: targetCmd.permissions.user.map(p => `\`${p}\``).join(", "),
            inline: true,
          });
        }

        // Examples formatting
        if (targetCmd.examples && targetCmd.examples.length > 0) {
          const currentPrefix = isSlash ? "/" : prefix;
          const exList = targetCmd.examples.map(ex => `\`${currentPrefix}${ex}\``).join("\n");
          embed.fields.push({ name: "Examples", value: exList });
        }

        // Subcommands list if parent has subcommands registered
        const parentPrefix = `${targetCmd.name} `;
        const subcommandsList = [];
        client.subCommands.forEach((_, key) => {
          if (key.startsWith(parentPrefix)) {
            subcommandsList.push(`\`/${key}\``);
          }
        });

        if (subcommandsList.length > 0) {
          embed.fields.push({ name: "Subcommands", value: subcommandsList.join("\n") });
        }

        // Options details
        const optionsList = targetCmd.options || [];
        if (optionsList.length > 0) {
          const list = optionsList
            .map(opt => `🔹 **${opt.name}** (${optionTypeNames[opt.type] || "Unknown"})${opt.required ? ' *' : ''}: *${opt.description}*`)
            .join("\n");
          embed.fields.push({ name: "Arguments (* = required)", value: list });
        }
      }

      return await ctx.reply({ embeds: [embed] });
    }

    // --- CASE 2: General Help View & Categories Select Menu ---
    const defaultCategory = "general";
    const categories = new Set();
    uniqueCommands.forEach((cmd) => {
      if (cmd.category) categories.add(cmd.category);
    });

    const categoryList = [...categories];
    if (categoryList.length === 0) categoryList.push(defaultCategory);

    // Build Select Menu Options
    const selectOptions = categoryList.map((cat) => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
      description: `Browse ${cat} commands`,
    }));

    // Filter commands belonging to default category
    const defaultCommands = Array.from(uniqueCommands.values()).filter(
      (cmd) => cmd.category === defaultCategory
    );

    const formattedList = defaultCommands
      .map((cmd) => `🔹 \`${formatCmd(cmd)}\` - *${cmd.description || "No description provided."}*`)
      .join("\n");

    const botIcon = client.user.displayAvatarURL();
    const currentPrefix = isSlash ? "/" : prefix;

    const embed = {
      type: "rich",
      title: "General",
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

    const components = [
      {
        type: 1, // ActionRow
        components: [
          {
            type: 3, // StringSelectMenu
            custom_id: "help-category",
            placeholder: "Select category...",
            options: selectOptions,
          },
        ],
      },
    ];

    await ctx.reply({ embeds: [embed], components });
  },
});
