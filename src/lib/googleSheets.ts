/**
 * Represents a financial transaction record
 * @interface Transaction
 */
interface Transaction {
  /** Unique identifier for the transaction */
  id?: string;
  /** Date of the transaction (MM/DD/YYYY format) */
  date: string;
  /** Description of the transaction */
  description: string;
  /** Primary category of the transaction */
  category?: string;
  /** Subcategory of the transaction */
  subcategory?: string;
  /** Amount in Euros */
  amountEUR?: number;
  /** Amount in US Dollars */
  amountUSD?: number;
  /** Account associated with the transaction */
  account: string;
  /** Additional notes about the transaction */
  notes?: string;
}

/**
 * Structure containing category and subcategory data
 * @interface CategoryData
 */
interface CategoryData {
  /** List of all available categories */
  categories: string[];
  /** Map of categories to their subcategories */
  subcategories: Record<string, string[]>;
  /** Flat list of all subcategories */
  allSubcategories: string[];
}

/**
 * Service for interacting with Google Sheets API for financial data management
 * @class GoogleSheetsService
 */
export class GoogleSheetsService {
  /** Google API key from environment variables */
  private apiKey: string;
  /** ID of the Google Spreadsheet containing financial data */
  private spreadsheetId: string;
  /** Cache for category data to reduce API calls */
  private categoryData: CategoryData | null = null;
  
  /**
   * Initializes the Google Sheets service with API credentials
   * @constructor
   * @throws {Error} If environment variables are missing
   */
  constructor() {
    // Check for environment variables
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
    
    if (!this.apiKey || !this.spreadsheetId) {
      throw new Error('Missing Google Sheets environment variables');
    }
  }

  /**
   * Parses various currency formats into a normalized number value
   * @private
   * @param {any} value - The currency value to parse
   * @returns {number|undefined} Parsed number or undefined if parsing fails
   */
  private parseCurrencyValue(value: any): number | undefined {
    if (!value) return undefined;
    
    // Convert to string if not already
    const strValue = String(value);
    
    // If empty string, return undefined
    if (strValue.trim() === '') return undefined;
    
    try {
      // Handle different number formats
      
      // Check if the value uses comma as decimal separator (e.g., European format: 1.234,56)
      if (/^\d{1,3}(\.?\d{3})*,\d+$/.test(strValue)) {
        // European format: replace dots (thousand separators) and convert comma to dot for decimal
        const normalized = strValue.replace(/\./g, '').replace(',', '.');
        return parseFloat(normalized);
      }
      
      // Handle US format (e.g., 1,234.56)
      if (/^\d{1,3}(,?\d{3})*\.\d+$/.test(strValue)) {
        // US format: remove commas (thousand separators)
        const normalized = strValue.replace(/,/g, '');
        return parseFloat(normalized);
      }
      
      // For values with currency symbols (e.g., $1,234.56 or €1.234,56)
      // First remove all currency symbols and whitespace
      let cleanValue = strValue.replace(/[$€£¥\s]/g, '');
      
      // Now check format again after cleaning
      if (/^\d{1,3}(\.?\d{3})*,\d+$/.test(cleanValue)) {
        // European format
        cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
        return parseFloat(cleanValue);
      } else if (/^\d{1,3}(,?\d{3})*\.\d+$/.test(cleanValue)) {
        // US format
        cleanValue = cleanValue.replace(/,/g, '');
        return parseFloat(cleanValue);
      }
      
      // For simple numbers without formatting
      // Remove all non-numeric chars except dots and negative signs
      const numericValue = strValue.replace(/[^0-9.-]/g, '');
      const parsedValue = parseFloat(numericValue);
      return !isNaN(parsedValue) ? parsedValue : undefined;
    } catch (e) {
      console.error('Error parsing currency value:', strValue, e);
      return undefined;
    }
  }

  /**
   * Fetches all transactions from the Google Sheets document
   * @async
   * @returns {Promise<Transaction[]>} Array of transactions sorted by date (newest first)
   * @throws {Error} If API call fails
   */
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Transactions!A2:I?key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      // Debug first few rows for currency format inspection
      if (rows.length > 0) {
        // Log column indices for debugging
        console.log('Column indices: Date=0, Desc=1, Cat=3, Subcat=4, EUR=5, USD=6, Account=7, Notes=8');
        
        // Log the first 3 rows to help diagnose format issues
        rows.slice(0, 3).forEach((row, idx) => {
          console.log(`Row ${idx + 2}:`, {
            date: row[0],
            amountEUR_raw: row[5],
            amountEUR_parsed: this.parseCurrencyValue(row[5]),
            amountUSD_raw: row[6],
            amountUSD_parsed: this.parseCurrencyValue(row[6]),
            category: row[3]
          });
        });
        
        // Look for large vacation values specifically
        const vacationRows = rows.filter(row => 
          row[3]?.toLowerCase().includes('vacation') || 
          row[3]?.toLowerCase().includes('travel')
        );
        
        if (vacationRows.length > 0) {
          console.log('Vacation transactions found:', vacationRows.slice(0, 3).map(row => ({
            date: row[0],
            description: row[1],
            category: row[3],
            amountEUR_raw: row[5],
            amountEUR_parsed: this.parseCurrencyValue(row[5])
          })));
        }
      }
      
