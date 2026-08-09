import { GuildMember, Client } from "discord.js";
import Event from "../../structures/Event.js";
import Logger from "../../helpers/Logger.js";

export default new Event({
  event: "guildMemberRemove",
  execute: async (member: GuildMember, client: Client) => {
    Logger.info(`Member left: ${member.user.tag} from server: ${member.guild.name}`);

    // Generic goodbye log in server's system channel if exists
    const channel = member.guild.systemChannel;
    if (channel && channel.permissionsFor(member.guild.members.me!).has("SendMessages")) {
      try {
        await channel.send({
          embeds: [
            {
              description: `😢 **${member.user.tag}** has left the server.`,
              color: 0x9f0000,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      } catch (err) {
        Logger.error(`Failed to send leave message in guild ${member.guild.id}:`, err);
      }
    }
  },
});
