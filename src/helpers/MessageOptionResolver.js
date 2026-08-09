import { ApplicationCommandOptionType } from "discord.js";

/**
 * Normalizes text-based prefix command arguments so they mirror
 * the CommandInteractionOptionResolver API of Discord.js.
 */
export default class MessageOptionResolver {
  constructor(message, args, optionsList) {
    this.message = message;
    this.args = args;
    this.client = message.client;
    this.optionsList = optionsList || [];
    this.resolved = {};

    // 1. Separate subcommand/group arguments from parameters
    let paramIndex = 0;
    const hasSubcommandGroup = this.optionsList.some((opt) => opt.type === ApplicationCommandOptionType.SubcommandGroup);
    const hasSubcommand = this.optionsList.some((opt) => opt.type === ApplicationCommandOptionType.Subcommand);

    if (hasSubcommandGroup) {
      this.subcommandGroup = this.args[0] || null;
      this.subcommand = this.args[1] || null;
      paramIndex = 2; // Parameters start at index 2
    } else if (hasSubcommand) {
      this.subcommand = this.args[0] || null;
      paramIndex = 1; // Parameters start at index 1
    }

    // 2. Parse positional arguments mapping to the command options
    // Filter out subcommand options as we resolve them separately
    const parameterOptions = this.optionsList.filter(
      (opt) =>
        opt.type !== ApplicationCommandOptionType.Subcommand &&
        opt.type !== ApplicationCommandOptionType.SubcommandGroup
    );

    for (let i = 0; i < parameterOptions.length; i++) {
      const opt = parameterOptions[i];
      const argPosition = paramIndex + i;
      const val = this.args[argPosition];

      if (val === undefined) continue;

      if (opt.type === ApplicationCommandOptionType.String) {
        // If it's the last option in the list, automatically grab all remaining arguments
        if (i === parameterOptions.length - 1) {
          this.resolved[opt.name] = this.args.slice(argPosition).join(" ");
        } else {
          this.resolved[opt.name] = val;
        }
      } else {
        this.resolved[opt.name] = val;
      }
    }
  }

  getString(name) {
    return this.resolved[name] || null;
  }

  getInteger(name) {
    const val = this.resolved[name];
    if (!val) return null;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
  }

  getNumber(name) {
    const val = this.resolved[name];
    if (!val) return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  }

  getBoolean(name) {
    const val = this.resolved[name];
    if (!val) return null;
    return /^(true|yes|y|1)$/i.test(val);
  }

  getUser(name) {
    const val = this.resolved[name];
    if (!val) return null;
    const match = val.match(/^<@!?(\d+)>$/) || val.match(/^(\d+)$/);
    if (match) {
      const userId = match[1];
      return this.client.users.cache.get(userId) || null;
    }
    // Search cached users by username
    return this.client.users.cache.find((u) => u.username.toLowerCase() === val.toLowerCase()) || null;
  }

  getMember(name) {
    const val = this.resolved[name];
    if (!val || !this.message.guild) return null;
    const match = val.match(/^<@!?(\d+)>$/) || val.match(/^(\d+)$/);
    if (match) {
      const memberId = match[1];
      return this.message.guild.members.cache.get(memberId) || null;
    }
    // Search cached members by username/display name
    return (
      this.message.guild.members.cache.find(
        (m) =>
          m.user.username.toLowerCase() === val.toLowerCase() ||
          m.displayName.toLowerCase() === val.toLowerCase()
      ) || null
    );
  }

  getRole(name) {
    const val = this.resolved[name];
    if (!val || !this.message.guild) return null;
    const match = val.match(/^<@&(\d+)>$/) || val.match(/^(\d+)$/);
    if (match) {
      const roleId = match[1];
      return this.message.guild.roles.cache.get(roleId) || null;
    }
    return this.message.guild.roles.cache.find((r) => r.name.toLowerCase() === val.toLowerCase()) || null;
  }

  getChannel(name) {
    const val = this.resolved[name];
    if (!val || !this.message.guild) return null;
    const match = val.match(/^<#(\d+)>$/) || val.match(/^(\d+)$/);
    if (match) {
      const channelId = match[1];
      return this.message.guild.channels.cache.get(channelId) || null;
    }
    return this.message.guild.channels.cache.find((c) => c.name.toLowerCase() === val.toLowerCase()) || null;
  }

  getMentionable(name) {
    // Returns User or Role
    return this.getUser(name) || this.getRole(name) || null;
  }

  getAttachment(name) {
    // Find the option's index among parameter options
    const parameterOptions = this.optionsList.filter(
      (opt) =>
        opt.type !== ApplicationCommandOptionType.Subcommand &&
        opt.type !== ApplicationCommandOptionType.SubcommandGroup
    );
    const index = parameterOptions.findIndex((opt) => opt.name === name);
    if (index === -1) return null;

    // Retrieve from message attachments
    return this.message.attachments.at(index) || this.message.attachments.first() || null;
  }

  getSubcommand() {
    return this.subcommand;
  }

  getSubcommandGroup() {
    return this.subcommandGroup;
  }
}
