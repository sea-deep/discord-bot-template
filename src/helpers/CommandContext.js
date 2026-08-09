import MessageOptionResolver from "./MessageOptionResolver.js";

/**
 * Normalizes execution contexts between Prefix (Message) and Slash (Interaction) commands.
 */
export default class CommandContext {
  /**
   * @param {import("discord.js").Message|import("discord.js").ChatInputCommandInteraction} interactionOrMessage 
   * @param {string[]} [args] - Position arguments for message commands.
   * @param {Object[]} [optionsList] - Declared command options list.
   */
  constructor(interactionOrMessage, args = [], optionsList = []) {
    this.raw = interactionOrMessage;
    this.client = interactionOrMessage.client;
    this.isInteraction = interactionOrMessage.isCommand?.() ?? false;
    this.isSlash = this.isInteraction; // Convenience helper
    this.type = this.isInteraction ? "slash" : "prefix";

    this.guild = interactionOrMessage.guild;
    this.channel = interactionOrMessage.channel;
    this.user = this.isInteraction ? interactionOrMessage.user : interactionOrMessage.author;
    this.member = this.isInteraction ? interactionOrMessage.member : interactionOrMessage.member;

    this.options = this.isInteraction
      ? interactionOrMessage.options
      : new MessageOptionResolver(interactionOrMessage, args, optionsList);

    // Keep track of the response message for prefix command edits
    this.replyMessage = null;

    // Expose interaction metadata of the parent message if it exists (helps buttons/select menus check parent commands)
    this.messageInteraction = !this.isInteraction ? (interactionOrMessage.interaction || null) : null;
  }

  /**
   * Normalize sending a reply message.
   * @param {string|Object} options - Reply payload string or payload options object.
   */
  async reply(options) {
    const payload = typeof options === "string" ? { content: options } : options;

    if (this.isInteraction) {
      if (this.raw.replied || this.raw.deferred) {
        return await this.raw.editReply(payload);
      }
      return await this.raw.reply(payload);
    } else {
      if (this.replyMessage) {
        return await this.replyMessage.edit(payload);
      }
      this.replyMessage = await this.raw.reply(payload);
      return this.replyMessage;
    }
  }

  /**
   * Normalize deferring the response.
   * For interactions: defers reply (ack within 3s).
   * For prefix: triggers channel typing animation indicator.
   * @param {boolean} [ephemeral] - Ephemeral flag (slash commands only).
   */
  async defer(ephemeral = false) {
    if (this.isInteraction) {
      return await this.raw.deferReply({ ephemeral });
    } else {
      if (this.channel && typeof this.channel.sendTyping === "function") {
        try {
          await this.channel.sendTyping();
        } catch (err) {
          // Ignore permission-based typing indicators errors
        }
      }
    }
  }

  /**
   * Normalize editing a reply message.
   * @param {string|Object} options 
   */
  async editReply(options) {
    return await this.reply(options);
  }

  /**
   * Normalize sending follow-up messages.
   * @param {string|Object} options 
   */
  async followUp(options) {
    const payload = typeof options === "string" ? { content: options } : options;

    if (this.isInteraction) {
      return await this.raw.followUp(payload);
    } else {
      return await this.channel.send(payload);
    }
  }
}
