import { Divider } from "@heroui/divider";

import AnimatedGradient from "@/components/animatedGradient";
import languageSystem from "@/utils/languageSystem";

/**
 * Renders the custom 404 Not Found page for the application.
 *
 * This component displays a user-friendly message when a page is not found,
 * including localized titles, descriptions, and suggestions using the `languageSystem`.
 * It also includes animated gradient visuals and a divider for better UI separation.
 *
 * @returns {JSX.Element} The rendered NotFound page component.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <section className="relative isolate flex flex-col items-center justify-center gap-4 py-16 md:py-24 text-center w-full mx-auto">
        <AnimatedGradient />
        <div>
          {languageSystem.span({
            key: "not_found.title",
            params: {
              app_name: "CiTBIN",
            },
            style_type: "title",
            style_options: {
              class: "",
            },
          })}
          {languageSystem.span({
            key: "not_found.description",
            params: {
              app_name: "CiTBIN",
            },
            style_type: "subtitle",
            style_options: {
              class: "text-center",
            },
          })}
        </div>
      </section>

      <Divider />

      <section className="flex flex-col items-center justify-center gap-4 py-16 md:py-24 text-center w-full mx-auto">
        {languageSystem.span({
          key: "not_found.suggestion",
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
          key: "not_found.suggestion_2",
          params: {
            app_name: "CiTBIN",
          },
          style_type: "subtitle",
          style_options: {
            class: "text-center",
          },
        })}
      </section>
    </div>
  );
}
