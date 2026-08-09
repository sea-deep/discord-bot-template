/**
 * Resolves directory scanning patterns for ESM glob loaders,
 * dynamically adjusting for typescript source (.ts) in dev and compiled JS (.js) in production.
 */
export function getLoaderPattern(folderName: string): string {
  const isProd = process.env.NODE_ENV === "production" || (process.mainModule?.filename || "").includes("dist");
  const baseDir = isProd ? "dist" : "src";
  const extensions = isProd ? "js" : "{ts,js}";
  return `${process.cwd().replace(/\\/g, "/")}/${baseDir}/${folderName}/**/*.${extensions}`;
}
