import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";
import { getLoaderPattern } from "./pathResolver.js";

/**
 * Dynamically registers button click listener handlers.
 */
async function loadButtons(): Promise<void> {
  try {
    const pattern = getLoaderPattern("Interactions/Buttons");
    const files = await glob(pattern);

    for (let file of files) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(fileUrl);
      const component = module.default;

      if (component && component.customId) {
        (client as any).buttons.set(component.customId, component);
      }
    }
    Logger.success(`Loaded ${(client as any).buttons.size} Button Components!`);
  } catch (err) {
    Logger.error("Error loading Button Components:", err);
  }
}

await loadButtons();
