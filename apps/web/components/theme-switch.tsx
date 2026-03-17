/**
 * A theme switch component that toggles between light and dark modes.
 *
 * This component uses the `next-themes` package to manage theme switching,
 * and leverages the `@heroui/switch` for accessible switch behavior.
 * It displays a sun or moon icon depending on the current theme.
 *
 * @component
 * @param {ThemeSwitchProps} props - The props for the ThemeSwitch component.
 * @param {string} [props.className] - Additional class names to apply to the switch container.
 * @param {SwitchProps["classNames"]} [props.classNames] - Custom class names for different parts of the switch.
 *
 * @example
 * ```tsx
 * <ThemeSwitch />
 * ```
 *
 * @remarks
 * - Uses `useTheme` from `next-themes` for theme management.
 * - Uses `useSwitch` from `@heroui/switch` for accessible switch logic.
 * - Uses `useIsSSR` from `@react-aria/ssr` to handle server-side rendering.
 * - Icons are swapped based on the current theme.
 */
"use client";

import { FC } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light" || isSSR,
    "aria-label": `Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`,
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <SunFilledIcon size={22} />
        ) : (
          <MoonFilledIcon size={22} />
        )}
      </div>
    </Component>
  );
};
