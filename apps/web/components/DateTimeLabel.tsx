"use client";

import React from "react";

import { formatDateTime } from "@/utils/formatters";

interface DateTimeLabelProps {
  isoString: string | null | undefined;
}

/**
 * Displays a formatted date and time label from an ISO string.
 *
 * @param isoString - The ISO 8601 date-time string to format and display.
 * @returns A React element containing the formatted date and time.
 */
export const DateTimeLabel = ({ isoString }: DateTimeLabelProps) => {
  const formattedDateTime = formatDateTime(isoString);

  return (
    <span className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
      {formattedDateTime}
    </span>
  );
};
