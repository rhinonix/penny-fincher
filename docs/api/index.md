# API Reference

::: warning Work In Progress
The automatic JSDoc documentation is still being set up. This section will be updated with auto-generated API references in the future. For now, please refer to the source code directly.
:::

## Core Services

- **GoogleSheetsService** - Service for interacting with Google Sheets API
  - Handles CRUD operations for transaction data
  - Manages category and subcategory data
  - Provides currency parsing utilities

## Components

- **Layout** - Main layout component with responsive sidebar navigation
- **TransactionFormModal** - Modal for adding new transactions with validation
- **Notification** - Animated notification system for success/error messages
- **CategoryManager** - Component for managing transaction categories
- **SkeletonLoader** - Loading state components for different UI elements

## Pages

- **Dashboard** - Main dashboard with financial overview and charts
- **Transactions** - Transaction listing page with filtering
- **Budget** - Budget management page with comparison charts
- **Reports** - Financial reports with charts and analyses
- **Settings** - Application settings and configuration

## Manual API Documentation

Until the automatic JSDoc integration is complete, here are some key APIs:

### GoogleSheetsService

```typescript
class GoogleSheetsService {
  // Fetches all transactions from Google Sheets
  async getTransactions(): Promise<Transaction[]>
  
  // Counts total number of transactions
  async countTransactions(): Promise<number>
  
  // Adds a new transaction to Google Sheets
  async addTransaction(transaction: Transaction): Promise<void>
  
  // Fetches category and subcategory data
  async fetchCategoryData(): Promise<CategoryData>
  
  // Invalidates category cache
  invalidateCategoryCache(): void
}
```

### Transaction Interface

```typescript
interface Transaction {
  id?: string
  date: string
  description: string
  category?: string
  subcategory?: string
  amountEUR?: number
  amountUSD?: number
  account: string
  notes?: string
}
```