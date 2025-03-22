# JSDoc Standards for Penny-Fincher

## Overview

This document outlines the JSDoc standards to be consistently applied across all files in the Penny-Fincher application.

## Types of Documentation Required

### 1. Interfaces and Types

All interfaces and types should have:

- A description of what the interface/type represents
- @interface or @type tags
- Documentation for each property

Example:

```typescript
/**
 * Represents a financial transaction record
 * @interface Transaction
 */
interface Transaction {
  /** Unique identifier for the transaction */
  id?: string;
  /** Date of the transaction (MM/DD/YYYY format) */
  date: string;
  // ...other properties
}
```

### 2. Components

All React components should have:

- Description of the component's purpose and functionality
- @param documentation for props (if applicable)
- @returns documentation for what the component renders

Example:

```typescript
/**
 * Modal component for adding new transactions
 *
 * Provides a form with input fields for all transaction data.
 *
 * @param {TransactionFormModalProps} props - Component props
 * @returns {JSX.Element|null} Rendered modal or null when closed
 */
function TransactionFormModal(props: TransactionFormModalProps) {
  // ...implementation
}
```

### 3. Functions and Methods

All functions/methods should have:

- Description of what the function does
- @param documentation for each parameter
- @returns documentation for the return value
- @async tag for async functions
- @throws tag for functions that throw errors

Example:

```typescript
/**
 * Fetches all transactions from the Google Sheets document
 * @async
 * @returns {Promise<Transaction[]>} Array of transactions sorted by date
 * @throws {Error} If API call fails
 */
async function getTransactions(): Promise<Transaction[]> {
  // ...implementation
}
```

### 4. Constants and Configuration

All significant constants should have:

- Description of what the constant represents and how it's used

Example:

```typescript
/**
 * Navigation items for the sidebar
 * @type {Array<{name: string, href: string, icon: React.ComponentType}>}
 */
const navigation = [
  // ...items
];
```

## Files to Update

The following files still need JSDoc updates:

1. src/components/SkeletonLoader.tsx
2. src/components/Notification.tsx
3. src/components/CategoryManager.tsx
4. src/pages/Transactions.tsx
5. src/pages/Budget.tsx
6. src/pages/Reports.tsx
7. src/pages/Settings.tsx

## Process

1. Start with core components and most frequently used utilities
2. Move to page components
3. Document any remaining utilities or helpers