      // Convert rows to transactions
      const transactions = rows.map((row: any[], index: number) => {
        // Parse currency values properly
        const amountEUR = this.parseCurrencyValue(row[5]);
        const amountUSD = this.parseCurrencyValue(row[6]);
        
        // Sanity check for absurdly large values (probably parsing errors)
        // Limit to reasonable maximum of 100,000 currency units
        const sanitizedAmountEUR = amountEUR && amountEUR > 100000 ? undefined : amountEUR;
        const sanitizedAmountUSD = amountUSD && amountUSD > 100000 ? undefined : amountUSD;
        
        return {
          id: `row-${index + 2}`,
          date: row[0] || '',
          description: row[1] || '',
          // Skip index 2 which is Category Select
          category: row[3] || '',
          subcategory: row[4] || '',
          amountEUR: sanitizedAmountEUR,
          amountUSD: sanitizedAmountUSD,
          account: row[7] || '',
          notes: row[8] || ''
        };
      });
      
      // Sort by date in descending order (newest first)
      return transactions.sort((a, b) => {
        // Parse dates - assumes format is MM/DD/YYYY or similar
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Counts the total number of transactions in the spreadsheet
   * @async
   * @returns {Promise<number>} Count of transactions
   * @throws {Error} If API call fails
   */
  async countTransactions(): Promise<number> {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Transactions!A2:A?key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return (data.values || []).length;
    } catch (error) {
      console.error('Error counting transactions:', error);
      throw error;
    }
  }

  /**
   * Adds a new transaction to the Google Sheets document
   * @async
   * @param {Transaction} transaction - The transaction to add
   * @returns {Promise<void>}
   * @throws {Error} If API call fails
   */
  async addTransaction(transaction: Transaction): Promise<void> {
    try {
      const values = [
        [
          transaction.date,
          transaction.description,
          '', // Skip Category Select
          transaction.category || '',
          transaction.subcategory || '',
          transaction.amountEUR || '',
          transaction.amountUSD || '',
          transaction.account,
          transaction.notes || ''
        ]
      ];
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Transactions!A2:I:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: values
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  /**
   * Fetches category and subcategory data from the Settings sheet
   * @async
   * @returns {Promise<CategoryData>} Structured category data
   */
  async fetchCategoryData(): Promise<CategoryData> {
    // Return cached data if available
    if (this.categoryData) {
      return this.categoryData;
    }
    
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Settings!A2:B?key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      const categoriesMap: Record<string, string[]> = {};
      const allCategories = new Set<string>();
      const allSubcategories: string[] = [];
      
      rows.forEach((row: string[]) => {
        const category = row[0]?.trim();
        const subcategory = row[1]?.trim();
        
        if (category) {
          allCategories.add(category);
          
          if (!categoriesMap[category]) {
            categoriesMap[category] = [];
          }
          
          if (subcategory) {
            categoriesMap[category].push(subcategory);
            allSubcategories.push(subcategory);
          }
        }
      });
      
      // Sort categories and subcategories alphabetically
      const sortedCategories = Array.from(allCategories).sort();
      
      // Sort subcategories for each category
      Object.keys(categoriesMap).forEach(category => {
        categoriesMap[category].sort();
      });
      
      this.categoryData = {
        categories: sortedCategories,
        subcategories: categoriesMap,
        allSubcategories: allSubcategories.sort()
      };
      
      return this.categoryData;
    } catch (error) {
      console.error('Error fetching category data:', error);
      // Return empty data structure if fetch fails
      return {
        categories: [],
        subcategories: {},
        allSubcategories: []
      };
    }
  }
  
  /**
   * Invalidates the category cache when categories are updated
   * Forces a refresh of category data on next fetchCategoryData call
   */
  invalidateCategoryCache(): void {
    this.categoryData = null;
  }
}

/** 
 * Singleton instance of GoogleSheetsService
 * @const googleSheets
 */
export const googleSheets = new GoogleSheetsService();