/**
 * Metadata Schema for Autocomplete interactions.
 */
export default class Autocomplete {
  /**
   * @param {Object} data
   * @param {string} data.commandName - Name of the application command associated with the autocomplete.
   * @param {Function} data.execute - Callback: (interaction, client) => void
   */
  constructor(data) {
    if (!data.commandName || typeof data.commandName !== "string") {
      throw new Error("Autocomplete Schema Validation: 'commandName' is required and must be a string.");
    }
    if (!data.execute || typeof data.execute !== "function") {
      throw new Error(`Autocomplete Schema Validation (${data.commandName}): 'execute' is required and must be a function.`);
    }

    this.commandName = data.commandName;
    this.execute = data.execute;
  }
}
