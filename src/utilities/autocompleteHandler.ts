import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";
import { getLoaderPattern } from "./pathResolver.js";

/**
 * Dynamically registers autocomplete suggestion response handlers.
 */
async function loadAutocompletes(): Promise<void> {
  try {
    const pattern = getLoaderPattern("Interactions/Autocomplete");
    const files = await glob(pattern);

    for (let file of files) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(fileUrl);
      const component = module.default;

      if (component && component.name) {
        (client as any).autocompletes.set(component.name, component);
      }
    }
    Logger.success(`Loaded ${(client as any).autocompletes.size} Autocomplete Components!`);
  } catch (err) {
    Logger.error("Error loading Autocomplete Components:", err);
  }
}

await loadAutocompletes();
