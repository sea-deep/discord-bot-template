import Autocomplete from "../../structures/Autocomplete.js";

export default new Autocomplete({
  name: "help",
  execute: async (interaction, client) => {
    const focusedValue = interaction.options.getFocused().toLowerCase();

    // 1. Gather all unique command and subcommand names
    const names = new Set();

    // Main commands
    client.prefixCommands.forEach((cmd) => names.add(cmd.name));
    client.slashCommands.forEach((cmd) => names.add(cmd.data.name));

    // Subcommands (format keys from client.subCommands)
    client.subCommands.forEach((_, key) => {
      names.add(key);
    });

    // 2. Filter choices and slice to max 25 entries
    const filtered = [...names]
      .filter((name) => name.toLowerCase().includes(focusedValue))
      .slice(0, 25);

    const choices = filtered.map((name) => ({ name, value: name }));

    await interaction.respond(choices);
  },
});
