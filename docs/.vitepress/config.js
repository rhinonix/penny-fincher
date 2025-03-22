import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PennyFincher Documentation',
  description: 'Documentation for the PennyFincher personal finance tracker',
  base: '/penny-fincher/', // GitHub Pages repository name
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API', link: '/api/' },
      { text: 'Components', link: '/components/' },
      { text: 'Guide', link: '/guide/' }
    ],
    sidebar: {
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'GoogleSheetsService', link: '/api/googleSheets' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            { text: 'Layout', link: '/components/Layout' },
            { text: 'TransactionFormModal', link: '/components/TransactionFormModal' },
            { text: 'Notification', link: '/components/Notification' },
            { text: 'CategoryManager', link: '/components/CategoryManager' },
            { text: 'SkeletonLoader', link: '/components/SkeletonLoader' }
          ]
        }
      ],
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/penny-fincher' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present'
    }
  }
})