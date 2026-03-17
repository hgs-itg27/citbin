"use client";

import type { ThemeProviderProps } from "next-themes";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

/**
 * Provides application-wide context providers for theming and UI navigation.
 *
 * @param {ProvidersProps} props - The props for the Providers component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the providers.
 * @param {object} props.themeProps - The properties to configure the theme provider.
 *
 * Wraps the application with `HeroUIProvider` for navigation and `NextThemesProvider` for theme management.
 */
export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}
