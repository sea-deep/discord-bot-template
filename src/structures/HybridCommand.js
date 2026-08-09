import CommandContext from "../helpers/CommandContext.js";
import MessageOptionResolver from "../helpers/MessageOptionResolver.js";
import config from "../../Configs/config.js";

/**
 * Monolithic metadata schema representing unified Prefix and Slash commands.
 */
export default class HybridCommand {
  /**
   * @param {Object} data
   * @param {string} data.name - Command name (lower case, alphanumeric).
   * @param {string} data.description - Description.
   * @param {string} [data.category] - Command category name.
   * @param {string[]} [data.aliases] - Prefix command aliases.
   * @param {string} [data.usage] - Prefix usage pattern info.
   * @param {Object[]} [data.options] - Slash and prefix positional options.
   * @param {number} [data.cooldown] - Cooldown in milliseconds.
   * @param {boolean} [data.guildOnly] - If command is guild-only.
   * @param {boolean} [data.nsfw] - If nsfw channel is required.
   * @param {boolean} [data.ownerOnly] - If only the owner can run it.
   * @param {boolean} [data.developerOnly] - If only developers can run it.
   * @param {boolean} [data.defer] - Automate deferReply / sendTyping on start (defaults to true).
   * @param {boolean} [data.ephemeral] - If the deferred slash reply should be ephemeral (defaults to false).
   * @param {Object} [data.permissions] - Required permissions.
   * @param {import("discord.js").PermissionResolvable[]} [data.permissions.bot] - Bot permissions.
   * @param {import("discord.js").PermissionResolvable[]} [data.permissions.user] - User permissions.
   * @param {Function} data.execute - Consolidated execution callback: (ctx, client) => void
   */
  constructor(data) {
    if (!data.name || typeof data.name !== "string") {
      throw new Error("HybridCommand Schema Validation: 'name' is required and must be a string.");
    }
    if (!data.description || typeof data.description !== "string") {
      throw new Error(`HybridCommand Schema Validation (${data.name}): 'description' is required and must be a string.`);
    }
    if (!data.execute || typeof data.execute !== "function") {
      throw new Error(`HybridCommand Schema Validation (${data.name}): 'execute' is required and must be a function.`);
    }

    this.name = data.name;
    this.description = data.description;
    this.category = data.category || null;
    this.aliases = data.aliases || [];
    this.usage = data.usage || "";
    this.options = data.options || [];
    this.cooldown = data.cooldown || 0;
    this.guildOnly = data.guildOnly ?? false;
    this.nsfw = data.nsfw ?? false;
    this.ownerOnly = data.ownerOnly ?? false;
    this.developerOnly = data.developerOnly ?? false;
    this.defer = data.defer ?? true; // Defaults to true
    this.ephemeral = data.ephemeral ?? false; // Defaults to false
    this.permissions = data.permissions || { bot: [], user: [] };
    
    // Store the developer's execution block internally
    this.run = data.execute;
    this.commandType = "hybrid";

    // Build standard slash command metadata structure for registerCommands.js
    this.data = {
      name: this.name,
      description: this.description,
      options: this.options,
    };

    // Under-the-hood standard dispatcher matching legacy handlers expectations
    this.execute = async (interactionOrMessage, ...argsOrClient) => {
      const isInteraction = interactionOrMessage.isCommand?.() ?? false;

      if (isInteraction) {
        const client = argsOrClient[0];
        const ctx = new CommandContext(interactionOrMessage, [], this.options);

        // Auto-defer if configured
        if (this.defer) {
          await ctx.defer(this.ephemeral);
        }

        return await this.run(ctx, client);
      } else {
        const args = argsOrClient[0] || [];
        const client = argsOrClient[1];

        // Automatic required argument validation for prefix command flow
        const resolver = new MessageOptionResolver(interactionOrMessage, args, this.options);
        for (const opt of this.options) {
          if (opt.required) {
            const resolvedValue = resolver.resolved[opt.name];
            if (resolvedValue === undefined || resolvedValue === null) {
              const prefix = config.commands.prefix;
              return await interactionOrMessage.reply({
                content: `❌ **Missing required argument:** \`${opt.name}\`\nUsage: \`${prefix}${this.name} ${this.usage || ""}\``,
              });
            }
          }
        }

        const ctx = new CommandContext(interactionOrMessage, args, this.options);

        // Auto-defer if configured
        if (this.defer) {
          await ctx.defer(this.ephemeral);
        }

        return await this.run(ctx, client);
      }
    };
  }
}
