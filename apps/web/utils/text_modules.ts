// @/utils/text_modules.ts
import rawData from "@/locales/languages.json";
import { flatten } from "@/utils/flatten";

/**
 * Flattens the `rawData` array and exports the resulting array as `text_modules`.
 *
 * @remarks
 * This constant is the result of applying the `flatten` function to the `rawData` variable.
 * It is intended to provide a single-level array of text modules for use throughout the application.
 *
 * @see flatten
 * @see rawData
 */
export const text_modules = flatten(rawData);
