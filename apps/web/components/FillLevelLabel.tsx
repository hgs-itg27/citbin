"use client";

import React from "react";

interface FillLevelLabelProps {
  level: number | null;
}

/**
 * Displays a trash bin icon with a dynamic fill level indicator and a percentage label.
 *
 * The fill level is visually represented by a colored rectangle inside the trash bin SVG,
 * where the color and height correspond to the `level` prop. The color changes based on
 * the fill percentage to indicate status:
 * - Gray: Empty or very low (≤ 10%)
 * - Green: Low fill (< 25%)
 * - Lime: Moderate fill (< 50%)
 * - Orange: High fill (< 80%)
 * - Red: Very high fill (≥ 80%)
 *
 * @param {FillLevelLabelProps} props - The props for the component.
 * @param {number | null} props.level - The fill level percentage (0–100). If `null`, displays "N/A".
 *
 * @returns {JSX.Element} A span containing the trash bin SVG with dynamic fill and a percentage label.
 */
export const FillLevelLabel = ({ level }: FillLevelLabelProps) => {
  const fillColor = () => {
    if (level === null || level <= 10) return "gray";
    if (level < 25) return "green"; // Low fill, good
    if (level < 50) return "lime";
    if (level < 80) return "orange";

    return "red"; // High fill, needs emptying
  };

  const fillHeight = level !== null ? Math.max(0, Math.min(100, level)) : 0;

  // SVG for a trash bin icon
  // The fill level will be represented by a rectangle that changes height
  return (
    <span className="flex items-center space-x-1">
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fill level rectangle - dynamically sized and colored */}
        {level !== null && (
          <rect
            fill={fillColor()}
            height={(fillHeight / 100) * 14} // Max height for fill
            width="12"
            x="6"
            y={22 - (fillHeight / 100) * 14} // Adjust y to make it fill from bottom
          />
        )}
        {/* Trash bin outline */}
        <path
          d="M4 6h16M10 6V4a2 2 0 012-2h4a2 2 0 012 2v2M5 6h14l-1 16H6L5 6z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span className={`text-sm font-semibold`}>
        {level !== null ? `${level}%` : "N/A"}
      </span>
    </span>
  );
};
