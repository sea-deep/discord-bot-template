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

    if (component && component.name) {
      client.autocompletes.set(component.name, component);
    }
  }
  Logger.success(`Loaded ${client.autocompletes.size} Autocomplete Components!`);
} catch (err) {
  Logger.error("Error loading Autocomplete Components:", err);
}
