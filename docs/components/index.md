# Components Overview

PennyFincher is built with a modular component structure. This section provides documentation for the key components used throughout the application.

## Core Components

- [Layout](./Layout.md) - The main layout component that provides the application structure
- [TransactionFormModal](./TransactionFormModal.md) - Modal for adding new transactions
- [RecurringTransactions](./RecurringTransactions.md) - Component for managing recurring transactions
- [RecurringTransactionFormModal](./RecurringTransactionFormModal.md) - Modal for adding recurring transactions
- [Notification](./Notification.md) - Toast notification system for success/error messages
- [CategoryManager](./CategoryManager.md) - Component for managing transaction categories
- [SkeletonLoader](./SkeletonLoader.md) - Loading state components for different UI elements

## Page Components

- **Dashboard** - Main dashboard with financial overview and charts
- **Transactions** - Page for listing and filtering transactions
- **Budget** - Budget management page with comparison charts
- **Reports** - Financial reports with charts and analyses
- **Settings** - Application settings and configuration

## Component Structure

Components in PennyFincher follow a consistent pattern:

- Clear separation of props using TypeScript interfaces
- State management using React hooks
- JSDoc comments for documentation
- Consistent styling with Tailwind CSS

## Component Examples

### Basic Component Structure

```tsx
/**
 * Description of what the component does
 * @param {Props} props - Component props
 * @returns {JSX.Element} The rendered component
 */
function ExampleComponent(props: Props) {
  // State and hooks
  const [state, setState] = useState(initialState);

  // Event handlers and other functions
  const handleEvent = () => {
    // Do something
  };

  // JSX rendering
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

See individual component pages for detailed documentation and usage examples.