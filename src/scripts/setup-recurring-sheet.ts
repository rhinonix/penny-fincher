/**
 * Script to set up the Recurring sheet in the Google Sheets spreadsheet
 * 
 * This script creates a new sheet named "Recurring" with the necessary columns
 * for storing recurring transaction data.
 * 
 * Usage:
 * 1. Ensure you have the necessary Google Sheets API credentials
 * 2. Set the SPREADSHEET_ID environment variable
 * 3. Run using ts-node: npx ts-node src/scripts/setup-recurring-sheet.ts
 */

// Import required libraries
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SPREADSHEET_ID = process.env.VITE_SPREADSHEET_ID;
const API_KEY = process.env.VITE_GOOGLE_API_KEY;

if (!SPREADSHEET_ID || !API_KEY) {
  console.error('Missing required environment variables: VITE_SPREADSHEET_ID or VITE_GOOGLE_API_KEY');
  process.exit(1);
}

/**
 * Sets up the Recurring sheet in the Google Sheets spreadsheet
 */
async function setupRecurringSheet() {
  try {
    // Check if the Recurring sheet already exists
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`
    );
    
    if (!sheetsResponse.ok) {
      throw new Error(`API error: ${sheetsResponse.status}`);
    }
    
    const sheetsData = await sheetsResponse.json();
    const sheets = sheetsData.sheets || [];
    
    // Check if the Recurring sheet already exists
    const recurringSheetExists = sheets.some((sheet: any) => 
      sheet.properties?.title === 'Recurring'
    );
    
    if (recurringSheetExists) {
      console.log('Recurring sheet already exists. Skipping creation.');
    } else {
      // Create the Recurring sheet
      console.log('Creating Recurring sheet...');
      
      // Add the sheet
      const addSheetResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requests: [{
              addSheet: {
                properties: {
                  title: 'Recurring',
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 14
                  }
                }
              }
            }]
          })
        }
      );
      
      if (!addSheetResponse.ok) {
        throw new Error(`API error creating sheet: ${addSheetResponse.status}`);
      }
      
      console.log('Recurring sheet created successfully.');
    }
    
    // Add the header row
    console.log('Setting up header row...');
    
    const headers = [
      'Description',
      'Frequency',
      'Category',
      'Subcategory',
      'Start Date',
      'Amount (EUR)',
      'Amount (USD)',
      'Account',
      'Notes',
      'Day of Month',
      'Day of Week',
      'End Date',
      'Last Processed',
      'Active'
    ];
    
    const updateHeadersResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Recurring!A1:N1?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [headers]
        })
      }
    );
    
    if (!updateHeadersResponse.ok) {
      throw new Error(`API error updating headers: ${updateHeadersResponse.status}`);
    }
    
    console.log('Headers set up successfully.');
    
    // Format the header row (bold, center align, background color)
    console.log('Formatting headers...');
    
    const formatHeadersResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheets.find((sheet: any) => sheet.properties?.title === 'Recurring').properties.sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: headers.length
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.8,
                      green: 0.9,
                      blue: 0.8
                    },
                    horizontalAlignment: 'CENTER',
                    textFormat: {
                      bold: true
                    }
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
              }
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: sheets.find((sheet: any) => sheet.properties?.title === 'Recurring').properties.sheetId,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: headers.length
                }
              }
            }
          ]
        })
      }
    );
    
    if (!formatHeadersResponse.ok) {
      throw new Error(`API error formatting headers: ${formatHeadersResponse.status}`);
    }
    
    console.log('Header formatting applied successfully.');
    console.log('Recurring sheet setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up Recurring sheet:', error);
    process.exit(1);
  }
}

// Run the setup function
setupRecurringSheet();