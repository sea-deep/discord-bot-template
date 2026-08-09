# Hybrid Command Guide & Reference

The `HybridCommand` architecture allows you to write command logic **once** and have it automatically registered and executed as both a **Prefix (Message) command** and a **Slash (Application) command**. 

It eliminates code duplication and ensures absolute parity between slash and text-based command interfaces.

---

## 📂 File Location
All hybrid commands must be placed in:
`src/HybridCommands/` (e.g. `src/HybridCommands/Utility/say.js`).

---

## 🛠️ The `ctx` (CommandContext) Object
Every hybrid command receives a unified `ctx` object in its `run` method:

### Normalised Properties
- `ctx.client`: The Discord Client instance.
- `ctx.type`: Either `"slash"` or `"prefix"`.
- `ctx.isSlash`: A boolean convenience flag (`true` if Slash command).
- `ctx.guild`: The Guild object (if inside a server).
- `ctx.channel`: The text channel object.
- `ctx.user`: The User object (author of the interaction or message).
- `ctx.member`: The GuildMember object (if inside a server).
- `ctx.raw`: The raw `Message` or `ChatInputCommandInteraction` object.
- `ctx.messageInteraction`: The parent interaction details (if the message trigger was spawned by a slash command). Helpful for checking ownership in button/select menu handlers.

### Normalised Methods
All methods return standard Discord.js message objects and handle internal async flows:
- `await ctx.defer(ephemeral)`: Defers the slash response (within 3s window) OR starts the typing indicator (`channel.sendTyping()`) for prefix commands to indicate the bot is processing.
- `await ctx.reply(payload)`: Sends an initial reply. Payload can be a string or a message options object. For prefix commands, this automatically tracks the response so subsequent updates edit the same reply.
- `await ctx.editReply(payload)`: Normalizes editing the reply.
- `await ctx.followUp(payload)`: Normalizes sending a separate secondary message to the channel.

---

## 🏷️ Resolving Options (`ctx.options`)
The options resolver normalizes text arguments (`args`) to match the standard `interaction.options` API:

- `ctx.options.getString(name)`: Resolves a string. If it is the **last** option in the list, it automatically joins all remaining trailing arguments (e.g. `d!say hello world` resolves `query` option to `"hello world"` instead of `"hello"`).
- `ctx.options.getInteger(name)` / `ctx.options.getNumber(name)`: Resolves and parses numbers.
- `ctx.options.getBoolean(name)`: Resolves text inputs like `true`, `yes`, `y`, `1` as `true`.
- `ctx.options.getUser(name)` / `ctx.options.getMember(name)`: Resolves mentioned tags (`<@ID>`), raw IDs, or username match.
- `ctx.options.getRole(name)`: Resolves role mentions (`<@&ID>`), IDs, or role name matches.
- `ctx.options.getChannel(name)`: Resolves channel mentions (`<#ID>`), IDs, or channel name matches.
- `ctx.options.getMentionable(name)`: Resolves either user or role.
- `ctx.options.getAttachment(name)`: Resolves message attachments (prefix) or interaction attachments.
- `ctx.options.getSubcommand()`: Resolves subcommand name.
- `ctx.options.getSubcommandGroup()`: Resolves subcommand group name.

---

## 📝 Example Hybrid Command

```javascript
import { ApplicationCommandOptionType } from "discord.js";
import HybridCommand from "../../structures/HybridCommand.js";

export default new HybridCommand({
  name: "say",
  description: "Make the bot repeat a message.",
  aliases: ["echo", "repeat"],              // Prefix command aliases
  usage: "<channel> <text>",                // Prefix help usage helper
  options: [                                // Shared command options configuration
    {
      name: "channel",
      description: "Channel to send the message in",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "text",
      description: "The text to repeat",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  cooldown: 5000,
  guildOnly: true,
  permissions: {
    bot: ["SendMessages"],
    user: ["ManageMessages"],
  },
  run: async (ctx, client) => {
    const channel = ctx.options.getChannel("channel");
    const text = ctx.options.getString("text");

    // Enforce send permission on target channel
    if (!channel.permissionsFor(ctx.guild.members.me).has("SendMessages")) {
      return await ctx.reply({
        content: `❌ I do not have permission to send messages in ${channel}!`,
        ephemeral: true,
      });
    }

    await ctx.defer(true); // normalizes typing indicator / defer reply

    await channel.send({ content: text });

    await ctx.editReply({
      content: `✅ Successfully sent message to ${channel}!`,
      ephemeral: true,
    });
  },
});
```
