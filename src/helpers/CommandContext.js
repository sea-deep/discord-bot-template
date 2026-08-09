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
    
    // Check if context is a Command (Prefix message or Slash ChatInput/ContextMenu)
    this.isInteraction = interactionOrMessage.isCommand?.() ?? false;
    this.isSlash = this.isInteraction; // Command trigger helper
    this.type = this.isInteraction ? "slash" : "prefix";

    this.guild = interactionOrMessage.guild;
    this.channel = interactionOrMessage.channel;
    
    // User who triggered this specific execution context (clicked the button or ran the command)
    this.user = this.isInteraction ? interactionOrMessage.user : interactionOrMessage.author;
    this.member = this.isInteraction ? interactionOrMessage.member : interactionOrMessage.member;

    this.options = this.isInteraction
      ? interactionOrMessage.options
      : new MessageOptionResolver(interactionOrMessage, args, optionsList);

    // Response message track for prefix command edits
    this.replyMessage = null;

    // Expose interaction metadata of the parent message if it exists
    this.messageInteraction = !this.isInteraction ? (interactionOrMessage.interaction || null) : null;

    // --- Dynamic Command Author (Session Ownership Tracker) ---
    // Exposes the original user who created the command instance
    if (interactionOrMessage.message) {
      const msg = interactionOrMessage.message;
      if (msg.interaction) {
        // Created by a Slash Command interaction
        this.originalAuthor = msg.interaction.user;
      } else if (msg.referencedMessage) {
        // Created by a Prefix Command message reply
        this.originalAuthor = msg.referencedMessage.author;
      } else {
        // Fallback: search for first user mention in the message, otherwise fall back to trigger user
        this.originalAuthor = msg.mentions.users.first() || this.user;
      }
    } else {
      // If it is the command itself, the original author is the one executing it
      this.originalAuthor = this.user;
    }
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
      // Check if already deferred or replied
      if (this.raw.deferred || this.raw.replied) return;
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
