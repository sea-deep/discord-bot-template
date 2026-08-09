import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";

try {
  const files = await glob(`${process.cwd().replace(/\\/g, "/")}/src/Interactions/Modals/**/*.js`);

  for (let file of files) {
    const fileUrl = pathToFileURL(file).href;
    const module = await import(fileUrl);
    const component = module.default;

    if (component && component.customId) {
      client.modals.set(component.customId, component);
      Logger.info(`Loaded Modal Component: ${component.customId}`);
    }
  }
  Logger.success("Modal Components loaded successfully!");
} catch (err) {
  Logger.error("Error loading Modal Components:", err);
}
