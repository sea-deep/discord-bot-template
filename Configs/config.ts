export interface ConfigSchema {
  development: {
    enabled: boolean;
    guildId: string;
  };
  commands: {
    prefix: string;
    message_commands: boolean;
    application_commands: {
      chat_input: boolean;
      user_context: boolean;
      message_context: boolean;
    };
  };
  users: {
    ownerId: string;
    developers: string[];
  };
  restricted: string[];
  messages: {
    HELP_DESCRIPTION: string;
    NOT_BOT_OWNER: string;
    NOT_BOT_DEVELOPER: string;
    NOT_GUILD_OWNER: string;
    CHANNEL_NOT_NSFW: string;
    MISSING_PERMISSIONS: string;
    COMPONENT_NOT_PUBLIC: string;
    GUILD_COOLDOWN: string;
    INTERACTION_ERROR: string;
  };
}

const config: ConfigSchema = {
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
    ownerId: "1354690754165084271",
    developers: [], // Array of developer user IDs 
  },
  restricted: [
    // Blacklisted user IDs who cannot interact with the bot
  ],
  messages: {
    HELP_DESCRIPTION: "Welcome to the help panel! Select a category from the select menu below to explore my commands.",
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

export default config;
