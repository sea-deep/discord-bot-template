import Autocomplete from "../../structures/Autocomplete.js";
import config from "../../../Configs/config.js";

export default new Autocomplete({
  name: "help",
  execute: async (interaction, client) => {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const userId = interaction.user.id;
    const isDev = (config.users.developers || []).includes(userId) || config.users.ownerId === userId;

    // 1. Gather all unique command and subcommand names
    const names = new Set();

    // Main commands (hiding dev-only commands from non-developers)
    client.prefixCommands.forEach((cmd) => {
      if ((cmd.developerOnly || cmd.ownerOnly) && !isDev) return;
      names.add(cmd.name);
    });

    client.slashCommands.forEach((cmd) => {
      if ((cmd.options?.developerOnly || cmd.options?.ownerOnly) && !isDev) return;
      names.add(cmd.data.name);
    });

    // Subcommands (format keys from client.subCommands)
    client.subCommands.forEach((subCmd, key) => {
      // Subcommands inherit dev status from their parent if needed, but since parent is hidden, we block matching subcommands too
      const parentName = key.split(" ")[0];
      const parentCmd = client.slashCommands.get(parentName);
      if (parentCmd && (parentCmd.options?.developerOnly || parentCmd.options?.ownerOnly) && !isDev) return;

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
