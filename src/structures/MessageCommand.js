/**
 * Metadata Schema for legacy/prefix message commands.
 */
export default class MessageCommand {
  /**
   * @param {Object} data
   * @param {string} data.name - The command name.
   * @param {string} [data.description] - Command description.
   * @param {string} [data.category] - Command category name.
   * @param {string[]} [data.aliases] - Command aliases.
   * @param {string} [data.usage] - Usage pattern instructions.
   * @param {boolean} [data.guildOnly] - If the command is guild-only.
   * @param {boolean} [data.args] - If the command requires arguments.
   * @param {Object} [data.permissions] - Permissions needed.
   * @param {import("discord.js").PermissionResolvable[]} [data.permissions.bot] - Bot permissions.
   * @param {import("discord.js").PermissionResolvable[]} [data.permissions.user] - User permissions.
   * @param {number} [data.cooldown] - Cooldown in milliseconds.
   * @param {boolean} [data.nsfw] - If nsfw channel is required.
   * @param {boolean} [data.ownerOnly] - If only the bot owner can use it.
   * @param {boolean} [data.developerOnly] - If only bot developers can use it.
   * @param {Function} data.execute - Execution callback: (message, args, client) => void
   */
  constructor(data) {
    if (!data.name || typeof data.name !== "string") {
      throw new Error("MessageCommand Schema Validation: 'name' is required and must be a string.");
    }
    if (!data.execute || typeof data.execute !== "function") {
      throw new Error(`MessageCommand Schema Validation (${data.name}): 'execute' is required and must be a function.`);
    }

    this.name = data.name;
    this.description = data.description || "";
    this.category = data.category || null;
    this.aliases = data.aliases || [];
    this.usage = data.usage || "";
    this.guildOnly = data.guildOnly ?? false;
    this.args = data.args ?? false;
    this.permissions = data.permissions || { bot: [], user: [] };
    this.cooldown = data.cooldown || 0;
    this.nsfw = data.nsfw ?? false;
    this.ownerOnly = data.ownerOnly ?? false;
    this.developerOnly = data.developerOnly ?? false;
    this.execute = data.execute;
    this.commandType = "prefix";
  }
}
