import { useState, useEffect, FormEvent } from 'react'
import { googleSheets, RecurringTransaction, CategoryData } from '../lib/googleSheets'
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns'

/**
 * Props for the RecurringTransactionFormModal component
 * @interface RecurringTransactionFormModalProps
 */
interface RecurringTransactionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onTransactionAdded: () => void
  accounts: string[]
}

/**
 * Modal component for adding new recurring transactions
 * 
 * Provides a form with input fields for all recurring transaction data including:
 * - Description field
 * - Category and subcategory selectors
 * - Frequency selector with appropriate date pickers
 * - Amount fields for EUR and USD
 * - Account selector
 * - Notes textarea
 * 
 * @param {RecurringTransactionFormModalProps} props - Component props
 * @returns {JSX.Element|null} Rendered modal or null when closed
 */
function RecurringTransactionFormModal({ 
  isOpen, 
  onClose, 
  onTransactionAdded,
  accounts
}: RecurringTransactionFormModalProps) {
  const [recurringTransaction, setRecurringTransaction] = useState<RecurringTransaction>({
    description: '',
    category: '',
    subcategory: '',
    amountEUR: undefined,
    amountUSD: undefined,
    account: accounts.length > 0 ? accounts[0] : '',
    notes: '',
    frequency: 'monthly',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    dayOfMonth: new Date().getDate(),
    active: true
  })
  const [categoryData, setCategoryData] = useState<CategoryData>({
    categories: [],
    subcategories: {},
    allSubcategories: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [previewDates, setPreviewDates] = useState<string[]>([])

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
      const today = new Date()
      setRecurringTransaction({
        description: '',
        category: '',
        subcategory: '',
        amountEUR: undefined,
        amountUSD: undefined,
        account: accounts.length > 0 ? accounts[0] : '',
        notes: '',
        frequency: 'monthly',
        startDate: format(today, 'yyyy-MM-dd'),
        dayOfMonth: today.getDate(),
        active: true
      })
      setError(null)
    }
  }, [isOpen, accounts])

  // Generate preview dates when frequency or start date changes
  useEffect(() => {
    generatePreviewDates()
  }, [
    recurringTransaction.frequency, 
    recurringTransaction.startDate, 
    recurringTransaction.dayOfMonth, 
    recurringTransaction.dayOfWeek
  ])

  /**
   * Generates preview dates for the recurring transaction
   * Shows the next 5 occurrences based on the current settings
   */
  const generatePreviewDates = () => {
    try {
      const { frequency, startDate, dayOfMonth, dayOfWeek } = recurringTransaction
      const dates: string[] = []
      let baseDate = new Date(startDate)
      
      // Validate base date
      if (baseDate.toString() === 'Invalid Date') {
        setPreviewDates([])
        return
      }

      // Generate the next 5 occurrences
      for (let i = 0; i < 5; i++) {
        let nextDate: Date
        
        switch (frequency) {
          case 'daily':
            nextDate = i === 0 ? baseDate : addDays(dates[i - 1], 1)
            break
            
          case 'weekly':
            if (i === 0) {
              nextDate = baseDate
              // Adjust to the correct day of week if specified
              if (dayOfWeek !== undefined) {
                const currentDay = nextDate.getDay()
                const daysToAdd = (dayOfWeek - currentDay + 7) % 7
                nextDate = addDays(nextDate, daysToAdd)
              }
            } else {
              nextDate = addWeeks(dates[i - 1], 1)
            }
            break
            
          case 'biweekly':
            if (i === 0) {
              nextDate = baseDate
              // Adjust to the correct day of week if specified
              if (dayOfWeek !== undefined) {
                const currentDay = nextDate.getDay()
                const daysToAdd = (dayOfWeek - currentDay + 7) % 7
                nextDate = addDays(nextDate, daysToAdd)
              }
            } else {
              nextDate = addWeeks(dates[i - 1], 2)
            }
            break
            
          case 'monthly':
            if (i === 0) {
              nextDate = baseDate
              // Adjust to the correct day of month if specified
              if (dayOfMonth !== undefined) {
                nextDate.setDate(Math.min(
                  dayOfMonth, 
                  new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()
                ))
              }
            } else {
              nextDate = addMonths(dates[i - 1], 1)
              // Ensure the correct day of the month
              if (dayOfMonth !== undefined) {
                const lastDayOfMonth = new Date(
                  nextDate.getFullYear(), 
                  nextDate.getMonth() + 1, 
                  0
                ).getDate()
                nextDate.setDate(Math.min(dayOfMonth, lastDayOfMonth))
              }
            }
            break
            
          case 'quarterly':
            if (i === 0) {
              nextDate = baseDate
              // Adjust to the correct day of month if specified
              if (dayOfMonth !== undefined) {
                nextDate.setDate(Math.min(
                  dayOfMonth, 
                  new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()
                ))
              }
            } else {
              nextDate = addMonths(dates[i - 1], 3)
              // Ensure the correct day of the month
              if (dayOfMonth !== undefined) {
                const lastDayOfMonth = new Date(
                  nextDate.getFullYear(), 
                  nextDate.getMonth() + 1, 
                  0
                ).getDate()
                nextDate.setDate(Math.min(dayOfMonth, lastDayOfMonth))
              }
            }
            break
            
          case 'yearly':
            if (i === 0) {
              nextDate = baseDate
              // Adjust to the correct day of month if specified
              if (dayOfMonth !== undefined) {
                nextDate.setDate(Math.min(
                  dayOfMonth, 
                  new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()
                ))
              }
            } else {
              nextDate = addYears(dates[i - 1], 1)
              // Ensure the correct day of the month
              if (dayOfMonth !== undefined) {
                const lastDayOfMonth = new Date(
                  nextDate.getFullYear(), 
                  nextDate.getMonth() + 1, 
                  0
                ).getDate()
                nextDate.setDate(Math.min(dayOfMonth, lastDayOfMonth))
              }
            }
            break
            
          default:
            // Default to monthly
            nextDate = i === 0 ? baseDate : addMonths(dates[i - 1], 1)
        }
        
        dates.push(format(nextDate, 'yyyy-MM-dd'))
      }
      
      setPreviewDates(dates)
    } catch (error) {
      console.error('Error generating preview dates:', error)
      setPreviewDates([])
    }
  }

  /**
   * Handles form field changes
   * - Parses numeric values for currency fields
   * - Resets subcategory when category changes
   * - Updates frequency-specific fields
   * 
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - Change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Handle currency inputs
    if (name === 'amountEUR' || name === 'amountUSD') {
      const numericValue = value === '' ? undefined : parseFloat(value)
      setRecurringTransaction(prev => ({
        ...prev,
        [name]: numericValue
      }))
    } 
    // Handle numeric inputs
    else if (name === 'dayOfMonth' || name === 'dayOfWeek') {
      const numericValue = value === '' ? undefined : parseInt(value, 10)
      setRecurringTransaction(prev => ({
        ...prev,
        [name]: numericValue
      }))
    }
    // Clear subcategory when category changes
    else if (name === 'category') {
      setRecurringTransaction(prev => ({
        ...prev,
        category: value,
        subcategory: '' // Reset subcategory when category changes
      }))
    } 
    // Handle frequency changes
    else if (name === 'frequency') {
      // Reset day-related fields when frequency changes
      setRecurringTransaction(prev => {
        const newState = {
          ...prev,
          frequency: value as RecurringTransaction['frequency'],
          dayOfMonth: undefined,
          dayOfWeek: undefined
        }
        
        // Set appropriate defaults based on frequency
        if (value === 'monthly' || value === 'quarterly' || value === 'yearly') {
          newState.dayOfMonth = new Date().getDate()
        } else if (value === 'weekly' || value === 'biweekly') {
          newState.dayOfWeek = new Date().getDay()
        }
        
        return newState
      })
    }
    else {
      setRecurringTransaction(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  /**
   * Form submission handler
   * - Validates required fields
   * - Submits recurring transaction to Google Sheets API
   * - Handles success and error states
   * 
   * @param {FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate form
    if (!recurringTransaction.description || !recurringTransaction.account || !recurringTransaction.startDate) {
      setError('Description, account, and start date are required')
      setIsSubmitting(false)
      return
    }

    if (!recurringTransaction.amountEUR && !recurringTransaction.amountUSD) {
      setError('At least one amount (EUR or USD) is required')
      setIsSubmitting(false)
      return
    }

    // Validate frequency-specific fields
    if ((recurringTransaction.frequency === 'monthly' || 
         recurringTransaction.frequency === 'quarterly' || 
         recurringTransaction.frequency === 'yearly') && 
        recurringTransaction.dayOfMonth === undefined) {
      setError('Day of month is required for monthly, quarterly, and yearly frequencies')
      setIsSubmitting(false)
      return
    }

    if ((recurringTransaction.frequency === 'weekly' || 
         recurringTransaction.frequency === 'biweekly') && 
        recurringTransaction.dayOfWeek === undefined) {
      setError('Day of week is required for weekly and biweekly frequencies')
      setIsSubmitting(false)
      return
    }

    try {
      await googleSheets.addRecurringTransaction(recurringTransaction)
      onTransactionAdded()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to add recurring transaction')
      console.error('Error adding recurring transaction:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Helper to format date for display
  const formatDateForDisplay = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch (e) {
      return dateString
    }
  }

  // Get appropriate day input based on frequency
  const renderDayInput = () => {
    const { frequency } = recurringTransaction
    
    if (frequency === 'daily') {
      return null // No day input needed for daily frequency
    }
    
    if (frequency === 'weekly' || frequency === 'biweekly') {
      return (
        <div>
          <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
            Day of Week
          </label>
          <div className="relative mt-1">
            <select
              name="dayOfWeek"
              id="dayOfWeek"
              value={recurringTransaction.dayOfWeek === undefined ? '' : recurringTransaction.dayOfWeek}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )
    }
    
    if (frequency === 'monthly' || frequency === 'quarterly' || frequency === 'yearly') {
      // Create options for days 1-31
      const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
      
      return (
        <div>
          <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-700">
            Day of Month
          </label>
          <div className="relative mt-1">
            <select
              name="dayOfMonth"
              id="dayOfMonth"
              value={recurringTransaction.dayOfMonth === undefined ? '' : recurringTransaction.dayOfMonth}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {dayOptions.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )
    }
    
    return null
  }

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
                  Add Recurring Transaction
                </h3>
                
                {error && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        required
                        value={recurringTransaction.description}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="E.g., Monthly Rent, Netflix Subscription"
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
                          value={recurringTransaction.account}
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
                    
                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                        Frequency *
                      </label>
                      <div className="relative mt-1">
                        <select
                          name="frequency"
                          id="frequency"
                          required
                          value={recurringTransaction.frequency}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Biweekly (Every 2 weeks)</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        required
                        value={recurringTransaction.startDate}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    {renderDayInput()}
                    
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={recurringTransaction.endDate || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                          value={recurringTransaction.category || ''}
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
                          value={recurringTransaction.subcategory || ''}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                          disabled={isLoadingCategories || !recurringTransaction.category}
                        >
                          <option value="">Select Subcategory</option>
                          {isLoadingCategories ? (
                            <option value="" disabled>Loading subcategories...</option>
                          ) : recurringTransaction.category ? (
                            categoryData.subcategories[recurringTransaction.category]?.map(subcategory => (
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
                          value={recurringTransaction.amountEUR === undefined ? '' : recurringTransaction.amountEUR}
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
                          value={recurringTransaction.amountUSD === undefined ? '' : recurringTransaction.amountUSD}
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
                        value={recurringTransaction.notes || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Additional details about this recurring transaction"
                      ></textarea>
                    </div>
                    
                    {/* Preview section */}
                    {previewDates.length > 0 && (
                      <div className="sm:col-span-2 bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Next {previewDates.length} occurrences:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {previewDates.map((date, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-800 rounded-full text-xs mr-2">
                                {index + 1}
                              </span>
                              {formatDateForDisplay(date)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-green-300"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Recurring Transaction'}
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

export default RecurringTransactionFormModal