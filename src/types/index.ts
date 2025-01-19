export interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
    subcategories?: Subcategory[];
  }
  
  export interface Subcategory {
    id: string;
    name: string;
    category_id: string;
    user_id: string;
    created_at: string;
  }
  
  export interface Account {
    id: string;
    name: string;
    currency: string;
    user_id: string;
    created_at: string;
  }
  
  export interface Transaction {
    id: string;
    date: string;
    description: string;
    category_id: string;
    subcategory_id?: string;
    amount_eur: number;
    amount_usd?: number;
    account_id?: string;
    notes?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    // Include related data
    categories?: Category;
    subcategories?: Subcategory;
    accounts?: Account;
  }
  
  export interface RecurringTransaction {
    id: string;
    payment_date: string;
    description: string;
    category_id: string;
    subcategory_id?: string;
    amount_eur: number;
    amount_usd?: number;
    account_id?: string;
    notes?: string;
    variable: boolean;
    user_id: string;
    created_at: string;
    // Include related data
    categories?: Category;
    subcategories?: Subcategory;
    accounts?: Account;
  }
  
  // Form Data types
  export interface TransactionFormData {
    date: string;
    description: string;
    category_id: string;
    subcategory_id: string;
    amount_eur: string;
    amount_usd: string;
    account_id: string;
    notes: string;
  }
  
  export interface CategoryFormData {
    name: string;
  }
  
  export interface AccountFormData {
    name: string;
    currency: string;
  }