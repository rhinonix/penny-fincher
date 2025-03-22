import { useEffect, useState } from 'react'
import { googleSheets } from '../lib/googleSheets'
import { format } from 'date-fns'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/SkeletonLoader'
import 'react-loading-skeleton/dist/skeleton.css'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

/**
 * Transaction interface for dashboard display
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
 * Dashboard page component
 * 
 * Displays financial overview including:
 * - Summary statistics (totals and averages)
 * - Category breakdown pie chart
 * - Monthly spending bar chart
 * - Recent transactions table
 * 
 * @returns {JSX.Element} The dashboard view
 */
function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalSpent: 0,
    avgTransaction: 0
  })
  
  useEffect(() => {
    /**
     * Asynchronously fetches transaction data and calculates dashboard statistics
     * @async
     */
    async function loadData() {
      try {
        const data = await googleSheets.getTransactions()
        setTransactions(data)
        
        // Calculate stats
        const totalTransactions = data.length
        let totalSpent = 0
        
        // Use EUR amount if available, otherwise USD
        data.forEach(transaction => {
          const amount = transaction.amountEUR || transaction.amountUSD || 0
          if (amount > 0) { // Only count positive amounts as expenses
            totalSpent += amount
          }
        })
        
        const avgTransaction = totalTransactions > 0 ? totalSpent / totalTransactions : 0
        
        setStats({
          totalTransactions,
          totalSpent,
          avgTransaction
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Prepare data for category pie chart
  const categoryData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  } = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#4CAF50', // Green
          '#2196F3', // Blue
          '#FFC107', // Yellow
          '#F44336', // Red
          '#9C27B0', // Purple
          '#FF9800', // Orange
          '#795548', // Brown
          '#607D8B', // Blue Grey
        ],
        borderWidth: 1,
      },
    ],
  }
  
  // Calculate category totals for pie chart
  const categoryTotals: Record<string, number> = {}
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
  
  // Add data to category chart
  Object.keys(categoryTotals).forEach(category => {
    categoryData.labels.push(category)
    categoryData.datasets[0].data.push(categoryTotals[category])
  })
  
  // Prepare monthly spending data
  const monthlyData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  } = {
    labels: [],
    datasets: [
      {
        label: 'Monthly Spending',
        data: [],
        backgroundColor: '#4CAF50',
      },
    ],
  }
  
  // Calculate monthly totals
  const monthlyTotals: Record<string, number> = {}
  transactions.forEach(transaction => {
    try {
      const date = new Date(transaction.date)
      const monthYear = format(date, 'MMM yyyy')
      const amount = transaction.amountEUR || transaction.amountUSD || 0
      
      if (amount > 0) { // Only count expenses
        if (monthlyTotals[monthYear]) {
          monthlyTotals[monthYear] += amount
        } else {
          monthlyTotals[monthYear] = amount
        }
      }
    } catch (e) {
      // Skip entries with invalid dates
    }
  })
  
  // Sort months chronologically and add to chart data
  const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => {
    return new Date(a) < new Date(b) ? -1 : 1
  })
  
  sortedMonths.forEach(month => {
    monthlyData.labels.push(month)
    monthlyData.datasets[0].data.push(monthlyTotals[month])
  })
  
  // Get recent transactions for dashboard
  const recentTransactions = transactions.slice(0, 5)
  
  // Format currency
  /**
   * Formats a number as a currency string
   * @param {number|undefined} amount - Amount to format
   * @returns {string} Formatted currency string or empty string if undefined
   */
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
        <CardSkeleton count={3} />
        <ChartSkeleton count={2} />
        <TableSkeleton />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Total Transactions</h2>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h2>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Avg. Transaction</h2>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.avgTransaction)}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h2>
          <div className="h-80">
            <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Spending</h2>
          <div className="h-80">
            <Bar 
              data={monthlyData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => {
                // Use EUR amount if available, otherwise USD
                const amount = transaction.amountEUR !== undefined ? transaction.amountEUR : transaction.amountUSD
                const currency = transaction.amountEUR !== undefined ? 'EUR' : 'USD'
                
                return (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {amount !== undefined ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency,
                      }).format(amount) : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.account}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard