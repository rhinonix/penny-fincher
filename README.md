# PennyFincher

PennyFincher is a personal finance tracking application that helps you manage your budget, track expenses, and gain insights into your spending habits.

## Features

- **Dashboard**: Get a quick overview of your financial health
- **Transaction Management**: Record, edit, and categorize your expenses and income
- **Recurring Transactions**: Manage subscriptions, monthly bills, and other recurring expenses
- **Budget Planning**: Set budgets by category and track your progress
- **Reports**: Visualize your spending patterns with intuitive charts
- **Categories**: Customize transaction categories to fit your needs
- **Google Sheets Integration**: Store your data securely in your own Google account

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure your Google Sheets API credentials
4. Set up the Recurring Transactions sheet with `npm run setup-recurring`
5. Run the development server with `npm run dev`

See the [documentation site](https://rhinonix.github.io/penny-fincher/) for detailed setup instructions.

## Setting Up Recurring Transactions

PennyFincher supports managing recurring transactions like monthly bills, subscriptions, and other regular expenses:

1. Run `npm run setup-recurring` to create the Recurring sheet in your Google spreadsheet
2. Navigate to the Transactions page in PennyFincher
3. Use the "Add Recurring Transaction" button to create new recurring items
4. Click "Process Due Transactions" to automatically generate transactions for your recurring items

Recurring transactions can be set up with various frequencies (daily, weekly, monthly, etc.) and will be automatically applied to your transaction list.

## Technology Stack

- React 18
- TypeScript
- Vite
- Google Sheets API
- Tailwind CSS
- React Query
- React Router

## Documentation

The project documentation is built with VitePress and is available at:
https://rhinonix.github.io/penny-fincher/

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT
