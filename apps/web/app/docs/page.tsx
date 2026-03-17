import { Divider } from "@heroui/divider";

import languageSystem from "@/utils/languageSystem";
import AnimatedGradient from "@/components/animatedGradient";

/**
 * Renders the documentation page for the CiTBIN application.
 *
 * This page displays the main documentation sections, including the title, subtitle,
 * description, and specific sections for device management and trashbin management.
 * All text content is internationalized using the `languageSystem.span` method.
 *
 * Layout:
 * - Animated gradient background in the header section.
 * - Main title, subtitle, and description centered at the top.
 * - Divider separating the header from the content.
 * - Two main documentation sections: Devices and Trashbin Management, each with a title and description.
 *
 * @returns {JSX.Element} The rendered documentation page component.
 */
export default function DocsPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="relative isolate flex flex-col items-center justify-center gap-4 py-16 md:py-24 text-center w-full">
        <AnimatedGradient />
        <div>
          {languageSystem.span({
            key: "docs.title",
            params: {
              app_name: "CiTBIN",
            },
            style_type: "title",
            style_options: {
              class: "",
            },
          })}
          {languageSystem.span({
            key: "docs.subtitle",
            params: {
              app_name: "CiTBIN",
            },
            style_type: "subtitle",
            style_options: {
              class: "text-center",
            },
          })}
          <br />
          {languageSystem.span({
            key: "docs.description",
            params: {
              app_name: "CiTBIN",
            },
            style_type: "subtitle",
            style_options: {
              class: "text-center",
              as: "p",
            },
          })}
        </div>
      </section>
      <Divider />
      <div>
        <section className="my-8">
          <div>
            {languageSystem.span({
              key: "docs.devices.title",
              style_type: "title",
              style_options: {
                class: "text-justify",
                as: "p",
              },
            })}
            <br />
            {languageSystem.span({
              key: "docs.devices.description",
              style_type: "subtitle",
              style_options: {
                class: "text-justify",
                as: "p",
              },
            })}
          </div>
        </section>

        <section className="my-8">
          <div>
            {languageSystem.span({
              key: "docs.trashbin-management.title",
              style_type: "title",
              style_options: {
                class: "text-justify",
                as: "p",
              },
            })}
            <br />
            {languageSystem.span({
              key: "docs.trashbin-management.description",
              style_type: "subtitle",
              style_options: {
                class: "text-justify",
                as: "p",
              },
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
