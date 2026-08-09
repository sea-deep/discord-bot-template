import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-modal",
  type: "modal",
  execute: async (interaction, client) => {
    const inputVal = interaction.fields.getTextInputValue("example-input");
    await interaction.reply({
      content: `📝 Modal submitted successfully! Value received: **${inputVal}**`,
      ephemeral: true,
    });
  },
});
