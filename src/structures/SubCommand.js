/**
 * Metadata Schema for individual Subcommand files.
 */
export default class SubCommand {
  /**
   * @param {Object} data
   * @param {string} data.subCommand - The subcommand signature formatted as "parent subcommand" (e.g. "xuv genesis").
   * @param {Function} data.execute - Callback: (interaction, client) => void
   */
  constructor(data) {
    if (!data.subCommand || typeof data.subCommand !== "string") {
      throw new Error("SubCommand Schema Validation: 'subCommand' is required and must be a string.");
    }
    if (!data.subCommand.includes(" ")) {
      throw new Error(`SubCommand Schema Validation (${data.subCommand}): 'subCommand' signature must include a space space linking to the parent, e.g. "hello world".`);
    }
    if (!data.execute || typeof data.execute !== "function") {
      throw new Error(`SubCommand Schema Validation (${data.subCommand}): 'execute' is required and must be a function.`);
    }

    this.subCommand = data.subCommand;
    this.execute = data.execute;
  }
}
