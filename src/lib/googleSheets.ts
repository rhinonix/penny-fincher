/**
 * Represents a financial transaction record
 * @interface Transaction
 */
export interface Transaction {
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
  /** Optional reference to a recurring transaction that generated this transaction */
  recurringId?: string;
}

/**
 * Represents a recurring transaction template
 * @interface RecurringTransaction
 */
export interface RecurringTransaction {
  /** Unique identifier for the recurring transaction */
  id?: string;
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
  /** Frequency of recurrence: daily, weekly, biweekly, monthly, quarterly, yearly */
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  /** Day of month (1-31) for monthly/quarterly/yearly frequencies */
  dayOfMonth?: number;
  /** Day of week (0-6, 0 is Sunday) for weekly/biweekly frequencies */
  dayOfWeek?: number;
  /** Start date for the recurring transaction */
  startDate: string;
  /** Optional end date for the recurring transaction */
  endDate?: string;
  /** Date when this recurring transaction was last processed */
  lastProcessed?: string;
  /** Date when this recurring transaction is next due */
  nextDue?: string;
  /** Whether this recurring transaction is active */
  active: boolean;
}

/**
 * Structure containing category and subcategory data
 * @interface CategoryData
 */
export interface CategoryData {
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
  /** Cache for recurring transactions to reduce API calls */
  private recurringTransactionsCache: RecurringTransaction[] | null = null;
  
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

  /**
   * Fetches all recurring transactions from the Google Sheets document
   * @async
   * @returns {Promise<RecurringTransaction[]>} Array of recurring transactions
   * @throws {Error} If API call fails
   */
  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    if (this.recurringTransactionsCache) {
      return this.recurringTransactionsCache;
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Recurring!A2:N?key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      // Convert rows to recurring transactions
      const recurringTransactions = rows.map((row: any[], index: number) => {
        // Parse currency values
        const amountEUR = this.parseCurrencyValue(row[5]);
        const amountUSD = this.parseCurrencyValue(row[6]);
        
        // Parse boolean values
        const active = row[13] === 'TRUE' || row[13] === 'true' || row[13] === '1';
        
        return {
          id: `recurring-${index + 2}`,
          description: row[0] || '',
          category: row[2] || '',
          subcategory: row[3] || '',
          amountEUR: amountEUR,
          amountUSD: amountUSD,
          account: row[7] || '',
          notes: row[8] || '',
          frequency: row[1] || 'monthly',
          dayOfMonth: row[9] ? parseInt(row[9], 10) : undefined,
          dayOfWeek: row[10] ? parseInt(row[10], 10) : undefined,
          startDate: row[4] || '',
          endDate: row[11] || '',
          lastProcessed: row[12] || '',
          nextDue: this.calculateNextDueDate(row[1], row[4], row[9], row[10], row[12]),
          active: active
        };
      });
      
      this.recurringTransactionsCache = recurringTransactions;
      return recurringTransactions;
    } catch (error) {
      console.error('Error fetching recurring transactions:', error);
      return [];
    }
  }

  /**
   * Calculates the next due date for a recurring transaction
   * @private
   * @param {string} frequency - Frequency of recurrence
   * @param {string} startDate - Start date of the recurring transaction
   * @param {string|undefined} dayOfMonthStr - Day of month (for monthly, quarterly, yearly)
   * @param {string|undefined} dayOfWeekStr - Day of week (for weekly, biweekly)
   * @param {string|undefined} lastProcessed - Date when the transaction was last processed
   * @returns {string|undefined} Next due date in YYYY-MM-DD format or undefined if calculation fails
   */
  private calculateNextDueDate(
    frequency: string, 
    startDate: string, 
    dayOfMonthStr?: string, 
    dayOfWeekStr?: string,
    lastProcessed?: string
  ): string | undefined {
    try {
      // Parse inputs
      const baseDate = lastProcessed && new Date(lastProcessed).toString() !== 'Invalid Date' 
        ? new Date(lastProcessed) 
        : new Date(startDate);
      
      if (baseDate.toString() === 'Invalid Date') {
        return undefined;
      }
      
      const dayOfMonth = dayOfMonthStr ? parseInt(dayOfMonthStr, 10) : undefined;
      const dayOfWeek = dayOfWeekStr ? parseInt(dayOfWeekStr, 10) : undefined;
      
      let nextDate = new Date(baseDate);
      const today = new Date();
      
      // Ensure we're calculating at least one day in the future
      if (nextDate < today) {
        nextDate = today;
      }
      
      switch (frequency) {
        case 'daily':
          // Just add one day
          nextDate.setDate(nextDate.getDate() + 1);
          break;
          
        case 'weekly':
          // Add 7 days
          nextDate.setDate(nextDate.getDate() + 7);
          
          // If dayOfWeek is specified, adjust to that day
          if (dayOfWeek !== undefined) {
            // Calculate days to add to get to the specified day of week
            const currentDay = nextDate.getDay();
            const daysToAdd = (dayOfWeek - currentDay + 7) % 7;
            nextDate.setDate(nextDate.getDate() + daysToAdd);
          }
          break;
          
        case 'biweekly':
          // Add 14 days
          nextDate.setDate(nextDate.getDate() + 14);
          
          // If dayOfWeek is specified, adjust to that day
          if (dayOfWeek !== undefined) {
            // Calculate days to add to get to the specified day of week
            const currentDay = nextDate.getDay();
            const daysToAdd = (dayOfWeek - currentDay + 7) % 7;
            nextDate.setDate(nextDate.getDate() + daysToAdd);
          }
          break;
          
        case 'monthly':
          // Add one month
          nextDate.setMonth(nextDate.getMonth() + 1);
          
          // If dayOfMonth is specified, adjust to that day
          if (dayOfMonth !== undefined) {
            nextDate.setDate(Math.min(dayOfMonth, this.getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth())));
          }
          break;
          
        case 'quarterly':
          // Add three months
          nextDate.setMonth(nextDate.getMonth() + 3);
          
          // If dayOfMonth is specified, adjust to that day
          if (dayOfMonth !== undefined) {
            nextDate.setDate(Math.min(dayOfMonth, this.getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth())));
          }
          break;
          
        case 'yearly':
          // Add one year
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          
          // If dayOfMonth is specified, adjust to that day
          if (dayOfMonth !== undefined) {
            nextDate.setDate(Math.min(dayOfMonth, this.getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth())));
          }
          break;
          
        default:
          // Default to monthly if frequency is unknown
          nextDate.setMonth(nextDate.getMonth() + 1);
      }
      
      // Format date as YYYY-MM-DD
      return nextDate.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error calculating next due date:', error);
      return undefined;
    }
  }

  /**
   * Helper function to get the number of days in a month
   * @private
   * @param {number} year - The year
   * @param {number} month - The month (0-11)
   * @returns {number} Number of days in the month
   */
  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  /**
   * Adds a new recurring transaction to the Google Sheets document
   * @async
   * @param {RecurringTransaction} recurringTransaction - The recurring transaction to add
   * @returns {Promise<void>}
   * @throws {Error} If API call fails
   */
  async addRecurringTransaction(recurringTransaction: RecurringTransaction): Promise<void> {
    try {
      // Calculate next due date if not provided
      if (!recurringTransaction.nextDue) {
        recurringTransaction.nextDue = this.calculateNextDueDate(
          recurringTransaction.frequency,
          recurringTransaction.startDate,
          recurringTransaction.dayOfMonth?.toString(),
          recurringTransaction.dayOfWeek?.toString()
        );
      }
      
      const values = [
        [
          recurringTransaction.description,
          recurringTransaction.frequency,
          recurringTransaction.category || '',
          recurringTransaction.subcategory || '',
          recurringTransaction.startDate,
          recurringTransaction.amountEUR || '',
          recurringTransaction.amountUSD || '',
          recurringTransaction.account,
          recurringTransaction.notes || '',
          recurringTransaction.dayOfMonth || '',
          recurringTransaction.dayOfWeek || '',
          recurringTransaction.endDate || '',
          recurringTransaction.lastProcessed || '',
          recurringTransaction.active ? 'TRUE' : 'FALSE'
        ]
      ];
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Recurring!A2:N:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`,
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
      
      // Invalidate cache
      this.recurringTransactionsCache = null;
    } catch (error) {
      console.error('Error adding recurring transaction:', error);
      throw error;
    }
  }

  /**
   * Updates a recurring transaction's lastProcessed date and generates a real transaction
   * @async
   * @param {RecurringTransaction} recurringTransaction - The recurring transaction to process
   * @returns {Promise<void>}
   * @throws {Error} If API call fails
   */
  async processRecurringTransaction(recurringTransaction: RecurringTransaction): Promise<void> {
    if (!recurringTransaction.id) {
      throw new Error('Recurring transaction ID is required');
    }
    
    try {
      // Extract row number from the ID
      const rowMatch = recurringTransaction.id.match(/recurring-(\d+)/);
      if (!rowMatch || !rowMatch[1]) {
        throw new Error('Invalid recurring transaction ID format');
      }
      
      const rowNumber = parseInt(rowMatch[1], 10);
      const today = new Date().toISOString().split('T')[0];
      
      // 1. Create a real transaction from the template
      const transaction: Transaction = {
        date: today,
        description: recurringTransaction.description,
        category: recurringTransaction.category,
        subcategory: recurringTransaction.subcategory,
        amountEUR: recurringTransaction.amountEUR,
        amountUSD: recurringTransaction.amountUSD,
        account: recurringTransaction.account,
        notes: recurringTransaction.notes 
          ? `${recurringTransaction.notes} (Recurring: ${recurringTransaction.frequency})` 
          : `Recurring: ${recurringTransaction.frequency}`,
        recurringId: recurringTransaction.id
      };
      
      await this.addTransaction(transaction);
      
      // 2. Update the recurring transaction's lastProcessed date
      const nextDueDate = this.calculateNextDueDate(
        recurringTransaction.frequency,
        recurringTransaction.startDate,
        recurringTransaction.dayOfMonth?.toString(),
        recurringTransaction.dayOfWeek?.toString(),
        today
      );
      
      const updateResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Recurring!L${rowNumber}:M${rowNumber}?valueInputOption=USER_ENTERED&key=${this.apiKey}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [[today, nextDueDate]]
          })
        }
      );
      
      if (!updateResponse.ok) {
        throw new Error(`API error: ${updateResponse.status}`);
      }
      
      // Invalidate cache
      this.recurringTransactionsCache = null;
    } catch (error) {
      console.error('Error processing recurring transaction:', error);
      throw error;
    }
  }

  /**
   * Processes all due recurring transactions
   * @async
   * @returns {Promise<number>} Number of transactions processed
   * @throws {Error} If API call fails
   */
  async processDueRecurringTransactions(): Promise<number> {
    try {
      const recurringTransactions = await this.getRecurringTransactions();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Filter for active transactions that are due
      const dueTransactions = recurringTransactions.filter(transaction => {
        if (!transaction.active) return false;
        if (!transaction.nextDue) return false;
        
        const nextDueDate = new Date(transaction.nextDue);
        nextDueDate.setHours(0, 0, 0, 0);
        
        return nextDueDate <= today;
      });
      
      // Process each due transaction
      let processedCount = 0;
      for (const transaction of dueTransactions) {
        await this.processRecurringTransaction(transaction);
        processedCount++;
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error processing due recurring transactions:', error);
      throw error;
    }
  }

  /**
   * Toggles the active status of a recurring transaction
   * @async
   * @param {string} recurringTransactionId - The ID of the recurring transaction
   * @param {boolean} activeStatus - The new active status
   * @returns {Promise<void>}
   * @throws {Error} If API call fails
   */
  async toggleRecurringTransactionStatus(recurringTransactionId: string, activeStatus: boolean): Promise<void> {
    try {
      // Extract row number from the ID
      const rowMatch = recurringTransactionId.match(/recurring-(\d+)/);
      if (!rowMatch || !rowMatch[1]) {
        throw new Error('Invalid recurring transaction ID format');
      }
      
      const rowNumber = parseInt(rowMatch[1], 10);
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Recurring!N${rowNumber}:N${rowNumber}?valueInputOption=USER_ENTERED&key=${this.apiKey}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [[activeStatus ? 'TRUE' : 'FALSE']]
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Invalidate cache
      this.recurringTransactionsCache = null;
    } catch (error) {
      console.error('Error updating recurring transaction status:', error);
      throw error;
    }
  }

  /**
   * Invalidates the recurring transactions cache
   * Forces a refresh of recurring transaction data on next getRecurringTransactions call
   */
  invalidateRecurringTransactionsCache(): void {
    this.recurringTransactionsCache = null;
  }
}

/** 
 * Singleton instance of GoogleSheetsService
 * @const googleSheets
 */
export const googleSheets = new GoogleSheetsService();