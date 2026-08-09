import { 
  Message, 
  Client, 
  Guild, 
  User, 
  GuildMember, 
  TextBasedChannel, 
  CommandInteractionOptionResolver, 
  MessageInteraction
} from "discord.js";
import MessageOptionResolver from "./MessageOptionResolver.js";

/**
 * Normalizes execution contexts between Prefix (Message) and Slash (Interaction) commands.
 */
export default class CommandContext {
  public raw: Message | any;
  public client: Client;
  public isInteraction: boolean;
  public isSlash: boolean;
  public type: "slash" | "component" | "prefix";
  public guild: Guild | null;
  public channel: TextBasedChannel | null;
  public user: User;
  public member: GuildMember | null;
  public options: CommandInteractionOptionResolver | MessageOptionResolver;
  public replyMessage: Message | null = null;
  public messageInteraction: MessageInteraction | null = null;
  public originalAuthor: User;

  /**
   * @param interactionOrMessage - The raw Message or Interaction instance triggering this context.
   * @param args - Positional arguments (for prefix messages only).
   * @param optionsList - Option configuration definitions (for prefix messages only).
   */
  constructor(interactionOrMessage: Message | any, args: string[] = [], optionsList: any[] = []) {
    this.raw = interactionOrMessage;
    this.client = interactionOrMessage.client;
    
    // Check if context is an Interaction
    const isAnyInteraction = "user" in interactionOrMessage;
    this.isInteraction = isAnyInteraction;
    this.isSlash = typeof interactionOrMessage.isCommand === "function" && interactionOrMessage.isCommand();
    this.type = this.isSlash ? "slash" : (isAnyInteraction ? "component" : "prefix");

    this.guild = interactionOrMessage.guild;
    this.channel = interactionOrMessage.channel;
    
    // User who triggered this specific execution context
    this.user = isAnyInteraction ? interactionOrMessage.user : interactionOrMessage.author;
    this.member = isAnyInteraction ? (interactionOrMessage.member as GuildMember) : (interactionOrMessage.member as GuildMember);

    this.options = this.isSlash
      ? (interactionOrMessage.options as CommandInteractionOptionResolver)
      : new MessageOptionResolver(interactionOrMessage, args, optionsList);

    // Expose interaction metadata of the parent message if it exists
    this.messageInteraction = !this.isSlash ? (interactionOrMessage.interaction || null) : null;

    // --- Dynamic Command Author (Session Ownership Tracker) ---
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
   * Handles editing the defer/thinking state automatically if previously deferred.
   * @param options - Text payload or full MessageOptions object.
   */
  async reply(options: string | any): Promise<Message | any> {
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
   * @param ephemeral - Ephemeral flag (slash commands only).
   */
  async defer(ephemeral = false): Promise<any> {
    if (this.isInteraction) {
      if (this.raw.deferred || this.raw.replied) return;
      return await this.raw.deferReply({
        flags: ephemeral ? 64 : undefined // Use flags instead of ephemeral option
      });
    } else {
      if (this.channel && typeof (this.channel as any).sendTyping === "function") {
        try {
          await (this.channel as any).sendTyping();
        } catch (err) {
          // Ignore permission-based typing indicators errors
        }
      }
    }
  }

  /**
   * Normalize editing a reply message.
   * @param options - Text payload or full MessageOptions object.
   */
  async editReply(options: string | any): Promise<Message | any> {
    return await this.reply(options);
  }

  /**
   * Normalize sending follow-up messages.
   * @param options - Text payload or full MessageOptions object.
   */
  async followUp(options: string | any): Promise<Message | any> {
    const payload = typeof options === "string" ? { content: options } : { ...options };

    if (this.isInteraction) {
      if (payload.ephemeral) {
        payload.flags = 64; // MessageFlags.Ephemeral
        delete payload.ephemeral;
      }
      return await this.raw.followUp(payload);
    } else {
      if (!this.channel) {
        throw new Error("Cannot send follow-up message: channel is null.");
      }
      return await (this.channel as any).send(payload);
    }
  }
}
