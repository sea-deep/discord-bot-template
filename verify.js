import { glob } from "glob";
import { pathToFileURL } from "node:url";
import MessageCommand from "./src/structures/MessageCommand.js";
import SlashCommand from "./src/structures/SlashCommand.js";
import SubCommand from "./src/structures/SubCommand.js";
import Component from "./src/structures/Component.js";
import Autocomplete from "./src/structures/Autocomplete.js";
import Event from "./src/structures/Event.js";
import HybridCommand from "./src/structures/HybridCommand.js";

async function verify() {
  console.log("----------------------------------------");
  console.log("🔍 Running Metadata Schema Validation...");
  console.log("----------------------------------------\n");

  let passed = true;
  const checks = [
    { pattern: "src/PrefixCommands/**/*.js", expected: MessageCommand, label: "Message Command" },
    { pattern: "src/Interactions/SlashCommands/SubCommands/**/*.js", expected: SubCommand, label: "Subcommand" },
    { pattern: "src/Interactions/SlashCommands/*.js", expected: SlashCommand, label: "Slash Command" },
    { pattern: "src/Interactions/Buttons/**/*.js", expected: Component, label: "Button Component" },
    { pattern: "src/Interactions/*Select/**/*.js", expected: Component, label: "Select Menu Component" },
    { pattern: "src/Interactions/Modals/**/*.js", expected: Component, label: "Modal Component" },
    { pattern: "src/Interactions/Autocomplete/**/*.js", expected: Autocomplete, label: "Autocomplete Component" },
    { pattern: "src/events/**/*.js", expected: Event, label: "Event Listener" },
    { pattern: "src/HybridCommands/**/*.js", expected: HybridCommand, label: "Hybrid Command" },
  ];

  for (const check of checks) {
    const files = await glob(check.pattern);
    for (const file of files) {
      try {
        const fileUrl = pathToFileURL(file).href;
        const module = await import(fileUrl);
        const instance = module.default;

        if (!instance) {
          console.error(`❌ [FAILED] ${file}: Default export is missing.`);
          passed = false;
          continue;
        }

        if (!(instance instanceof check.expected)) {
          console.error(`❌ [FAILED] ${file}: Not an instance of expected structure ${check.expected.name}.`);
          passed = false;
          continue;
        }

        console.log(`✅ [OK] ${check.label}: ${file}`);
      } catch (err) {
        console.error(`❌ [ERROR] ${file}: Verification failed with error:\n`, err.stack || err);
        passed = false;
      }
    }
  }

  console.log("\n----------------------------------------");
  if (passed) {
    console.log("🎉 SUCCESS: All files match the metadata schemas perfectly!");
    process.exit(0);
  } else {
    console.error("⛔ FAILURE: One or more files failed schema validation.");
    process.exit(1);
  }
}

verify();
