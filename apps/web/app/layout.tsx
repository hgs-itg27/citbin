// @/app/layout.tsx
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { CookiesProvider } from "next-client-cookies/server";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site"; // Importiert siteConfig
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name, // Nutzt geänderten Namen
    template: `%s - ${siteConfig.name}`, // Nutzt geänderten Namen
  },
  description: siteConfig.description, // Nutzt geänderte Beschreibung
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

/**
 * RootLayout is the main layout component for the application.
 * It wraps the entire app with essential providers such as `CookiesProvider` and custom `Providers` for theme management.
 *
 * @param children - The React node(s) to be rendered within the layout.
 *
 * @remarks
 * - Sets up the HTML structure with language and hydration warnings.
 * - Applies global styles and fonts.
 * - Includes a navigation bar (`Navbar`), a main content area, and a footer.
 * - The footer displays project information and links to Impressum and Datenschutz pages.
 * - Uses `siteConfig.name` for dynamic project naming in the footer.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookiesProvider>
      <html suppressHydrationWarning lang="de">
        <head>
          <meta
            content="width=device-width, initial-scale=1.0"
            name="viewport"
          />
        </head>
        <body
          suppressHydrationWarning
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {/* Stellt sicher, dass themeProps korrekt an Providers übergeben wird */}
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto w-screen px-6 flex-grow py-6">
                {children}
              </main>
              {/* Footer */}
              <footer className="flex items-center justify-center w-full py-4">
                <div className="text-center text-sm text-default-600">
                  <span>
                    © 2025 {siteConfig.name} - Ein Projekt der TG12/3 der
                    Hohentwiel-Gewerbeschule
                  </span>
                  {/* Optional: Weitere Links wie Impressum/Datenschutz */}
                  <div className="mt-1">
                    <Link href="/impressum" size="sm">
                      Impressum
                    </Link>
                    <Link href="/datenschutz" size="sm">
                      Datenschutz
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </Providers>
        </body>
      </html>
    </CookiesProvider>
  );
}
