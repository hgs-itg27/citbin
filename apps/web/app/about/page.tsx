// app/ueber-uns/page.tsx
"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import languageSystem from "@/utils/languageSystem";
import { subtitle } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import AnimatedGradient from "@/components/animatedGradient";

/**
 * Renders the About page of the application, displaying information about the company's
 * origin, mission, and core values. The page includes several sections:
 *
 * - Hero section with animated gradient and introductory text.
 * - Origin story and mission, each presented in a card layout.
 * - Core values, displayed as a responsive grid of cards with icons and descriptions.
 * - Call-to-action section with a link to documentation.
 *
 * Text content is internationalized using the `languageSystem` for dynamic translation.
 * Layout and styling are managed with Tailwind CSS utility classes and custom components.
 *
 * @component
 * @returns {JSX.Element} The rendered About page.
 */
export default function AboutPage() {
  const values = [
    { keyBase: "about.values.innovation", icon: "💡" },
    { keyBase: "about.values.sustainability", icon: "🌍" },
    { keyBase: "about.values.efficiency", icon: "⚙️" },
    { keyBase: "about.values.collaboration", icon: "🤝" },
  ];

  return (
    <div className="container mx-auto px-6 py-16 md:py-20 min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative isolate text-center mb-16 md:mb-20 py-16 md:py-20">
        <AnimatedGradient />

        {/* Wrap content in a div with relative z-index */}
        <div className="relative z-10">
          {languageSystem.span({
            key: "about.title",
            style_type: "title",
            style_options: { size: "lg", as: "h1", class: "mb-6" },
          })}
          {languageSystem.span({
            key: "about.intro.subtitle",
            style_type: "subtitle",
            style_options: { as: "p", class: "mb-8 text-lg md:text-xl" },
          })}
          {languageSystem.span({
            key: "about.intro.description",
            style_type: "subtitle",
            style_options: { as: "p", class: "text-foreground/80 mb-8" },
          })}
        </div>
      </section>

      <Divider className="my-12 md:my-16" />

      {/* ... (Origin Story, Mission, Values, CTA sections) ... */}
      <section className="mb-16 md:mb-20">
        <Card className="overflow-hidden" shadow="md">
          <CardHeader className="pb-4">
            {languageSystem.span({
              key: "about.origin.title",
              style_type: "title",
              style_options: { size: "md", as: "h2" },
            })}
          </CardHeader>
          <CardBody>
            {languageSystem.span({
              key: "about.origin.text",
              style_type: "subtitle",
              style_options: {
                as: "p",
                class: "text-foreground/90 leading-relaxed",
              },
            })}
          </CardBody>
        </Card>
      </section>

      <section className="mb-16 md:mb-20">
        <Card className="overflow-hidden" shadow="md">
          <CardHeader className="pb-4">
            {languageSystem.span({
              key: "about.mission.title",
              style_type: "title",
              style_options: { size: "md", as: "h2" },
            })}
          </CardHeader>
          <CardBody>
            {languageSystem.span({
              key: "about.mission.text",
              style_type: "subtitle",
              style_options: {
                as: "p",
                class: "text-foreground/90 leading-relaxed",
              },
            })}
          </CardBody>
        </Card>
      </section>

      <Divider className="my-16 md:my-20" />

      <section className="mb-16 md:mb-20 text-center">
        {languageSystem.span({
          key: "about.values.title",
          style_type: "title",
          style_options: { size: "md", as: "h2", class: "mb-10 md:mb-12" },
        })}
      </section>

      <section className="mb-16 md:mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {values.map((value) => (
            <div key={value.keyBase}>
              <Card
                className="h-full p-4 text-center transition-shadow"
                shadow="sm"
              >
                <CardHeader className="flex flex-col items-center justify-center gap-2 pb-2">
                  <span className="text-3xl mb-2">{value.icon}</span>
                  {languageSystem.span({
                    key: `${value.keyBase}.title`,
                    style_type: "title",
                    style_options: {
                      size: "sm",
                      as: "h3",
                      class: "font-semibold",
                    },
                  })}
                </CardHeader>
                <CardBody className="pt-0">
                  {languageSystem.span({
                    key: `${value.keyBase}.text`,
                    style_type: "subtitle",
                    style_options: {
                      as: "p",
                      class: "text-sm text-foreground/80",
                    },
                  })}
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center mt-20 pt-12 border-t border-divider">
        <p className={subtitle({ class: "mb-8" })}>
          {languageSystem.get({ key: "about.cta.text" })}
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.docs}
          >
            {languageSystem.get({ key: "about.cta.button.docs" })}
          </Link>
        </div>
      </section>
    </div>
  );
}
