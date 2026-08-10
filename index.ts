import { env } from "./src/utilities/env.js";
import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import Logger from "./src/helpers/Logger.js";

// Module augmentation to extend Discord.js Client types
declare module "discord.js" {
  export interface Client {
    prefixCommands: Collection<string, any>;
    slashCommands: Collection<string, any>;
    slashCommandsArray: any[];
    userContextMenus: Collection<string, any>;
    messageContextMenus: Collection<string, any>;
    subCommands: Collection<string, any>;
    buttons: Collection<string, any>;
    modals: Collection<string, any>;
    autocompletes: Collection<string, any>;
    stringSelectMenus: Collection<string, any>;
    userSelectMenus: Collection<string, any>;
    roleSelectMenus: Collection<string, any>;
    mentionableSelectMenus: Collection<string, any>;
    channelSelectMenus: Collection<string, any>;
    connect: () => Promise<void>;
  }
}

// Initialize Client with explicit readable intents
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

// Attach Collections to the Client
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.userContextMenus = new Collection();
client.messageContextMenus = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.autocompletes = new Collection();

// Granular Select Menus Collections
client.stringSelectMenus = new Collection();
client.userSelectMenus = new Collection();
client.roleSelectMenus = new Collection();
client.mentionableSelectMenus = new Collection();
client.channelSelectMenus = new Collection();

// Connect to Discord
client.connect = async (): Promise<void> => {
  Logger.info("Attempting to connect to the Discord bot...");
  try {
    // Import and execute handlers sequentially
    await import("./src/utilities/eventHandler.js");
    await import("./src/utilities/prefixCommandHandler.js");
    await import("./src/utilities/slashCommandHandler.js");
    await import("./src/utilities/buttonHandler.js");
    await import("./src/utilities/selectMenuHandler.js");
    await import("./src/utilities/modalHandler.js");
    await import("./src/utilities/autocompleteHandler.js");
    await import("./src/utilities/hybridCommandHandler.js");
    await import("./src/utilities/contextMenuHandler.js");
    
    // Deploy / register application commands
    await import("./src/utilities/registerCommands.js");

    await client.login(env.CLIENT_TOKEN);
  } catch (err) {
    Logger.error("Failed to connect or load handlers:", err);
    process.exit(1);
  }
};

client.connect();

// Global Exception and Promise Rejection handling
process.on("unhandledRejection", (error: any) => {
  Logger.error(`Unhandled Promise Rejection: ${error?.stack || error}`);
});

process.on("uncaughtException", (error: any) => {
  Logger.error(`Uncaught Exception: ${error?.stack || error}`);
});
