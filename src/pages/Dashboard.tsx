import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { ErrorMessage } from '../components/shared/ErrorMessage'

export default function Dashboard() {
  const { data: recentTransactions, isLoading, error } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(5)

      if (error) throw error
      return data
    }
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message="Failed to load recent transactions" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h2>
        {recentTransactions && recentTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    €{transaction.amount_eur}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent transactions</p>
        )}
      </div>
    </div>
  )
}