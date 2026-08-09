import Component from "../../structures/Component.js";

export default new Component({
  customId: "dynamic-btn",
  type: "button",
  options: {
    public: true,
  },
  execute: async (interaction, client, arg1, arg2) => {
    // If a button is clicked with customId "dynamic-btn:hello:world",
    // arg1 will be "hello" and arg2 will be "world".
    await interaction.reply({
      content: `🔘 Dynamic Button clicked!\n**Arg 1**: \`${arg1 || "None"}\`\n**Arg 2**: \`${arg2 || "None"}\``,
      ephemeral: true,
    });
  },
});
