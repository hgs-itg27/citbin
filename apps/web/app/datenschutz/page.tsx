import { Divider } from "@heroui/divider";

import AnimatedGradient from "@/components/animatedGradient";

/**
 * DatenschutzPage-Komponente
 *
 * Diese React-Komponente rendert die Datenschutzerklärung der Website.
 * Sie enthält mehrere Abschnitte, die allgemeine Hinweise, Informationen zur Datenerfassung,
 * Verwendungszwecke der Daten, Rechte der Nutzer sowie Kontaktinformationen zum Datenschutzbeauftragten bereitstellen.
 *
 * Die Komponente verwendet Tailwind CSS-Klassen für das Layout und Styling.
 * Zusätzlich werden die Komponenten `AnimatedGradient` und `Divider` zur visuellen Gestaltung eingebunden.
 *
 * @component
 * @returns {JSX.Element} Die gerenderte Datenschutzerklärung als JSX-Element.
 */
export default function DatenschutzPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="relative isolate flex flex-col items-center justify-center gap-4 py-16 md:py-24 text-center w-full">
        <AnimatedGradient />
        <div>
          <h1 className="text-4xl font-bold mb-2">Datenschutzerklärung</h1>
          <h2 className="text-xl mb-4">Allgemeine Hinweise</h2>
          <p className="text-center">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was
            mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website
            besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
            persönlich identifiziert werden können.
          </p>
        </div>
      </section>
      <Divider />
      <div>
        <section className="my-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-justify">
              Datenerfassung auf unserer Website
            </h3>
            <p className="text-justify">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
              mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in
              ein Kontaktformular eingeben. Andere Daten werden automatisch beim
              Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
              allem technische Daten (z.B. Internetbrowser, Betriebssystem oder
              Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt
              automatisch, sobald Sie unsere Website betreten.
            </p>
          </div>
        </section>

        <section className="my-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-justify">
              Wofür nutzen wir Ihre Daten?
            </h3>
            <p className="text-justify">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gewährleisten. Andere Daten können
              zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>
          </div>
        </section>

        <section className="my-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-justify">
              Welche Rechte haben Sie bezüglich Ihrer Daten?
            </h3>
            <p className="text-justify">
              Sie haben jederzeit das Recht unentgeltlich Auskunft über
              Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht,
              die Berichtigung, Sperrung oder Löschung dieser Daten zu
              verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz
              können Sie sich jederzeit unter der im Impressum angegebenen
              Adresse an uns wenden.
            </p>
          </div>
        </section>

        <section className="my-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-justify">
              Kontakt
            </h3>
            <p className="text-justify">
              Bei Fragen zum Datenschutz wenden Sie sich bitte an:
              <br />
              Max Mustermann
              <br />
              Musterstraße 1<br />
              12345 Musterstadt
              <br />
              E-Mail: info@musterfirma.de
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
