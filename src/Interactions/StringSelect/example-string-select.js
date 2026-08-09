import Component from "../../structures/Component.js";

export default new Component({
  customId: "example-string-select",
  type: "stringSelect",
  execute: async (interaction, client) => {
    const selected = interaction.values[0];
    await interaction.reply({
      content: `🗂 String Select Menu selected: **${selected}**`,
      ephemeral: true,
    });
  },
});
