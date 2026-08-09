import MessageOptionResolver from "./MessageOptionResolver.js";

/**
 * Normalizes execution contexts between Prefix (Message) and Slash (Interaction) commands.
 */
export default class CommandContext {
  /**
   * @param {import("discord.js").Message|import("discord.js").ChatInputCommandInteraction|import("discord.js").ButtonInteraction|import("discord.js").AnySelectMenuInteraction|import("discord.js").ModalSubmitInteraction} interactionOrMessage 
   * @param {string[]} [args] - Position arguments for message commands.
   * @param {Object[]} [optionsList] - Declared command options list.
   */
  constructor(interactionOrMessage, args = [], optionsList = []) {
    this.raw = interactionOrMessage;
    this.client = interactionOrMessage.client;
    
    // Check if context is an Interaction (Interactions contain a 'user' property, Messages do not)
    const isAnyInteraction = "user" in interactionOrMessage;
    this.isInteraction = isAnyInteraction;
    this.isSlash = typeof interactionOrMessage.isCommand === "function" && interactionOrMessage.isCommand();
    this.type = this.isSlash ? "slash" : (isAnyInteraction ? "component" : "prefix");

    this.guild = interactionOrMessage.guild;
    this.channel = interactionOrMessage.channel;
    
    // User who triggered this specific execution context (clicked the button or ran the command)
    this.user = isAnyInteraction ? interactionOrMessage.user : interactionOrMessage.author;
    this.member = isAnyInteraction ? interactionOrMessage.member : interactionOrMessage.member;

    this.options = this.isSlash
      ? interactionOrMessage.options
      : new MessageOptionResolver(interactionOrMessage, args, optionsList);

    // Response message track for prefix command edits
    this.replyMessage = null;

    // Expose interaction metadata of the parent message if it exists
    this.messageInteraction = !this.isSlash ? (interactionOrMessage.interaction || null) : null;

    // --- Dynamic Command Author (Session Ownership Tracker) ---
    // Exposes the original user who created the command instance
    if (interactionOrMessage.message) {
      const msg = interactionOrMessage.message;
      this.originalAuthor = 
        msg.interaction?.user || 
        msg.referencedMessage?.author || 
        msg.mentions?.users?.first() || 
        this.user;
    } else {
      this.originalAuthor = this.user;
    }
  }

  /**
   * Normalize sending a reply message.
   * @param {string|Object} options - Reply payload string or payload options object.
   */
  async reply(options) {
    const payload = typeof options === "string" ? { content: options } : { ...options };

    if (this.isInteraction) {
      if (this.raw.replied || this.raw.deferred) {
        return await this.raw.editReply(payload);
      }

      // Supplying "ephemeral" is deprecated in v14.16+, map to flags instead
      if (payload.ephemeral) {
        payload.flags = 64; // MessageFlags.Ephemeral
        delete payload.ephemeral;
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
      // Check if already deferred or replied
      if (this.raw.deferred || this.raw.replied) return;
      return await this.raw.deferReply({
        flags: ephemeral ? 64 : undefined // Use flags instead of ephemeral option
      });
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
    const payload = typeof options === "string" ? { content: options } : { ...options };

    if (this.isInteraction) {
      if (payload.ephemeral) {
        payload.flags = 64; // MessageFlags.Ephemeral
        delete payload.ephemeral;
      }
      return await this.raw.followUp(payload);
    } else {
      return await this.channel.send(payload);
    }
  }
}
