// utils/formatters.ts
// This file should only contain code safe for both Server and Client environments

/**
 * Formats an ISO date-time string into a human-readable string using the German locale.
 *
 * @param isoString - The ISO date-time string to format. If `null` or `undefined`, returns "Unbekannt".
 * @returns The formatted date-time string in "de-DE" locale, or "Unbekannt" if input is falsy,
 *          or "Invalid Date" if the input cannot be parsed as a date.
 *
 * @example
 * ```typescript
 * formatDateTime("2024-06-01T12:34:56Z"); // "1.6.2024, 14:34"
 * formatDateTime(null); // "Unbekannt"
 * formatDateTime("invalid-date"); // "Invalid Date"
 * ```
 */
export const formatDateTime = (
  isoString: string | null | undefined,
): string => {
  if (!isoString) return "Unbekannt";
  try {
    // Backend liefert UTC-Zeit oft ohne Zeitzonen-Indikator (z.B. "2026-07-10T06:25:18").
    // Ohne Z/Offset interpretiert JavaScript den String als lokale Zeit statt UTC.
    // Daher hängen wir ein "Z" an, wenn keine Zeitzone angegeben ist.
    const normalized = /Z$|[+-]\d{2}:\d{2}$/.test(isoString)
      ? isoString
      : `${isoString}Z`;

    return new Date(normalized).toLocaleString("de-DE", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Invalid date string:", isoString, e); // Log error for debugging

    return "Invalid Date";
  }
};
