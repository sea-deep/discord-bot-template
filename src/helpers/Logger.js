import "colors";

/**
 * Custom Logger utility formatting console logs using colors.
 */
export default class Logger {
  static info(...args) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}]`.gray, `[Info]`.blue, ...args);
  }

  static success(...args) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}]`.gray, `[OK]`.green, ...args);
  }

  static warn(...args) {
    const timestamp = new Date().toLocaleTimeString();
    console.warn(`[${timestamp}]`.gray, `[Warning]`.yellow, ...args);
  }

  static error(...args) {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[${timestamp}]`.gray, `[Error]`.red, ...args);
  }
}
