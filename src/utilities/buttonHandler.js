import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";

try {
  const files = await glob(`${process.cwd().replace(/\\/g, "/")}/src/Interactions/Buttons/**/*.js`);

  for (let file of files) {
    const fileUrl = pathToFileURL(file).href;
    const module = await import(fileUrl);
    const component = module.default;

    if (component && component.customId) {
      client.buttons.set(component.customId, component);
      Logger.info(`Loaded Button Component: ${component.customId}`);
    }
  }
  Logger.success("Button Components loaded successfully!");
} catch (err) {
  Logger.error("Error loading Button Components:", err);
}
