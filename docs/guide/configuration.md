# Configuration

This guide covers how to configure PennyFincher to match your preferences and needs.

## Application Settings

PennyFincher offers several settings that you can configure through the Settings page in the application:

### General Settings

- **Default Currency**: Choose between EUR, USD, and others
- **Date Format**: Select your preferred date format (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
- **Theme**: Choose between Light, Dark, or System Default

### Google Sheets Connection

You can reconnect to a different Google Sheets document if needed:

1. Go to the Settings page
2. Navigate to the Account tab
3. Click "Reconnect to Google Sheets"
4. Follow the prompts to connect to a new spreadsheet

## Categories Management

PennyFincher allows you to manage transaction categories and subcategories:

1. Go to the Settings page
2. Navigate to the Data tab
3. Use the Categories & Subcategories section to view existing categories
4. To add new categories or subcategories, edit your Google Sheets document:
   - Add new rows to the Settings sheet
   - First column: Category
   - Second column: Subcategory
5. Click "Refresh Categories" in the app to load your changes

## Custom Budget Setup

The Budget page uses predefined sample budgets by default. To customize your budgets:

1. Edit the `SAMPLE_BUDGETS` object in `src/pages/Budget.tsx`
2. Set your preferred budget amounts for each category

```typescript
const SAMPLE_BUDGETS = {
  'Food & Dining': 500,  // Change to your preferred amount
  'Shopping': 300,
  'Housing': 1200,
  // Add or remove categories as needed
}
```

For a production application, you would implement budget storage in your Google Sheets document.

## Environment Variables

PennyFincher uses the following environment variables:

- `VITE_GOOGLE_API_KEY`: Your Google API key
- `VITE_SPREADSHEET_ID`: The ID of your Google Sheets document

You can update these in your `.env` file if needed.