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
  let passed = true;
  let totalVerified = 0;
  
  const checks = [
    { pattern: "src/PrefixCommands/**/*.js", expected: MessageCommand },
    { pattern: "src/Interactions/SlashCommands/SubCommands/**/*.js", expected: SubCommand },
    { pattern: "src/Interactions/SlashCommands/*.js", expected: SlashCommand },
    { pattern: "src/Interactions/Buttons/**/*.js", expected: Component },
    { pattern: "src/Interactions/*Select/**/*.js", expected: Component },
    { pattern: "src/Interactions/Modals/**/*.js", expected: Component },
    { pattern: "src/Interactions/Autocomplete/**/*.js", expected: Autocomplete },
    { pattern: "src/events/**/*.js", expected: Event },
    { pattern: "src/HybridCommands/**/*.js", expected: HybridCommand },
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

        totalVerified++;
      } catch (err) {
        console.error(`❌ [ERROR] ${file}: Verification failed with error:\n`, err.stack || err);
        passed = false;
      }
    }
  }

  if (passed) {
    console.log(`🎉 SUCCESS: All ${totalVerified} files match their metadata schemas perfectly!`);
    process.exit(0);
  } else {
    console.error("\n⛔ FAILURE: One or more files failed schema validation.");
    process.exit(1);
  }
}

verify();
