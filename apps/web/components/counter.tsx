"use client";

import {
  animate,
  KeyframeOptions,
  useInView,
  useIsomorphicLayoutEffect,
} from "framer-motion";
import * as React from "react";

type AnimatedCounterProps = {
  from: number;
  to: number;
  animationOptions?: KeyframeOptions & { duration?: number };
  className?: string;
};

/**
 * Animated counter component that smoothly transitions a number from a starting value (`from`) to an ending value (`to`).
 *
 * The animation is triggered when the component enters the viewport, and respects the user's reduced motion preferences.
 * The displayed value is formatted with thousands separators for numbers longer than four digits.
 *
 * @param from - The initial value to start counting from. Defaults to 0.
 * @param to - The target value to count to.
 * @param animationOptions - Optional animation configuration to override default duration and easing.
 * @param className - Optional CSS class name to apply to the counter element.
 *
 * @returns A `<span>` element displaying the animated counter value.
 */
export const Counter = ({
  from = 0,
  to,
  animationOptions,
  className,
}: AnimatedCounterProps) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;
    if (!inView) return;

    // Set initial value
    element.textContent = String(from);

    // If reduced motion is enabled in system's preferences
    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      element.textContent = String(to);

      return;
    }

    const controls = animate(from, to, {
      duration: 10,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        let formattedValue = value.toFixed(0);

        if (formattedValue.length > 4) {
          formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        element.textContent = formattedValue;
      },
    });

    // Cancel on unmount
    return () => {
      controls.stop();
    };
  }, [ref, inView, from, to]);

  return <span ref={ref} className={className} />;
};
