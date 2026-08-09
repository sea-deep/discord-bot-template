import { PermissionsBitField } from "discord.js";
import config from "../../Configs/config.js";

const slashCooldowns = new Map();
const messageCooldowns = new Map();

/**
 * Handles options check for Slash / Application Commands.
 * @param {import("discord.js").ChatInputCommandInteraction} interaction 
 * @param {Object} command 
 * @returns {Promise<boolean>} - True if checks passed, false if failed.
 */
export async function handleApplicationCommandOptions(interaction, command) {
  const options = command.options || {};

  // 1. Owner Check
  if (options.ownerOnly) {
    if (interaction.user.id !== config.users.ownerId) {
      await interaction.reply({
        content: config.messages.NOT_BOT_OWNER,
        ephemeral: true,
      });
      return false;
    }
  }

  // 2. Developer Check
  if (options.developerOnly) {
    const devs = config.users.developers || [];
    if (!devs.includes(interaction.user.id)) {
      await interaction.reply({
        content: config.messages.NOT_BOT_DEVELOPER,
        ephemeral: true,
      });
      return false;
    }
  }

  // 3. Guild Only Check
  if (options.guildOnly) {
    if (!interaction.guild) {
      await interaction.reply({
        content: "❌ This command can only be executed within a server.",
        ephemeral: true,
      });
      return false;
    }
  }

  // 4. NSFW Check
  if (options.nsfw) {
    if (interaction.guild && !interaction.channel.nsfw) {
      await interaction.reply({
        content: config.messages.CHANNEL_NOT_NSFW,
        ephemeral: true,
      });
      return false;
    }
  }

  // 5. Cooldown Check
  if (options.cooldown) {
    const now = Date.now();
    const commandName = command.data.name;
    const cooldownAmount = options.cooldown;

    if (!slashCooldowns.has(interaction.user.id)) {
      slashCooldowns.set(interaction.user.id, new Map());
    }

    const userCooldowns = slashCooldowns.get(interaction.user.id);
    if (userCooldowns.has(commandName)) {
      const expirationTime = userCooldowns.get(commandName) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        await interaction.reply({
          content: config.messages.GUILD_COOLDOWN.replace(/%cooldown%/g, timeLeft.toFixed(1)),
          ephemeral: true,
        });
        return false;
      }
    }

    userCooldowns.set(commandName, now);
    setTimeout(() => userCooldowns.delete(commandName), cooldownAmount);
  }

  return true;
}

/**
 * Handles options check for Prefix Message Commands.
 * @param {import("discord.js").Message} message 
 * @param {Object} command 
 * @returns {Promise<boolean>} - True if checks passed, false if failed.
 */
export async function handleMessageCommandOptions(message, command) {
  // 1. Owner Check
  if (command.ownerOnly) {
    if (message.author.id !== config.users.ownerId) {
      await message.reply(config.messages.NOT_BOT_OWNER);
      return false;
    }
  }

  // 2. Developer Check
  if (command.developerOnly) {
    const devs = config.users.developers || [];
    if (!devs.includes(message.author.id)) {
      await message.reply(config.messages.NOT_BOT_DEVELOPER);
      return false;
    }
  }

  // 3. Guild Only Check
  if (command.guildOnly) {
    if (!message.guild) {
      await message.reply("❌ This command can only be executed within a server.");
      return false;
    }
  }

  // 4. NSFW Check
  if (command.nsfw) {
    if (message.guild && !message.channel.nsfw) {
      await message.reply(config.messages.CHANNEL_NOT_NSFW);
      return false;
    }
  }

  // 5. User Permissions Check
  if (message.guild && command.permissions?.user?.length > 0) {
    const needed = PermissionsBitField.resolve(command.permissions.user);
    if (!message.member.permissions.has(needed)) {
      await message.reply(config.messages.MISSING_PERMISSIONS);
      return false;
    }
  }

  // 6. Bot Permissions Check
  if (message.guild && command.permissions?.bot?.length > 0) {
    const needed = PermissionsBitField.resolve(command.permissions.bot);
    if (!message.guild.members.me.permissions.has(needed)) {
      await message.reply("❌ The bot lacks required permissions to run this command.");
      return false;
    }
  }

  // 7. Cooldown Check
  if (command.cooldown) {
    const now = Date.now();
    const commandName = command.name;
    const cooldownAmount = command.cooldown;

    if (!messageCooldowns.has(message.author.id)) {
      messageCooldowns.set(message.author.id, new Map());
    }

    const userCooldowns = messageCooldowns.get(message.author.id);
    if (userCooldowns.has(commandName)) {
      const expirationTime = userCooldowns.get(commandName) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        await message.reply(config.messages.GUILD_COOLDOWN.replace(/%cooldown%/g, timeLeft.toFixed(1)));
        return false;
      }
    }

    userCooldowns.set(commandName, now);
    setTimeout(() => userCooldowns.delete(commandName), cooldownAmount);
  }

  return true;
}
