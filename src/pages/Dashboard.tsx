import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ErrorMessage } from '../components/shared/ErrorMessage';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount_eur: number;
  category: { name: string } | null;
  subcategory: { name: string } | null;
  account: { name: string } | null;
}

export default function Dashboard() {
  // Fetch recent transactions
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:category_id(name),
          subcategory:subcategory_id(name),
          account:account_id(name)
        `)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Transaction[];
    }
  });

  // Format currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error loading recent transactions" />;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()} • {' '}
                      {transaction.category?.name}
                      {transaction.subcategory?.name && ` → ${transaction.subcategory.name}`}
                      {transaction.account?.name && ` • ${transaction.account.name}`}
                    </p>
                  </div>
                  <span className={`font-medium ${
                    transaction.amount_eur >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatAmount(transaction.amount_eur)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent transactions found.</p>
        )}
      </div>

      {/* We can add more dashboard widgets here later */}
      {/* For example: Monthly summary, Category breakdown, etc. */}
    </div>
  );
}