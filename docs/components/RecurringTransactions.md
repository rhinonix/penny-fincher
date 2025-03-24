# RecurringTransactions Component

The `RecurringTransactions` component provides a user interface for managing recurring transactions in PennyFincher. This component allows users to view, add, and manage recurring transactions that should be processed regularly.

## Usage

```tsx
import RecurringTransactions from '../components/RecurringTransactions';

function TransactionsPage() {
  const [accounts, setAccounts] = useState<string[]>([]);
  
  // Component usage
  return (
    <div>
      {/* Other components */}
      <RecurringTransactions 
        accounts={accounts} 
        onProcessDue={() => loadTransactions()}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `accounts` | `string[]` | Array of account names to be used in the form dropdown |
| `onProcessDue` | `() => void` | Callback function triggered after due transactions have been processed |

## Features

### Viewing Recurring Transactions

The component displays a table of all recurring transactions with key information:
- Description
- Frequency
- Next due date
- Amounts
- Category/Subcategory
- Account
- Status (Active/Inactive)

### Processing Due Transactions

The component provides a "Process Due Transactions" button that:
1. Identifies which recurring transactions are currently due
2. Creates actual transactions for them in the Transactions sheet
3. Updates the last processed date and calculates the next due date

### Adding New Recurring Transactions

The component includes a button to open the `RecurringTransactionFormModal` which handles the creation of new recurring transaction templates.

### Managing Transaction Status

Each recurring transaction can be toggled between Active and Inactive states. Inactive transactions will not be processed automatically.

## Implementation Details

The component uses the Google Sheets service to:
- Fetch all recurring transactions
- Process due transactions
- Toggle the active status of transactions

## Example

```tsx
<RecurringTransactions 
  accounts={['Cash', 'Credit Card', 'Bank Account']} 
  onProcessDue={() => {
    // Callback to refresh the main transaction list after processing
    loadTransactions();
    showNotification('Processed recurring transactions successfully');
  }}
/>
```

## Styling

The component uses Tailwind CSS for styling, including:
- Card-based layout with shadow and rounded corners
- Responsive table with proper spacing
- Color coding for active/inactive status
- Distinctive buttons for different actions

## Related Components

- [RecurringTransactionFormModal](./RecurringTransactionFormModal.md) - Modal form for adding new recurring transactions