"use client";

import React from "react";

// Definition der Status-Typen für bessere Typsicherheit
export type TrashbinStatus =
  | "aktiv"
  | "inaktiv"
  | "defekt"
  | "vorbereitung"
  | "wartung"
  | "planung";

// Mapping von Status zu Text und Farbe
/**
 * Configuration object mapping each `TrashbinStatus` to its display text and color classes.
 *
 * Each status is associated with:
 * - `text`: The human-readable label for the status.
 * - `color`: Tailwind CSS classes for background and text color, used for styling status labels.
 *
 * Example usage:
 * ```tsx
 * const { text, color } = statusConfig[status];
 * ```
 */
export const statusConfig: Record<
  TrashbinStatus,
  { text: string; color: string }
> = {
  aktiv: { text: "Aktiv", color: "bg-green-100 text-green-800" },
  inaktiv: { text: "Inaktiv", color: "bg-gray-100 text-gray-800" },
  defekt: { text: "Defekt", color: "bg-red-100 text-red-800" },
  vorbereitung: {
    text: "In Vorbereitung",
    color: "bg-blue-100 text-blue-800",
  },
  wartung: { text: "Wartung", color: "bg-yellow-100 text-yellow-800" },
  planung: { text: "In Planung", color: "bg-purple-100 text-purple-800" },
};

// StatusLabel Komponente
export const StatusLabel = ({ status }: { status: TrashbinStatus }) => {
  const { text, color } = statusConfig[status] || statusConfig.inaktiv; // Fallback

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}
    >
      {text}
    </span>
  );
};
