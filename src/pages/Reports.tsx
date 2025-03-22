import { useEffect, useState } from 'react'
import { googleSheets } from '../lib/googleSheets'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/SkeletonLoader'
import 'react-loading-skeleton/dist/skeleton.css'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)

/**
 * Transaction interface for reports
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
 * Spending reports page component
 * 
 * Features:
 * - Displays spending summary for selected time period (3, 6, or 12 months)
 * - Shows spending breakdown by category in a pie chart
 * - Displays monthly spending trends in a line chart
 * - Lists top spending categories with percentages
 * 
 * @returns {JSX.Element} The reports page
 */
function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [periodFilter, setPeriodFilter] = useState('6months')
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 1,
      },
    ],
  })
  const [trendData, setTrendData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Monthly Spending',
        data: [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  })
  
  useEffect(() => {
    /**
     * Loads transaction data from Google Sheets
     * @async
     */
    async function loadData() {
      try {
        const data = await googleSheets.getTransactions()
        setTransactions(data)
      } catch (error) {
        console.error('Error loading reports data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Update charts when transactions or period filter changes
  useEffect(() => {
    if (transactions.length === 0) return
    
    // Filter transactions based on selected period
    const filteredTransactions = filterTransactionsByPeriod(transactions, periodFilter)
    
    // Prepare category data
    prepareCategoryData(filteredTransactions)
    
    // Prepare trend data
    prepareTrendData(filteredTransactions)
    
  }, [transactions, periodFilter])
  
  // Filter transactions by selected time period
  /**
   * Filters transactions to a specific time period
   * @param {Transaction[]} transactions - The transactions to filter
   * @param {string} period - Time period to filter by (3months, 6months, 12months)
   * @returns {Transaction[]} Filtered transactions
   */
  const filterTransactionsByPeriod = (transactions: Transaction[], period: string) => {
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case '3months':
        startDate = subMonths(now, 3)
        break
      case '6months':
        startDate = subMonths(now, 6)
        break
      case '12months':
        startDate = subMonths(now, 12)
        break
      default:
        startDate = subMonths(now, 6) // Default to 6 months
    }
    
    return transactions.filter(transaction => {
      try {
        const txDate = new Date(transaction.date)
        return txDate >= startDate && txDate <= now
      } catch (e) {
        return false
      }
    })
  }
  
  // Prepare data for category pie chart
  /**
   * Prepares data for the category pie chart
   * - Calculates spending by category
   * - Groups small categories as "Other"
   * - Assigns colors to each category
   * 
   * @param {Transaction[]} transactions - The transactions to analyze
   */
  const prepareCategoryData = (transactions: Transaction[]) => {
    const categoryTotals = {}
    const colors = [
      '#4CAF50', // Green
      '#2196F3', // Blue
      '#FFC107', // Yellow
      '#F44336', // Red
      '#9C27B0', // Purple
      '#FF9800', // Orange
      '#795548', // Brown
      '#607D8B', // Blue Grey
      '#E91E63', // Pink
      '#00BCD4', // Cyan
    ]
    
    transactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized'
      const amount = transaction.amountEUR || transaction.amountUSD || 0
      
      if (amount > 0) { // Only count expenses
        if (categoryTotals[category]) {
          categoryTotals[category] += amount
        } else {
          categoryTotals[category] = amount
        }
      }
    })
    
    // Sort categories by total amount (descending)
    const sortedCategories = Object.keys(categoryTotals).sort((a, b) => {
      return categoryTotals[b] - categoryTotals[a]
    })
    
    // Take top 9 categories and group the rest as "Other"
    const topCategories = sortedCategories.slice(0, 9)
    let otherTotal = 0
    
    sortedCategories.slice(9).forEach(category => {
      otherTotal += categoryTotals[category]
    })
    
    const chartLabels = [...topCategories]
    const chartData = topCategories.map(category => categoryTotals[category])
    const chartColors = topCategories.map((_, index) => colors[index % colors.length])
    
    // Add "Other" category if there are more than 9 categories
    if (otherTotal > 0) {
      chartLabels.push('Other')
      chartData.push(otherTotal)
      chartColors.push('#9E9E9E') // Grey for "Other"
    }
    
    setCategoryData({
      labels: chartLabels,
      datasets: [
        {
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: 1,
        },
      ],
    })
  }
  
  // Prepare data for monthly trend line chart
  /**
   * Prepares data for the monthly spending trend chart
   * - Calculates spending by month for the selected period
   * - Formats dates for display
   * 
   * @param {Transaction[]} transactions - The transactions to analyze
   */
  const prepareTrendData = (transactions: Transaction[]) => {
    const monthlyTotals = {}
    const now = new Date()
    
    // Initialize all months in the selected period
    let numMonths: number
    switch (periodFilter) {
      case '3months':
        numMonths = 3
        break
      case '12months':
        numMonths = 12
        break
      default:
        numMonths = 6 // Default to 6 months
    }
    
    for (let i = 0; i < numMonths; i++) {
      const monthDate = subMonths(now, i)
      const monthKey = format(monthDate, 'yyyy-MM')
      monthlyTotals[monthKey] = 0
    }
    
    // Calculate totals for each month
    transactions.forEach(transaction => {
      try {
        const txDate = new Date(transaction.date)
        const monthKey = format(txDate, 'yyyy-MM')
        const amount = transaction.amountEUR || transaction.amountUSD || 0
        
        if (amount > 0 && monthlyTotals[monthKey] !== undefined) {
          monthlyTotals[monthKey] += amount
        }
      } catch (e) {
        // Skip entries with invalid dates
      }
    })
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyTotals).sort()
    const sortedTotals = sortedMonths.map(month => monthlyTotals[month])
    
    // Format month labels for display
    const formattedLabels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-')
      return format(new Date(parseInt(year), parseInt(monthNum) - 1, 1), 'MMM yyyy')
    })
    
    setTrendData({
      labels: formattedLabels,
      datasets: [
        {
          label: 'Monthly Spending',
          data: sortedTotals,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.1,
          fill: true,
        },
      ],
    })
  }
  
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
   * Gets a readable label for the selected time period
   * @returns {string} Human-readable period label
   */
  const getPeriodLabel = () => {
    switch (periodFilter) {
      case '3months': return 'Last 3 Months'
      case '6months': return 'Last 6 Months'
      case '12months': return 'Last 12 Months'
      default: return 'Last 6 Months'
    }
  }
  
  // Calculate total spent in the period
  /**
   * Calculates the total amount spent in the selected period
   * @returns {number} Total amount spent
   */
  const calculateTotalSpent = () => {
    const filteredTransactions = filterTransactionsByPeriod(transactions, periodFilter)
    return filteredTransactions.reduce((total, transaction) => {
      const amount = transaction.amountEUR || transaction.amountUSD || 0
      return total + (amount > 0 ? amount : 0)
    }, 0)
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Spending Reports</h1>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900">Spending Summary</h2>
        </div>
        <CardSkeleton count={1} />
        <ChartSkeleton count={2} />
        <TableSkeleton />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Spending Reports</h1>
      
      {/* Period Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Spending Summary</h2>
        <div className="relative ml-2">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Spent ({getPeriodLabel()})</h3>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculateTotalSpent())}</p>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h2>
          <div className="h-80">
            <Pie 
              data={categoryData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.raw as number;
                        return `${context.label}: ${formatCurrency(value)}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Spending Trend</h2>
          <div className="h-80">
            <Line 
              data={trendData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => formatCurrency(value as number),
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.raw as number;
                        return `${context.dataset.label}: ${formatCurrency(value)}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Top Spending Categories */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Top Spending Categories</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categoryData.labels.map((category, index) => {
              const amount = categoryData.datasets[0].data[index] as number
              const totalSpent = calculateTotalSpent()
              const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0
              
              return (
                <tr key={category}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {percentage.toFixed(1)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports