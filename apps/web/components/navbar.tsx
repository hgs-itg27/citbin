import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { HeartFilledIcon, Logo } from "@/components/icons";

/**
 * Renders the main navigation bar for the application.
 *
 * The `Navbar` component displays the brand logo, navigation links, theme switcher,
 * sponsor button, and a responsive menu for mobile and tablet devices.
 *
 * - On large screens (`lg+`), it shows the brand, main navigation links, theme switch, and sponsor button.
 * - On smaller screens, it displays a theme switch and a menu toggle button, with navigation links accessible via a slide-out menu.
 *
 * The component uses configuration from `siteConfig` for navigation items and external links.
 *
 * @component
 * @returns {JSX.Element} The rendered navigation bar component.
 */
export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Left Section: Brand and Main Nav Links (lg+) */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Right Section (Desktop - lg+): Socials, Theme, Search, Sponsor */}
      {/* Dieser Content Block ist ab sm sichtbar, aber die Items darin werden jetzt erst ab lg gezeigt */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* ThemeSwitch & Social Icons - only visible on lg+ */}
        <NavbarItem className="hidden lg:flex gap-2">
          {" "}
          {/* KORREKTUR: sm:flex -> lg:flex */}
          {/* Social Links (auskommentiert) */}
          {/* <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}><TwitterIcon className="text-default-500"/></Link> */}
          {/* <Link isExternal aria-label="Discord" href={siteConfig.links.discord}><DiscordIcon className="text-default-500"/></Link> */}
          {/* <Link isExternal aria-label="Github" href={siteConfig.links.github}><GithubIcon className="text-default-500"/></Link> */}
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Right Section (Mobile/Tablet - <lg): Theme Switch and Menu Toggle */}
      {/* Dieser Content Block ist nur sichtbar, wenn der Bildschirm kleiner als lg ist */}
      <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
        {/* Optional: Github Icon nur für mobile/tablet? */}
        {/* <Link isExternal aria-label="Github" href={siteConfig.links.github}><GithubIcon className="text-default-500"/></Link> */}
        <ThemeSwitch /> {/* Dieser ThemeSwitch ist für <lg sichtbar */}
        <NavbarMenuToggle /> {/* Der Toggle ist für <lg sichtbar */}
      </NavbarContent>

      {/* Mobile/Tablet Menu Panel */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "secondary"
                      : "foreground"
                }
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
