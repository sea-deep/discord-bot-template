export default {
  development: {
    enabled: false, // If true, registers all application commands to a specific guild (fast for testing).
    guildId: "Your bot development guild ID",
  },
  commands: {
    prefix: "d!", // Prefix for message commands.
    message_commands: true,
    application_commands: {
      chat_input: true,
      user_context: true,
      message_context: true,
    },
  },
  users: {
    ownerId: "Your account ID",
    developers: ["Your account ID", "Another developer ID"],
  },
  restricted: [
    // Blacklisted user IDs who cannot interact with the bot
  ],
  messages: {
    NOT_BOT_OWNER: "❌ You do not have permission to run this command because you're not the bot owner!",
    NOT_BOT_DEVELOPER: "❌ You do not have permission to run this command because you're not a developer!",
    NOT_GUILD_OWNER: "❌ You do not have permission to run this command because you're not the server owner!",
    CHANNEL_NOT_NSFW: "❌ You cannot run this command in a non-NSFW channel!",
    MISSING_PERMISSIONS: "❌ You do not have the required permissions to run this command.",
    COMPONENT_NOT_PUBLIC: "❌ You are not allowed to interact with this component!",
    GUILD_COOLDOWN: "⏳ You are on cooldown. Please wait `%cooldown%s` before using this command again.",
    INTERACTION_ERROR: "❌ An error occurred while executing this interaction.",
  },
};
