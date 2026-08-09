/**
 * Metadata Schema for Discord.js Client/Guild events.
 */
export default class Event {
  /**
   * @param {Object} data
   * @param {string} data.event - Event trigger name (e.g. 'ready', 'messageCreate', 'interactionCreate').
   * @param {boolean} [data.once] - If the event should run once (defaults to false).
   * @param {boolean} [data.disabled] - Skip loading this event.
   * @param {Function} data.execute - Execution handler: (...args, client) => void
   */
  constructor(data) {
    if (!data.event || typeof data.event !== "string") {
      throw new Error("Event Schema Validation: 'event' is required and must be a string.");
    }
    if (!data.execute || typeof data.execute !== "function") {
      throw new Error(`Event Schema Validation (${data.event}): 'execute' is required and must be a function.`);
    }

    this.event = data.event;
    this.once = data.once ?? false;
    this.disabled = data.disabled ?? false;
    this.execute = data.execute;
  }
}
