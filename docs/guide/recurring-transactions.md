# Recurring Transactions

PennyFincher makes it easy to manage recurring expenses like subscriptions, monthly bills, and regular payments. This feature helps you stay on top of predictable expenses and ensures they're properly tracked in your financial records.

## Getting Started with Recurring Transactions

Before you can use recurring transactions, you need to set up the `Recurring` sheet in your Google Sheets document:

```bash
npm run setup-recurring
```

This command creates a new sheet named `Recurring` with the necessary columns to store recurring transaction templates.

## Understanding Recurring Transactions

A recurring transaction is a template that defines a transaction that occurs at regular intervals. Unlike regular transactions, recurring transactions have additional properties:

- **Frequency**: How often the transaction occurs (daily, weekly, biweekly, monthly, quarterly, or yearly)
- **Start Date**: When the recurring transaction begins
- **End Date** (optional): When the recurring transaction ends
- **Day of Month/Week**: Specific day when the transaction occurs
- **Active Status**: Whether the recurring transaction is currently active

## Accessing Recurring Transactions

1. Navigate to the Transactions page in PennyFincher
2. Click on the "Recurring Transactions" tab at the top of the page
3. The interface will switch to show your recurring transactions

The tabbed interface provides a clean separation between your regular transactions and recurring transaction templates.

## Adding a Recurring Transaction

1. Navigate to the Transactions page in PennyFincher
2. Click on the "Recurring Transactions" tab
3. Click the "Add Recurring Transaction" button in the top right corner
4. Fill in the details of your recurring transaction:
   - Description (e.g., "Netflix Subscription", "Rent Payment")
   - Account
   - Frequency
   - Start Date
   - Day of Month/Week (depending on frequency)
   - End Date (optional)
   - Category and Subcategory (optional)
   - Amount in EUR or USD
   - Notes (optional)
5. Review the "Next occurrences" preview to confirm the pattern is correct
6. Click "Add Recurring Transaction"

![Recurring Transaction Form](/images/recurring-transaction-form.png)

## Managing Recurring Transactions

The Recurring Transactions tab displays all your recurring transaction templates, including:

- Description
- Frequency
- Next due date
- Amount
- Category
- Account
- Status (Active/Inactive)

### Processing Due Transactions

When a recurring transaction is due (based on its frequency and start date), you can generate an actual transaction from it:

1. Click on the "Recurring Transactions" tab
2. Click the "Process Due Transactions" button in the top right corner
3. PennyFincher will:
   - Check which recurring transactions are due
   - Create actual transactions for them in the Transactions sheet
   - Update the "Last Processed" date for each processed recurring transaction
   - Calculate the next due date
4. You can then switch back to the "Transactions" tab to see the newly created transactions

### Enabling/Disabling Recurring Transactions

You can temporarily disable a recurring transaction without deleting it:

1. Find the recurring transaction in the list
2. Click the "Disable" button (or "Enable" if it's currently disabled)
3. The status will change, and disabled recurring transactions won't be processed

## How Recurring Transactions Work

When you process recurring transactions, PennyFincher:

1. Identifies which recurring transactions are due based on their next due date
2. Creates a new transaction in the Transactions sheet with the details from the template
3. Adds a reference to the recurring transaction ID in the notes
4. Updates the "Last Processed" date in the Recurring sheet
5. Calculates the next due date based on the frequency

## Supported Frequencies

PennyFincher supports these recurring transaction frequencies:

- **Daily**: Occurs every day
- **Weekly**: Occurs every week on a specific day (e.g., every Monday)
- **Biweekly**: Occurs every two weeks on a specific day
- **Monthly**: Occurs every month on a specific day (e.g., 15th of each month)
- **Quarterly**: Occurs every three months on a specific day
- **Yearly**: Occurs once a year on a specific day

## Best Practices

- Set up recurring transactions for regular expenses like rent, mortgage, subscriptions, and utilities
- Process due transactions regularly (at least weekly) to stay up-to-date
- Use descriptive names for your recurring transactions
- Add notes to differentiate similar recurring transactions
- Disable, rather than delete, recurring transactions that are temporarily paused

## Example Use Cases

- Monthly rent or mortgage payments
- Subscription services (Netflix, Spotify, gym memberships)
- Insurance premiums (monthly, quarterly, or yearly)
- Utility bills (electricity, water, internet)
- Loan or credit card payments
- Regular savings or investments
- Membership dues or fees