import Event from "../../structures/Event.js";
import Logger from "../../helpers/Logger.js";

export default new Event({
  event: "guildMemberAdd",
  execute: async (member, client) => {
    Logger.info(`New member joined: ${member.user.tag} in server: ${member.guild.name}`);

    // Generic welcome log in server's system channel if exists
    const channel = member.guild.systemChannel;
    if (channel && channel.permissionsFor(member.guild.members.me).has("SendMessages")) {
      try {
        await channel.send({
          embeds: [
            {
              title: "Welcome! 👋",
              description: `Welcome to the server, ${member}! We are glad to have you here.`,
              thumbnail: { url: member.user.displayAvatarURL() },
              color: 0x5865f2,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      } catch (err) {
        Logger.error(`Failed to send welcome message in guild ${member.guild.id}:`, err);
      }
    }
  },
});
