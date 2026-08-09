/**
 * Metadata Schema for Buttons, Modals, and 5 distinct Select Menus.
 */
export default class Component {
  /**
   * @param {Object} data
   * @param {string} data.customId - Component custom identifier (supports prefix matching).
   * @param {'button' | 'modal' | 'stringSelect' | 'userSelect' | 'roleSelect' | 'mentionableSelect' | 'channelSelect'} data.type - Component type.
   * @param {Object} [data.options] - Interaction check options.
   * @param {boolean} [data.options.public] - If anyone can interact with the component (defaults to true).
   * @param {boolean} [data.options.ownerOnly] - If only the bot owner can interact.
   * @param {Function} data.execute - Callback: (interaction, client, ...params) => void
   */
  constructor(data) {
    const validTypes = [
      "button",
      "modal",
      "stringSelect",
      "userSelect",
      "roleSelect",
      "mentionableSelect",
      "channelSelect",
    ];

    if (!data.customId || typeof data.customId !== "string") {
      throw new Error("Component Schema Validation: 'customId' is required and must be a string.");
    }
    if (!data.type || !validTypes.includes(data.type)) {
      throw new Error(`Component Schema Validation (${data.customId}): 'type' must be one of: ${validTypes.join(", ")}`);
    }
    if (!data.execute || typeof data.execute !== "function") {
      throw new Error(`Component Schema Validation (${data.customId}): 'execute' is required and must be a function.`);
    }

    this.customId = data.customId;
    this.type = data.type;
    this.options = data.options || { public: true, ownerOnly: false };
    this.execute = data.execute;
  }
}
