import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";

try {
  const files = await glob(`${process.cwd().replace(/\\/g, "/")}/src/Interactions/Autocomplete/**/*.js`);

  for (let file of files) {
    const fileUrl = pathToFileURL(file).href;
    const module = await import(fileUrl);
    const component = module.default;

    if (component && component.commandName) {
      client.autocompletes.set(component.commandName, component);
      Logger.info(`Loaded Autocomplete Component: ${component.commandName}`);
    }
  }
  Logger.success("Autocomplete Components loaded successfully!");
} catch (err) {
  Logger.error("Error loading Autocomplete Components:", err);
}
