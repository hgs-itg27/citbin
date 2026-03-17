// utils/flatten.ts
/**
 * Recursively flattens a nested object into a single-level object with dot-separated keys.
 *
 * @param obj - The object to flatten.
 * @param prefix - (Optional) The prefix to prepend to keys, used during recursion.
 * @returns A new object with flattened keys and string values.
 *
 * @example
 * ```typescript
 * const nested = { a: { b: 1, c: 2 }, d: 3 };
 * const flat = flatten(nested);
 * // flat: { 'a.b': 1, 'a.c': 2, d: 3 }
 * ```
 */
export const flatten = (obj: any, prefix = ""): Record<string, string> =>
  Object.keys(obj).reduce(
    (acc, key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object") {
        Object.assign(acc, flatten(obj[key], newKey));
      } else {
        acc[newKey] = obj[key];
      }

      return acc;
    },
    {} as Record<string, string>
  );
