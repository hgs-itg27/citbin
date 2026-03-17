import React from "react";

/**
 * AnimatedGradient is a React functional component that renders an animated, blurred, and morphing
 * background gradient. The gradient is visually centered and sized responsively, using Tailwind CSS
 * utility classes for positioning, sizing, styling, and animation.
 *
 * @returns {JSX.Element} A visually decorative div element containing an animated gradient background.
 *
 * @remarks
 * - The component is intended for decorative purposes only and is hidden from assistive technologies via `aria-hidden="true"`.
 * - The animation and styling rely on custom Tailwind CSS classes, including `animate-morph-polygon`.
 * - The gradient transitions from sky blue to fuchsia and is blurred for a soft visual effect.
 */
const AnimatedGradient = () => (
  <div
    aria-hidden="true"
    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
  >
    <div
      className={`
        relative
        /* --- POSITIONING FOR CENTERING --- */
        left-1/2            /* Position left edge at center */
        -translate-x-1/2    /* Move element back left by half its width */
        /* --- SIZING --- */
        aspect-[1155/678] w-[36.125rem] sm:w-[72.1875rem]
        /* --- STYLING --- */
        bg-gradient-to-tr from-sky-400 to-fuchsia-400
        opacity-50
        /* --- ANIMATION --- */
        animate-morph-polygon
      `}
    />
  </div>
);

export default AnimatedGradient;
