// @/app/page.tsx
"use client";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useCookies } from "next-client-cookies";

import { siteConfig } from "@/config/site";
import { subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Counter } from "@/components/counter";
import languageSystem from "@/utils/languageSystem";
import AnimatedGradient from "@/components/animatedGradient";

// Define counter values here for easier management
const BINS_MONITORED_COUNT = 100; // Example value
const TRIPS_OPTIMIZED_PERCENTAGE = 30; // Example value

/**
 * Home page component for the application.
 *
 * This component renders the main landing page, including:
 * - An animated gradient background.
 * - A modal popup for project status information, which can be dismissed and remembered via cookies.
 * - The main title, subtitle, and description, all localized via the `languageSystem`.
 * - Action buttons linking to documentation and GitHub.
 * - Statistics cards displaying monitored bins and optimized trips, with animated counters.
 * - Sections describing the school project and application, with localized content.
 *
 * @returns The rendered home page as a React functional component.
 *
 * @remarks
 * - Uses `useCookies` for managing the modal's dismissed state.
 * - Uses `useDisclosure` for modal open/close logic.
 * - Relies on `languageSystem` for all text content, supporting localization.
 * - Utilizes various UI components such as `Modal`, `Card`, `Counter`, `Divider`, and `Button`.
 */
export default function Home() {
  const cookies = useCookies();
  const { onClose } = useDisclosure();

  const handleClose = () => {
    cookies.set("closedPopupInfo", "true");
    onClose();
  };

  // @ts-ignore
  return (
    <div className="flex flex-col items-center">
      <section className="relative isolate flex flex-col items-center justify-center gap-4 py-16 md:py-24 text-center w-full">
        <AnimatedGradient />
        <Modal
          isOpen={cookies.get("closedPopupInfo") !== "true"}
          onClose={handleClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {languageSystem.get({
                    key: "modal.information.project_status.title",
                  })}
                </ModalHeader>
                <ModalBody>
                  <p>
                    {languageSystem.get({
                      key: "modal.information.project_status.body",
                    })}
                  </p>
                  <p>
                    {languageSystem.get({
                      key: "modal.information.project_status.body2",
                    })}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Verstanden
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <div className="max-w-3xl px-6 relative z-[1]">
          {languageSystem.span({
            key: "startpage.website_title",
            style_type: "title",
            style_options: { size: "lg", as: "h1" },
          })}
          <h2 className={subtitle({ class: "mt-4" })}>
            {languageSystem.get({ key: "startpage.subtitle" })}
          </h2>
          {languageSystem.span({
            key: "startpage.top.description",
            style_type: "subtitle",
            style_options: { class: "mt-4", fullWidth: true, as: "p" },
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-6 justify-center px-6 relative z-[1]">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            href={siteConfig.links.docs}
          >
            {languageSystem.get({ key: "startpage.buttons.documentation" })}
          </Link>
          <Link
            isExternal
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
              size: "lg",
            })}
            href=""
          >
            <GithubIcon size={20} />
            {languageSystem.get({ key: "startpage.buttons.github" })}
          </Link>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-6 relative">
        <Divider className="my-8 md:my-12" />

        {/* --- Stats Section --- */}
        <section className="w-full max-w-5xl py-8 md:py-10 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stat 1: Bins Monitored */}
            <Card className="text-center p-4" shadow="md">
              <CardBody>
                <div className="mb-4">
                  {languageSystem.span({
                    key: "startpage.stats.bins_monitored.title",
                    style_type: "title",
                    style_options: { size: "lg" },
                    params: {
                      // --- Use Counter directly ---
                      count: (
                        <Counter
                          animationOptions={{ duration: 2 }}
                          from={0}
                          to={BINS_MONITORED_COUNT}
                        />
                      ),
                    },
                  })}
                </div>
                {languageSystem.span({
                  key: "startpage.stats.bins_monitored.description",
                  style_type: "subtitle",
                  style_options: { as: "p" },
                  params: { count: BINS_MONITORED_COUNT },
                })}
              </CardBody>
            </Card>

            {/* Stat 2: Trips Optimized */}
            <Card className="text-center p-4" shadow="md">
              <CardBody>
                <div className="mb-4">
                  {languageSystem.span({
                    key: "startpage.stats.trips_optimized.title",
                    style_type: "title",
                    style_options: { size: "lg" },
                    params: {
                      // --- Use Counter directly ---
                      count: (
                        <Counter
                          animationOptions={{ duration: 2 }}
                          from={0}
                          to={TRIPS_OPTIMIZED_PERCENTAGE}
                        />
                      ),
                    },
                  })}
                </div>
                {languageSystem.span({
                  key: "startpage.stats.trips_optimized.description",
                  style_type: "subtitle",
                  style_options: { as: "p" },
                  params: { count: TRIPS_OPTIMIZED_PERCENTAGE },
                })}
              </CardBody>
            </Card>
          </div>
        </section>

        <Divider className="my-8 md:my-12" />

        <section
          aria-labelledby="jugend-forscht-title"
          className="w-full max-w-4xl py-8 md:py-10 mx-auto flex justify-center"
        >
          <Card className="w-full p-4" shadow="md">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              {languageSystem.span({
                key: "startpage.schoolproject.title",
                style_type: "title",
                style_options: { size: "md", as: "h3" },
              })}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              {languageSystem.span({
                key: "startpage.schoolproject.description",
                style_type: "subtitle",
                style_options: { class: "mt-2", as: "p" },
              })}
            </CardBody>
          </Card>
        </section>

        <section
          aria-labelledby="application-title"
          className="w-full max-w-4xl py-8 md:py-10 mx-auto flex justify-center"
        >
          <Card className="w-full p-4" shadow="md">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              {languageSystem.span({
                key: "startpage.application.title",
                style_type: "title",
                style_options: { size: "md", as: "h3" },
              })}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              {languageSystem.span({
                key: "startpage.application.description",
                style_type: "subtitle",
                style_options: { class: "mt-2", as: "p" },
              })}
            </CardBody>
          </Card>
        </section>

        <div className="py-8 md:py-12" />
      </div>
    </div>
  );
}
