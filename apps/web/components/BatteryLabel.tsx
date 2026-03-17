"use client";

import React from "react";

interface BatteryLabelProps {
  level: number | null | undefined;
}

/**
 * Displays a battery icon with a fill level and color that reflects the given battery percentage.
 *
 * @param {BatteryLabelProps} props - The props for the BatteryLabel component.
 * @param {number | null | undefined} props.level - The battery level as a percentage (0-100).
 *   If `null` or `undefined`, the label displays as "N/A" and the icon is gray.
 *
 * The icon color changes based on the battery level:
 * - > 75%: green
 * - > 50%: lime
 * - > 25%: yellow
 * - > 10%: orange
 * - ≤ 10%: red
 * - null/undefined: gray
 *
 * The component uses Tailwind CSS classes for styling.
 */
export const BatteryLabel = ({ level }: BatteryLabelProps) => {
  const batteryColor = () => {
    if (level === null || level === undefined) return "gray";
    if (level > 75) return "green";
    if (level > 50) return "lime";
    if (level > 25) return "yellow";
    if (level > 10) return "orange";

    return "red";
  };

  const batteryFillWidth =
    level != null ? Math.max(0, Math.min(100, level)) : 0;

  return (
    <span className="flex items-center space-x-1">
      <svg
        className={`text-${batteryColor()}-500`}
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Battery outline */}
        <rect
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          width="18"
          x="2"
          y="6"
        />
        {/* Battery terminal */}
        <rect fill="currentColor" height="6" rx="1" width="2" x="20" y="9" />
        {/* Battery fill */}
        <rect
          fill="currentColor"
          height="10"
          rx="1"
          width={18 * (batteryFillWidth / 100)} // Adjust width based on percentage
          x="3"
          y="7"
        />
      </svg>
      <span className={`text-sm font-semibold text-${batteryColor()}-700`}>
        {level !== null ? `${level}%` : "N/A"}
      </span>
    </span>
  );
};
