import { defineConfig } from 'vitepress'

export default defineConfig({
    lang: 'de-DE',
    title: 'Citbin Dokumentation',
    description: 'Dokumentation für das Citbin Projekt',
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Docs', link: '/05-Gemeinsam' },
      ],

      sidebar: [
        {
          text: 'Einführung',
          items: [
            { text: 'Erste Schritte', link: '/05-Gemeinsam/Einstieg' },
            { text: 'Organisation', link: '/00-Organisation' },
            { text: 'Projektbeschreibung', link: '/00-Organisation/01-Projektbeschreibung' },
            { text: 'Gemeinsam', link: '/05-Gemeinsam' }
          ]
        },
        {
          text: 'Teams',
          items: [
            { text: 'Betrieb', link: '/01-Betrieb' },
            { text: 'Hardware', link: '/02-Hardware' },
            { text: 'Software', link: '/03-Software' },
            { text: 'Projektleitung', link: '/04-Projektleitung' }
            
          ]
        }
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/hgs-itg27/citbin' }
      ]
    },
    ignoreDeadLinks: [
      // ignore all localhost links
      /^https?:\/\/localhost/,
    ]
})
