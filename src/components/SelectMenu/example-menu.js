const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const { MessageFlags } = require("discord.js");

module.exports = new Component({
    customId: 'example-menu-id',
    type: 'select',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {

        await interaction.reply({
            content: 'Replied from a Select Menu interaction! (You selected **' + interaction.values[0] + '**).',
            flags: MessageFlags.Ephemeral
        });

    }
}).toJSON();