import { glob } from "glob";
import { pathToFileURL } from "node:url";
import { client } from "../../index.js";
import Logger from "../helpers/Logger.js";

try {
  const files = await glob(`${process.cwd().replace(/\\/g, "/")}/src/events/**/*.js`);

  for (let file of files) {
    const fileUrl = pathToFileURL(file).href;
    const module = await import(fileUrl);
    const eventObj = module.default;

    if (!eventObj || !eventObj.event || !eventObj.execute) continue;

    if (eventObj.disabled) {
      Logger.warn(`Skipping disabled event: ${eventObj.event}`);
      continue;
    }

    const once = eventObj.once ?? false;
    
    // Bind to the client
    client[once ? "once" : "on"](eventObj.event, (...args) => {
      try {
        eventObj.execute(...args, client);
      } catch (err) {
        Logger.error(`Error in event listener (${eventObj.event}):`, err);
      }
    });

    Logger.info(`Loaded Event: ${eventObj.event}`);
  }
  Logger.success("Events loaded successfully!");
} catch (err) {
  Logger.error("Error loading Events:", err);
}
