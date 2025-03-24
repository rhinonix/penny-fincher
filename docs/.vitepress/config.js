import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PennyFincher Docs',
  description: 'Documentation for the PennyFincher personal finance tracker',
  base: '/penny-fincher/', // GitHub Pages repository name
  ignoreDeadLinks: true, // Ignore dead links during build
  themeConfig: {
    logo: '/logo.svg',
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
            { text: 'RecurringTransactions', link: '/components/RecurringTransactions' },
            { text: 'RecurringTransactionFormModal', link: '/components/RecurringTransactionFormModal' },
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
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Recurring Transactions', link: '/guide/recurring-transactions' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rhinonix/penny-fincher' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present'
    }
  }
})