// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sistema Integral de Servicio Social Albatros',
  tagline: 'Instituto Tecnologico de Ensenada',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'Instituto Tecnologico de Ensenada',
  projectName: 'SISSA',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },

          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Inicio',
        logo: {
          alt: 'Inicio',
          src: 'img/albatro.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentación',
          },
          {to: 'https://www.ensenada.tecnm.mx/', label: 'ITE', position: 'left'},
          {
            href: 'https://www.ensenada.tecnm.mx/',
            label: 'Instituto Tecnologico de Ensenada',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentación',
                to: '/docs/category/introducción',
              },
            ],
          },
          {
            title: 'Comunidad',
            items: [
              {
                label: 'Youtube',
                href: 'https://www.youtube.com/@TecNMEnsenada',
              },
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/TecNMITEnsenada/',
              },
              {
                label: 'X',
                href: 'https://twitter.com/TecNMEnsenada?ref_src=twsrc%5Etfw',
              },
            ],
          },
          {
            title: 'Otros',
            items: [
              {
                label: 'Calendario Escolar',
                href: 'https://www.ensenada.tecnm.mx/calendario-escolar-2/',
              },
              {
                label: 'Reglamentos y documentos normativos',
                href: 'https://www.ensenada.tecnm.mx/reglamentos-y-documentos-normativos/',
              },
              {
                label: 'Direcctorio',
                href: 'https://www.ensenada.tecnm.mx/organigrama/',
              },
              {
                label: 'Aviso de Privacidad',
                href: 'https://www.ensenada.tecnm.mx/aviso-de-privacidad/',
              },
            ],
          },
        ],
        copyright: `Derechos reservados, sin registro. ${new Date().getFullYear()} Sistema de Servicio Social Albatros - Documentación - (SISSA).`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
