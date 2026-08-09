# Hybrid Command Guide & Reference

The `HybridCommand` architecture allows you to write command logic **once** and have it automatically registered and executed as both a **Prefix (Message) command** and a **Slash (Application) command**. 

It eliminates code duplication and ensures absolute parity between slash and text-based command interfaces.

---

## 📂 File Location
All hybrid commands must be placed in:
`src/HybridCommands/` (e.g. `src/HybridCommands/Utility/say.js`).

---

## ⚡ Auto-Deferring (Thinking / Loading)
By default, **every HybridCommand is deferred automatically** before your `run` logic starts:
- **Slash Commands**: Triggers `deferReply` (giving you a safe 15-minute window for executions instead of the 3-second gateway timeout).
- **Prefix Commands**: Automatically triggers `channel.sendTyping()` to show the typing indicator.

You can configure this behavior inside the constructor options:
- `defer`: Set to `false` if you want to respond instantly (no thinking state).
- `ephemeral`: Set to `true` to make the auto-deferred slash command reply visible only to the command sender.

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
- `ctx.messageInteraction`: The parent interaction details (if the message trigger was spawned by a slash command).
- `ctx.author`: **Ownership Helper.** Instantly resolves the User who *originally started* the command instance that produced the message, working across both message replies (prefix) and interactions (slash). Highly useful for button/select menu ownership validation inside component handlers!

### Normalised Methods
All methods return standard Discord.js message objects and handle internal async flows:
- `await ctx.defer(ephemeral)`: Manually triggers deferReply or typing animation (only needed if `defer: false` was set on the command).
- `await ctx.reply(payload)`: Normalizes replies (content string or options object). If the command has been auto-deferred, this automatically edits the "thinking" message.
- `await ctx.editReply(payload)`: Normalizes editing the reply.
- `await ctx.followUp(payload)`: Normalizes sending a separate secondary message to the channel.

---

## 🏷️ Resolving Options (`ctx.options`)
The options resolver normalizes text arguments (`args`) to match the standard `interaction.options` API:

- `ctx.options.getString(name)`: Resolves a string. If it is the **last** option in the list, it automatically joins all remaining trailing arguments (e.g. `d!say hello world` resolves `text` option to `"hello world"` instead of `"hello"`).
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
  aliases: ["echo", "repeat"],
  usage: "<channel> <text>",
  options: [
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
  ephemeral: true, // auto-deferred slash reply will be ephemeral
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

    await channel.send({ content: text });

    // With auto-defer enabled, ctx.reply maps to editReply automatically
    await ctx.reply({
      content: `... Sent!`,
      ephemeral: true,
    });
  },
});
```
