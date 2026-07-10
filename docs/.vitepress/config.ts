import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "de-DE",
  title: "Citbin Dokumentation",
  description: "Dokumentation für das Citbin Projekt",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/GETTING_STARTED" },
    ],

    sidebar: [
      {
        text: "Einführung",
        items: [
          { text: "Erste Schritte", link: "/GETTING_STARTED" },
          { text: "Organisation", link: "/00-Organisation" },
          {
            text: "Projektbeschreibung",
            link: "/00-Organisation/01-Projektbeschreibung",
          },
          { text: "Gemeinsam", link: "/05-Gemeinsam" },
        ],
      },
      {
        text: "Teams",
        items: [
          { text: "Betrieb", link: "/01-Betrieb" },
          { text: "Hardware", link: "/02-Hardware" },
          { text: "Software", link: "/03-Software" },
          { text: "Projektleitung", link: "/04-Projektleitung" },
        ],
      },
      {
        text: "READMEs",
        items: [
          { text: "Project", link: "/READMEs/main" },
          { text: "API", link: "/READMEs/api" },
          { text: "Website", link: "/READMEs/web" },
          { text: "Infrastrukur", link: "/READMEs/infrastructure" },
          { text: "Simulator", link: "/READMEs/simulator" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/hgs-itg27/citbin" }],
  },
  ignoreDeadLinks: [
    // ignore all localhost links
    /^https?:\/\/localhost/,
  ],
});
