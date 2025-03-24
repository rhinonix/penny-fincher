# RecurringTransactionFormModal Component

The `RecurringTransactionFormModal` component provides a user interface for creating new recurring transactions in PennyFincher. This modal form collects all necessary information to set up a transaction template that will automatically generate transactions at regular intervals.

## Usage

```tsx
import RecurringTransactionFormModal from '../components/RecurringTransactionFormModal';

function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  
  // Component usage
  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Add Recurring Transaction
      </button>
      
      <RecurringTransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={() => loadRecurringTransactions()}
        accounts={accounts}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls whether the modal is visible |
| `onClose` | `() => void` | Function called when the modal is closed |
| `onTransactionAdded` | `() => void` | Callback function triggered after a recurring transaction is successfully added |
| `accounts` | `string[]` | Array of account names to be used in the form dropdown |

## Features

### Dynamic Form Fields

The modal dynamically adjusts form fields based on the selected frequency:
- For monthly/quarterly/yearly frequencies, it shows a "Day of Month" selector
- For weekly/biweekly frequencies, it shows a "Day of Week" selector
- For daily frequency, no additional date selectors are needed

### Preview of Upcoming Transactions

The form includes a preview section that shows the next 5 occurrences of the recurring transaction based on the current settings. This helps users verify the frequency pattern is set up correctly.

### Category Selection

The form includes category and subcategory selection dropdowns that are populated with data from the Google Sheets document, ensuring consistent categorization.

### Form Validation

The form validates required fields and ensures that the necessary frequency-specific fields are provided based on the selected frequency.

## Implementation Details

The component uses:
- React hooks for state management
- date-fns for date calculations and formatting
- GoogleSheets service to fetch category data and add recurring transactions

## Example

```tsx
<RecurringTransactionFormModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onTransactionAdded={() => {
    loadRecurringTransactions();
    showNotification('Recurring transaction added successfully');
  }}
  accounts={['Cash', 'Credit Card', 'Bank Account']}
/>
```

## Styling

The component uses Tailwind CSS for styling, including:
- Modal overlay with background blur
- Responsive form layout (single column on mobile, two columns on larger screens)
- Clear visual hierarchy for form sections
- Preview section with visual indicators for upcoming dates

## Related Components

- [RecurringTransactions](./RecurringTransactions.md) - Component for managing recurring transactions