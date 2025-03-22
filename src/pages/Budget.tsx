import { useEffect, useState } from 'react'
import { googleSheets } from '../lib/googleSheets'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/SkeletonLoader'
import 'react-loading-skeleton/dist/skeleton.css'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

/**
 * Transaction interface for budget calculations
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
 * Budget data structure for a single category
 * @interface BudgetItem
 */
interface BudgetItem {
  category: string
  budgeted: number
  spent: number
  remaining: number
  percentUsed: number
}

/**
 * Sample budget data by category
 * @constant
 * @type {Record<string, number>}
 * @description Placeholder budget data. In a real app, this would be fetched from an API or database.
 */
const SAMPLE_BUDGETS = {
  'Food & Dining': 500,
  'Shopping': 300,
  'Housing': 1200,
  'Transportation': 200,
  'Entertainment': 150,
  'Health & Fitness': 100,
  'Travel': 200,
  'Utilities': 250,
}

/**
 * Budget management page component
 * 
 * Features:
 * - Displays monthly budget vs. actual spending
 * - Shows summary statistics (total budgeted, spent, remaining)
 * - Visualizes budget vs. actual with bar chart
 * - Lists all budget categories with progress bars
 * 
 * Note: Currently uses sample budget data. In a production app,
 * this would be fetched from a database or API.
 * 
 * @returns {JSX.Element} The budget page
 */
function Budget() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [totalBudgeted, setTotalBudgeted] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  
  useEffect(() => {
    /**
     * Loads transaction data and calculates budget statistics
     * - Filters transactions to current month
     * - Calculates spending by category
     * - Combines with budget data
     * @async
     */
    async function loadData() {
      try {
        // Get current month's transactions
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        
        const data = await googleSheets.getTransactions()
        
        // Filter to current month's transactions
        const thisMonthTransactions = data.filter(transaction => {
          try {
            const txDate = new Date(transaction.date)
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
          } catch (e) {
            return false
          }
        })
        
        setTransactions(thisMonthTransactions)
        
        // Calculate spending by category
        const spendingByCategory = {}
        thisMonthTransactions.forEach(transaction => {
          const category = transaction.category || 'Uncategorized'
          const amount = transaction.amountEUR || transaction.amountUSD || 0
          
          if (amount > 0) { // Only count expenses
            if (spendingByCategory[category]) {
              spendingByCategory[category] += amount
            } else {
              spendingByCategory[category] = amount
            }
          }
        })
        
        // Combine budget data with actual spending
        const budgetData: BudgetItem[] = []
        let budgetTotal = 0
        let spentTotal = 0
        
        Object.keys(SAMPLE_BUDGETS).forEach(category => {
          const budgeted = SAMPLE_BUDGETS[category]
          const spent = spendingByCategory[category] || 0
          const remaining = budgeted - spent
          const percentUsed = budgeted > 0 ? (spent / budgeted) * 100 : 0
          
          budgetData.push({
            category,
            budgeted,
            spent,
            remaining,
            percentUsed
          })
          
          budgetTotal += budgeted
          spentTotal += spent
        })
        
        // Add categories that have spending but no budget
        Object.keys(spendingByCategory).forEach(category => {
          if (!SAMPLE_BUDGETS[category]) {
            const spent = spendingByCategory[category]
            
            budgetData.push({
              category,
              budgeted: 0,
              spent,
              remaining: -spent,
              percentUsed: 100
            })
            
            spentTotal += spent
          }
        })
        
        // Sort by category name
        budgetData.sort((a, b) => a.category.localeCompare(b.category))
        
        setBudgetItems(budgetData)
        setTotalBudgeted(budgetTotal)
        setTotalSpent(spentTotal)
      } catch (error) {
        console.error('Error loading budget data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Format currency
  /**
   * Formats a number as a currency string in EUR
   * @param {number} amount - The amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount)
  }
  
  /**
   * Chart configuration data for budget vs. actual comparison
   * @type {Object}
   */
  const chartData = {
    labels: budgetItems.map(item => item.category),
    datasets: [
      {
        label: 'Budgeted',
        data: budgetItems.map(item => item.budgeted),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Spent',
        data: budgetItems.map(item => item.spent),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  }
  
  /**
   * Chart display options for the budget chart
   * Includes formatting for currency values in tooltips and axes
   * @type {Object}
   */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Budget</h1>
        <CardSkeleton count={3} />
        <ChartSkeleton count={1} />
        <TableSkeleton />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Budget</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Total Budgeted</h2>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalBudgeted)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h2>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Remaining</h2>
          <p className={`text-3xl font-bold ${totalBudgeted - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalBudgeted - totalSpent)}
          </p>
        </div>
      </div>
      
      {/* Budget vs. Actual Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Budget vs. Actual</h2>
        <div className="h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* Budget Details Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budgeted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {budgetItems.map((item) => (
              <tr key={item.category}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.budgeted)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.spent)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(item.remaining)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${item.percentUsed > 100 ? 'bg-red-600' : item.percentUsed > 75 ? 'bg-yellow-400' : 'bg-green-600'}`} 
                      style={{ width: `${Math.min(item.percentUsed, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 inline-block">
                    {item.percentUsed.toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Budget