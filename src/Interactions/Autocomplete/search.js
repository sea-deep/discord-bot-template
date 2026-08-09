import Autocomplete from "../../structures/Autocomplete.js";

export default new Autocomplete({
  name: "search",
  execute: async (interaction, client) => {
    const focusedValue = interaction.options.getFocused();
    const choices = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape"];
    const filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue.toLowerCase()));
    
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
});
