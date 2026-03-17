export type SiteConfig = typeof siteConfig;

/**
 * Configuration object for the CiTBIN frontend site.
 *
 * @property name - The name of the application.
 * @property description - A brief description of the application.
 * @property links - An object containing internal link paths for documentation and sponsorship.
 * @property navItems - An array of navigation items for the main navigation bar, each with a label and href.
 * @property navMenuItems - An array of navigation items for the navigation menu, each with a label and href.
 */
export const siteConfig = {
  name: "CiTBIN",
  description:
    "CiTBIN - Das intelligente Müllentsorgungssystem für optimierte Routenplanung",
  links: {
    docs: "/docs",
    sponsor: "/sponsor",
  },
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dokumentation",
      href: "/docs",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Verwaltung",
      href: "/admin/overview",
    },
    {
      label: "Über Uns",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dokumentation",
      href: "/docs",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Verwaltung",
      href: "/admin/overview",
    },
    {
      label: "Über Uns",
      href: "/about",
    },
    // { label: "Einstellungen", href: "/settings" },
  ],
};
