import { useState, useEffect, FormEvent } from 'react'
import { googleSheets } from '../lib/googleSheets'
import { format } from 'date-fns'

/**
 * Transaction interface for the form data
 * @interface Transaction
 */
interface Transaction {
  id?: string
  date: string
  description: string
  category?: string
  subcategory?: string
  amountEUR?: number
  amountUSD?: number
  account: string
  notes?: string
}

/**
 * Structure for category and subcategory data
 * @interface CategoryData
 */
interface CategoryData {
  categories: string[]
  subcategories: Record<string, string[]>
  allSubcategories: string[]
}

/**
 * Props for the TransactionFormModal component
 * @interface TransactionFormModalProps
 */
interface TransactionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onTransactionAdded: () => void
  accounts: string[]
}

/**
 * Modal component for adding new transactions
 * 
 * Provides a form with input fields for all transaction data including:
 * - Date picker
 * - Description field
 * - Category and subcategory selectors
 * - Amount fields for EUR and USD
 * - Account selector
 * - Notes textarea
 * 
 * @param {TransactionFormModalProps} props - Component props
 * @returns {JSX.Element|null} Rendered modal or null when closed
 */
function TransactionFormModal({ 
  isOpen, 
  onClose, 
  onTransactionAdded,
  accounts
}: TransactionFormModalProps) {
  const [transaction, setTransaction] = useState<Transaction>({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    category: '',
    subcategory: '',
    amountEUR: undefined,
    amountUSD: undefined,
    account: accounts.length > 0 ? accounts[0] : '',
    notes: ''
  })
  const [categoryData, setCategoryData] = useState<CategoryData>({
    categories: [],
    subcategories: {},
    allSubcategories: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  // Fetch categories and subcategories when modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCategories(true)
      googleSheets.fetchCategoryData()
        .then(data => {
          setCategoryData(data)
        })
        .catch(err => {
          console.error('Error fetching categories:', err)
        })
        .finally(() => {
          setIsLoadingCategories(false)
        })
    }
  }, [isOpen])

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setTransaction({
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        category: '',
        subcategory: '',
        amountEUR: undefined,
        amountUSD: undefined,
        account: accounts.length > 0 ? accounts[0] : '',
        notes: ''
      })
      setError(null)
    }
  }, [isOpen, accounts])

  /**
   * Handles form field changes
   * - Parses numeric values for currency fields
   * - Resets subcategory when category changes
   * 
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - Change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Handle currency inputs
    if (name === 'amountEUR' || name === 'amountUSD') {
      const numericValue = value === '' ? undefined : parseFloat(value)
      setTransaction(prev => ({
        ...prev,
        [name]: numericValue
      }))
    } 
    // Clear subcategory when category changes
    else if (name === 'category') {
      setTransaction(prev => ({
        ...prev,
        category: value,
        subcategory: '' // Reset subcategory when category changes
      }))
    } 
    else {
      setTransaction(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  /**
   * Form submission handler
   * - Validates required fields
   * - Submits transaction to Google Sheets API
   * - Handles success and error states
   * 
   * @param {FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate form
    if (!transaction.date || !transaction.description || !transaction.account) {
      setError('Date, description, and account are required')
      setIsSubmitting(false)
      return
    }

    if (!transaction.amountEUR && !transaction.amountUSD) {
      setError('At least one amount (EUR or USD) is required')
      setIsSubmitting(false)
      return
    }

    try {
      await googleSheets.addTransaction(transaction)
      onTransactionAdded()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to add transaction')
      console.error('Error adding transaction:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add New Transaction
                </h3>
                
                {error && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        value={transaction.date}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                        Account *
                      </label>
                      <div className="relative mt-1">
                        <select
                          name="account"
                          id="account"
                          required
                          value={transaction.account}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          {accounts.map(account => (
                            <option key={account} value={account}>{account}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        required
                        value={transaction.description}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="E.g., Grocery shopping, Restaurant bill"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <div className="relative mt-1">
                        <select
                          name="category"
                          id="category"
                          value={transaction.category || ''}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                          disabled={isLoadingCategories}
                        >
                          <option value="">Select Category</option>
                          {isLoadingCategories ? (
                            <option value="" disabled>Loading categories...</option>
                          ) : (
                            categoryData.categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                        Subcategory
                      </label>
                      <div className="relative mt-1">
                        <select
                          name="subcategory"
                          id="subcategory"
                          value={transaction.subcategory || ''}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                          disabled={isLoadingCategories || !transaction.category}
                        >
                          <option value="">Select Subcategory</option>
                          {isLoadingCategories ? (
                            <option value="" disabled>Loading subcategories...</option>
                          ) : transaction.category ? (
                            categoryData.subcategories[transaction.category]?.map(subcategory => (
                              <option key={subcategory} value={subcategory}>{subcategory}</option>
                            ))
                          ) : null}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="amountEUR" className="block text-sm font-medium text-gray-700">
                        Amount (EUR)
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">€</span>
                        </div>
                        <input
                          type="number"
                          name="amountEUR"
                          id="amountEUR"
                          step="0.01"
                          value={transaction.amountEUR === undefined ? '' : transaction.amountEUR}
                          onChange={handleChange}
                          className="pl-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="amountUSD" className="block text-sm font-medium text-gray-700">
                        Amount (USD)
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="amountUSD"
                          id="amountUSD"
                          step="0.01"
                          value={transaction.amountUSD === undefined ? '' : transaction.amountUSD}
                          onChange={handleChange}
                          className="pl-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        value={transaction.notes || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Additional details about this transaction"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-green-300"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Transaction'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionFormModal