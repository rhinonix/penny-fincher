import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { readFile } from 'fs/promises';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Transaction {
  Date: string;
  Description: string;
  Category: string;
  Subcategory: string;
  'Amount EUR': string;
  'Amount USD': string | null;
  Account: string | null;
  Notes: string | null;
}

interface Setting {
  Categories: string;
  Subcategories: string | null;
  Accounts: string;
}

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Read CSV files
    console.log('Reading CSV files...');
    const settingsData = await readFile('Household Expenses  Settings.csv', 'utf-8');
    const transactionsData = await readFile('Household Expenses  Transactions.csv', 'utf-8');

    // Parse CSV files
    console.log('Parsing CSV files...');
    const settings = Papa.parse(settingsData, { header: true }).data as Setting[];
    const transactions = Papa.parse(transactionsData, { header: true }).data as Transaction[];

    console.log(`Found ${settings.length} settings entries and ${transactions.length} transactions`);

    // Rest of the migration logic...
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate().catch(console.error);