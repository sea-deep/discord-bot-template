/**
 * Metadata Schema for Autocomplete interactions.
 */
export default class Autocomplete {
  /**
   * @param {Object} data
   * @param {string} data.name - Name of the application command associated with the autocomplete.
   * @param {Function} data.execute - Callback: (interaction, client) => void
   */
  constructor(data) {
    if (!data.name || typeof data.name !== "string") {
      throw new Error("Autocomplete Schema Validation: 'name' is required and must be a string.");
    }
    if (!data.execute || typeof data.execute !== "function") {
      throw new Error(`Autocomplete Schema Validation (${data.name}): 'execute' is required and must be a function.`);
    }

    this.name = data.name;
    this.execute = data.execute;
  }
}
