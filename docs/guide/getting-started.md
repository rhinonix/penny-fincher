# Getting Started

This guide will help you set up PennyFincher on your local machine and connect it to your Google Sheets account.

## Prerequisites

Before you begin, make sure you have the following:

- Node.js (v14 or newer)
- npm or yarn
- A Google account
- Basic knowledge of JavaScript/TypeScript

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/penny-fincher.git
cd penny-fincher
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_SPREADSHEET_ID=your_spreadsheet_id_here
```

## Setting up Google Sheets

1. Create a new Google Sheets document or use an existing one.
2. Create the following sheets:
   - `Transactions`: For storing transaction data
   - `Settings`: For storing categories and subcategories

3. Set up the `Transactions` sheet with the following columns:
   - Date
   - Description
   - Category Select (not used by the app)
   - Category
   - Subcategory
   - Amount (EUR)
   - Amount (USD)
   - Account
   - Notes

4. Set up the `Settings` sheet with the following columns:
   - Category
   - Subcategory

## Getting Your Google API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API
4. Create API credentials (API key)
5. Restrict the API key to the Google Sheets API only
6. Copy the API key to your `.env` file

## Getting Your Spreadsheet ID

The Spreadsheet ID is the part of your spreadsheet URL that looks like this:
`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

Copy this ID to your `.env` file.

## Running the Application

Start the development server:

```bash
npm run dev
```

You should now be able to access PennyFincher at `http://localhost:5173/`.

## Next Steps

Continue to the [Configuration](/guide/configuration) guide to learn how to customize PennyFincher for your needs.