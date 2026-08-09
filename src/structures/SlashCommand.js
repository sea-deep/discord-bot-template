/**
 * Metadata Schema for Slash / Application Commands.
 */
export default class SlashCommand {
  /**
   * @param {Object} data
   * @param {import("discord.js").RESTPostAPIChatInputApplicationCommandsJSONBody|import("discord.js").SlashCommandBuilder|Object} data.data - Command metadata for registration.
   * @param {Object} [data.options] - Execution checks/options.
   * @param {string} [data.options.category] - Command category name.
   * @param {string[]} [data.options.examples] - Example usage strings (without leading prefixes).
   * @param {number} [data.options.cooldown] - Cooldown in milliseconds.
   * @param {boolean} [data.options.ownerOnly] - If only the bot owner can execute it.
   * @param {boolean} [data.options.developerOnly] - If only bot developers can execute it.
   * @param {boolean} [data.options.guildOnly] - If it's a guild-only command.
   * @param {boolean} [data.options.nsfw] - If it requires an NSFW channel.
   * @param {Function} [data.execute] - Main callback (interaction, client) => void (Omit if subcommands are routed dynamically).
   */
  constructor(data) {
    if (!data.data || (!data.data.name && typeof data.data.setName !== "function")) {
      throw new Error("SlashCommand Schema Validation: 'data' is required and must contain a command name.");
    }

    const commandName = typeof data.data.setName === "function" ? data.data.name : data.data.name;

    this.name = commandName;
    this.data = typeof data.data.toJSON === "function" ? data.data.toJSON() : data.data;
    this.options = data.options || {};
    this.execute = data.execute || null;
    this.category = this.options.category || null;
    this.examples = this.options.examples || [];
    this.commandType = "slash";

    if (!this.execute && (!this.data.options || !this.data.options.some(opt => opt.type === 1))) {
      throw new Error(`SlashCommand Schema Validation (${commandName}): 'execute' function is required if there are no subcommands.`);
    }
  }
}
