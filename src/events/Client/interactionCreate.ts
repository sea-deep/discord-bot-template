import { Interaction, Client, Collection } from "discord.js";
import config from "../../../Configs/config.js";
import Logger from "../../helpers/Logger.js";
import Event from "../../structures/Event.js";
import { handleApplicationCommandOptions } from "../../utilities/CommandOptions.js";

export default new Event({
  event: "interactionCreate",
  execute: async (interaction: Interaction, client: Client) => {
    // 1. Blacklist check
    if (config.restricted.includes(interaction.user.id)) return;

    // Helper to find component by exact ID or prefix match
    const getComponentHandler = (collection: Collection<string, any>, customId: string) => {
      // 1. Exact match
      if (collection.has(customId)) {
        return { handler: collection.get(customId), params: [] as string[] };
      }
      // 2. Prefix match (e.g. "delete-message:1234" matches "delete-message")
      const matchedKey = [...collection.keys()].find(key => customId.startsWith(key + ":"));
      if (matchedKey) {
        const handler = collection.get(matchedKey);
        const params = customId.slice(matchedKey.length + 1).split(":");
        return { handler, params };
      }
      return { handler: null, params: [] as string[] };
    };

    // 2. Chat Input (Slash) Commands
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      // Check option checks (cooldown, nsfw, owner, etc.)
      const proceed = await handleApplicationCommandOptions(interaction, command);
      if (!proceed) return;

      // Handle Subcommand dynamic routing
      const subCommandGroup = interaction.options.getSubcommandGroup(false);
      const subCommandName = interaction.options.getSubcommand(false);

      if (subCommandName) {
        // Format key: "parent subCommandName" or "parent subCommandGroup subCommandName"
        const key = subCommandGroup 
          ? `${interaction.commandName} ${subCommandGroup} ${subCommandName}` 
          : `${interaction.commandName} ${subCommandName}`;
        
        const subCommandHandler = client.subCommands.get(key);
        if (subCommandHandler) {
          try {
            return await subCommandHandler.execute(interaction, client);
          } catch (err) {
            Logger.error(`Error in Subcommand (${key}):`, err);
            const errMsg = { content: config.messages.INTERACTION_ERROR, flags: 64 };
            return interaction.replied || interaction.deferred
              ? await interaction.followUp(errMsg)
              : await interaction.reply(errMsg);
          }
        }
      }

      // Execute parent command
      if (command.execute) {
        try {
          return await command.execute(interaction, client);
        } catch (err) {
          Logger.error(`Error in Slash Command (${interaction.commandName}):`, err);
          const errMsg = { content: config.messages.INTERACTION_ERROR, flags: 64 };
          return interaction.replied || interaction.deferred
            ? await interaction.followUp(errMsg)
            : await interaction.reply(errMsg);
        }
      }
    }

    // 2.5 User Context Menu Commands
    if (interaction.isUserContextMenuCommand()) {
      const command = client.userContextMenus.get(interaction.commandName);
      if (!command) return;

      const proceed = await handleApplicationCommandOptions(interaction, command);
      if (!proceed) return;

      if (command.execute) {
        try {
          return await command.execute(interaction, client);
        } catch (err) {
          Logger.error(`Error in User Context Menu (${interaction.commandName}):`, err);
          const errMsg = { content: config.messages.INTERACTION_ERROR, flags: 64 };
          return interaction.replied || interaction.deferred
            ? await interaction.followUp(errMsg)
            : await interaction.reply(errMsg);
        }
      }
    }

    // 2.6 Message Context Menu Commands
    if (interaction.isMessageContextMenuCommand()) {
      const command = client.messageContextMenus.get(interaction.commandName);
      if (!command) return;

      const proceed = await handleApplicationCommandOptions(interaction, command);
      if (!proceed) return;

      if (command.execute) {
        try {
          return await command.execute(interaction, client);
        } catch (err) {
          Logger.error(`Error in Message Context Menu (${interaction.commandName}):`, err);
          const errMsg = { content: config.messages.INTERACTION_ERROR, flags: 64 };
          return interaction.replied || interaction.deferred
            ? await interaction.followUp(errMsg)
            : await interaction.reply(errMsg);
        }
      }
    }

    // 3. Autocomplete
    if (interaction.isAutocomplete()) {
      const autocomplete = client.autocompletes.get(interaction.commandName);
      if (autocomplete) {
        try {
          return await autocomplete.execute(interaction, client);
        } catch (err) {
          Logger.error(`Error in Autocomplete (${interaction.commandName}):`, err);
        }
      }
    }

    // 4. Buttons
    if (interaction.isButton()) {
      const { handler, params } = getComponentHandler(client.buttons, interaction.customId);
      if (handler) {
        // Ownership check
        if (handler.options?.public === false && interaction.user.id !== interaction.message.interaction?.user?.id) {
          return await interaction.reply({
            content: config.messages.COMPONENT_NOT_PUBLIC,
            flags: 64,
          });
        }
        if (handler.options?.ownerOnly && interaction.user.id !== config.users.ownerId) {
          return await interaction.reply({
            content: config.messages.NOT_BOT_OWNER,
            flags: 64,
          });
        }
        try {
          return await handler.execute(interaction, client, ...params);
        } catch (err) {
          Logger.error(`Error in Button Component (${interaction.customId}):`, err);
          return await interaction.reply({ content: config.messages.INTERACTION_ERROR, flags: 64 }).catch(() => {});
        }
      }
    }

    // 5. Modals
    if (interaction.isModalSubmit()) {
      const { handler, params } = getComponentHandler(client.modals, interaction.customId);
      if (handler) {
        try {
          return await handler.execute(interaction, client, ...params);
        } catch (err) {
          Logger.error(`Error in Modal Component (${interaction.customId}):`, err);
          return await interaction.reply({ content: config.messages.INTERACTION_ERROR, flags: 64 }).catch(() => {});
        }
      }
    }

    // 6. Select Menus (5 Types)
    if (interaction.isStringSelectMenu()) {
      const { handler, params } = getComponentHandler(client.stringSelectMenus, interaction.customId);
      if (handler) {
        try {
          return await handler.execute(interaction, client, ...params);
        } catch (err) {
          Logger.error(`Error in StringSelect Component (${interaction.customId}):`, err);
        }
      }
    }

    if (interaction.isUserSelectMenu()) {
      const { handler, params } = getComponentHandler(client.userSelectMenus, interaction.customId);
      if (handler) {
        try {
          return await handler.execute(interaction, client, ...params);
        } catch (err) {
          Logger.error(`Error in UserSelect Component (${interaction.customId}):`, err);
        }
      }
    }

    if (interaction.isRoleSelectMenu()) {
      const { handler, params } = getComponentHandler(client.roleSelectMenus, interaction.customId);
      if (handler) {
        try {
          return await handler.execute(interaction, client, ...params);
        } catch (err) {
          Logger.error(`Error in RoleSelect Component (${interaction.customId}):`, err);
        }
      }
    }

    if (interaction.isMentionableSelectMenu()) {
      const { handler, params } = getComponentHandler(client.mentionableSelectMenus, interaction.customId);
      if (handler) {
        try {
          return await handler.execute(interaction, client, ...params);
        } catch (err) {
          Logger.error(`Error in MentionableSelect Component (${interaction.customId}):`, err);
        }
      }
    }

    if (interaction.isChannelSelectMenu()) {
      const { handler, params } = getComponentHandler(client.channelSelectMenus, interaction.customId);
      if (handler) {
        try {
          return await handler.execute(interaction, client, ...params);
        } catch (err) {
          Logger.error(`Error in ChannelSelect Component (${interaction.customId}):`, err);
        }
      }
    }
  },
});
