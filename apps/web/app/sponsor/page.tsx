// app/sponsor/page.tsx
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
 * Renders the Sponsor About page, displaying information about the sponsor's values,
 * origin story, and a call-to-action section. The page is structured into several sections:
 * - Hero section with animated gradient and introductory text.
 * - Values section, displaying a grid of sponsor values using translation keys.
 * - Origin story section, describing the sponsor's background.
 * - Call-to-action section with a link to documentation.
 *
 * Utilizes the `languageSystem` for internationalized content rendering, and custom
 * UI components such as `AnimatedGradient`, `Divider`, `Card`, `CardHeader`, `CardBody`, and `Link`.
 *
 * @returns The Sponsor About page as a React functional component.
 */
export default function AboutPage() {
  const values = [
    { keyBase: "sponsor.values.innovation" },
    { keyBase: "sponsor.values.sustainability" },
    { keyBase: "sponsor.values.efficiency" },
  ];

  // --- REMOVED SVG Filter Definition ---

  return (
    <div className="container mx-auto px-6 py-16 md:py-20 min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative isolate text-center mb-16 md:mb-20 py-16 md:py-20">
        <AnimatedGradient />

        {/* Wrap content in a div with relative z-index */}
        <div className="relative z-10">
          {languageSystem.span({
            key: "sponsor.title",
            style_type: "title",
            style_options: { size: "lg", as: "h1", class: "mb-6" },
          })}
          {languageSystem.span({
            key: "sponsor.intro.subtitle",
            style_type: "subtitle",
            style_options: { as: "p", class: "mb-8 text-lg md:text-xl" },
          })}
          {languageSystem.span({
            key: "sponsor.intro.description",
            style_type: "subtitle",
            style_options: { as: "p", class: "text-foreground/80 mb-8" },
          })}
        </div>
      </section>

      <Divider className="my-12 md:my-16" />

      <section className="mb-16 md:mb-20 text-center">
        {languageSystem.span({
          key: "sponsor.values.title",
          style_type: "title",
          style_options: { size: "md", as: "h2", class: "mb-10 md:mb-12" },
        })}
      </section>

      <section className="mb-16 md:mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
          {values.map((value) => (
            <div key={value.keyBase}>
              <Card
                className="h-full p-4 text-center transition-shadow"
                shadow="sm"
              >
                <CardHeader className="flex flex-col items-center justify-center gap-2 pb-2">
                  {languageSystem.span({
                    key: `${value.keyBase}.title`,
                    style_type: "title",
                    style_options: {
                      size: "md",
                      as: "h2",
                      class: "font-semibold",
                    },
                  })}
                </CardHeader>
                <CardBody className="text-center pt-0">
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

      <Divider className="my-16 md:my-20" />

      {/* --- Rest of the component remains the same --- */}
      {/* ... (Origin Story, Mission, Values, CTA sections) ... */}
      <section className="mb-16 md:mb-20">
        <Card className="overflow-hidden" shadow="sm">
          <CardHeader className="flex flex-col items-center justify-center gap-2 pb-2">
            {languageSystem.span({
              key: "sponsor.origin.title",
              style_type: "title",
              style_options: { size: "sm", as: "h3" },
            })}
          </CardHeader>
          <CardBody className="text-center">
            {languageSystem.span({
              key: "sponsor.origin.text",
              style_type: "subtitle",
              style_options: {
                as: "p",
                class: "text-foreground/90 leading-relaxed",
              },
            })}
          </CardBody>
        </Card>
      </section>

      <section className="text-center mt-20 pt-12 border-t border-divider">
        <p className={subtitle({ class: "mb-8" })}>
          {languageSystem.get({ key: "sponsor.cta.text" })}
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.docs}
          >
            {languageSystem.get({ key: "sponsor.cta.button.docs" })}
          </Link>
        </div>
      </section>
    </div>
  );
}
