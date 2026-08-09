import { ModalSubmitInteraction, Client } from "discord.js";
import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-modal",
  type: "modal",
  execute: async (interaction: ModalSubmitInteraction, client: Client) => {
    const inputVal = interaction.fields.getTextInputValue("example-input");
    await interaction.reply({
      content: `📝 Modal submitted successfully! Value received: **${inputVal}**`,
      flags: 64, // MessageFlags.Ephemeral
    });
  },
});
