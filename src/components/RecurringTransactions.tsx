import { useState, useEffect } from 'react'
import { googleSheets, RecurringTransaction } from '../lib/googleSheets'
import { format } from 'date-fns'
import RecurringTransactionFormModal from './RecurringTransactionFormModal'
import Notification from './Notification'

/**
 * Props for the RecurringTransactions component
 * @interface RecurringTransactionsProps
 */
interface RecurringTransactionsProps {
  accounts: string[]
  onProcessDue: () => void
}

/**
 * Component for displaying and managing recurring transactions
 * 
 * Features:
 * - Displays all recurring transactions in a table
 * - Allows adding new recurring transactions through a modal form
 * - Allows processing due recurring transactions
 * - Shows success/error notifications
 * 
 * @param {RecurringTransactionsProps} props - Component props
 * @returns {JSX.Element} The recurring transactions component
 */
function RecurringTransactions({ accounts, onProcessDue }: RecurringTransactionsProps) {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as const,
    isVisible: false
  })
  const [processingDue, setProcessingDue] = useState(false)

  /**
   * Loads recurring transaction data
   * @async
   */
  const loadData = async () => {
    try {
      setLoading(true)
      const data = await googleSheets.getRecurringTransactions()
      setRecurringTransactions(data)
    } catch (error) {
      console.error('Error loading recurring transactions:', error)
      setNotification({
        message: 'Failed to load recurring transactions',
        type: 'error',
        isVisible: true
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles the event when a new recurring transaction is added
   * Reloads data and shows a success notification
   * @async
   */
  const handleTransactionAdded = async () => {
    try {
      await loadData()
      setNotification({
        message: 'Recurring transaction added successfully!',
        type: 'success',
        isVisible: true
      })
    } catch (error) {
      setNotification({
        message: 'Failed to refresh recurring transactions. Please try again.',
        type: 'error',
        isVisible: true
      })
    }
  }

  /**
   * Processes due recurring transactions
   * @async
   */
  const handleProcessDue = async () => {
    try {
      setProcessingDue(true)
      const count = await googleSheets.processDueRecurringTransactions()
      setNotification({
        message: `Processed ${count} due recurring transactions`,
        type: 'success',
        isVisible: true
      })
      await loadData()
      onProcessDue()
    } catch (error) {
      console.error('Error processing due recurring transactions:', error)
      setNotification({
        message: 'Failed to process due recurring transactions',
        type: 'error',
        isVisible: true
      })
    } finally {
      setProcessingDue(false)
    }
  }

  /**
   * Toggles the active status of a recurring transaction
   * @async
   * @param {string} id - ID of the recurring transaction
   * @param {boolean} currentStatus - Current active status
   */
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await googleSheets.toggleRecurringTransactionStatus(id, !currentStatus)
      await loadData()
      setNotification({
        message: `Recurring transaction ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        type: 'success',
        isVisible: true
      })
    } catch (error) {
      console.error('Error toggling recurring transaction status:', error)
      setNotification({
        message: 'Failed to update recurring transaction status',
        type: 'error',
        isVisible: true
      })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy')
    } catch (e) {
      return dateString // If parsing fails, return the original string
    }
  }

  // Format currency
  const formatCurrency = (amount: number | undefined, currency: string) => {
    if (amount === undefined) return ''
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Get human-readable frequency
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily'
      case 'weekly': return 'Weekly'
      case 'biweekly': return 'Biweekly'
      case 'monthly': return 'Monthly'
      case 'quarterly': return 'Quarterly'
      case 'yearly': return 'Yearly'
      default: return frequency
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recurring Transactions</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleProcessDue}
            disabled={processingDue}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {processingDue ? 'Processing...' : 'Process Due Transactions'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Recurring Transaction
          </button>
        </div>
      </div>
      
      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
      
      {/* Recurring Transaction Form Modal */}
      <RecurringTransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
        accounts={accounts}
      />
      
      {/* Recurring Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (EUR)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (USD)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    Loading recurring transactions...
                  </td>
                </tr>
              ) : recurringTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No recurring transactions found. Add your first recurring transaction!
                  </td>
                </tr>
              ) : (
                recurringTransactions.map((transaction) => (
                  <tr key={transaction.id} className={!transaction.active ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getFrequencyLabel(transaction.frequency)}
                      {transaction.frequency === 'monthly' && transaction.dayOfMonth ? 
                        ` (Day ${transaction.dayOfMonth})` : ''}
                      {(transaction.frequency === 'weekly' || transaction.frequency === 'biweekly') && 
                       transaction.dayOfWeek !== undefined ? 
                        ` (${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][transaction.dayOfWeek]})` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.nextDue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.amountEUR, 'EUR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.amountUSD, 'USD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category || '-'}
                      {transaction.subcategory ? ` / ${transaction.subcategory}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.account}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleToggleActive(transaction.id || '', transaction.active)}
                        className={`text-sm px-2 py-1 rounded ${
                          transaction.active 
                            ? 'text-gray-700 hover:bg-gray-100' 
                            : 'text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {transaction.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            {loading ? 'Loading...' : `Showing ${recurringTransactions.length} recurring transactions`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RecurringTransactions