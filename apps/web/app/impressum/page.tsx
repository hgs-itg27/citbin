import { Divider } from "@heroui/divider";

import AnimatedGradient from "@/components/animatedGradient";

/**
 * Renders the Impressum (legal notice) page with company and contact information,
 * as well as legal disclaimers according to § 5 TMG.
 *
 * The page includes:
 * - Company address and representative details.
 * - Contact information (phone and email).
 * - Legal disclaimer regarding liability for content.
 *
 * Layout is styled using Tailwind CSS utility classes and includes animated gradient
 * and divider components for visual enhancement.
 *
 * @component
 * @returns {JSX.Element} The Impressum page content.
 */
export default function ImpressumPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="relative isolate flex flex-col items-center justify-center gap-4 py-16 md:py-24 text-center w-full">
        <AnimatedGradient />
        <div>
          <h1 className="text-4xl font-bold mb-2">Impressum</h1>
          <h2 className="text-xl mb-4">Angaben gemäß § 5 TMG</h2>
          <p className="text-center">
            Max Mustermann
            <br />
            Musterstraße 1<br />
            12345 Musterstadt
            <br />
            Deutschland
          </p>
          <br />
          <p className="text-center">
            <strong>Vertreten durch:</strong>
            <br />
            Max Mustermann
          </p>
        </div>
      </section>
      <Divider />
      <div>
        <section className="my-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-justify">
              Kontakt
            </h3>
            <p className="text-justify">
              Telefon: 01234 / 567890
              <br />
              E-Mail: info@musterfirma.de
            </p>
          </div>
        </section>

        <section className="my-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-justify">
              Haftung für Inhalte
            </h3>
            <p className="text-justify">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
              Entfernung oder Sperrung der Nutzung von Informationen nach den
              allgemeinen Gesetzen bleiben hiervon unberührt. Eine
              diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
              Kenntnis einer konkreten Rechtsverletzung möglich. Bei
              Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
