import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';
import type { TransactionFormData, Category, Account, Subcategory } from '../../types';

interface TransactionFormProps {
  transactionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TransactionForm({ transactionId, onSuccess, onCancel }: TransactionFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category_id: '',
    subcategory_id: '',
    amount_eur: '',
    amount_usd: '',
    account_id: '',
    notes: ''
  });
  const [error, setError] = useState('');

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch subcategories based on selected category
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery<Subcategory[]>({
    queryKey: ['subcategories', formData.category_id],
    queryFn: async () => {
      if (!formData.category_id) return [];
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', formData.category_id)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!formData.category_id
  });

  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch transaction if editing
  useEffect(() => {
    async function fetchTransaction() {
      if (!transactionId) return;
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data) {
        setFormData({
          date: data.date,
          description: data.description,
          category_id: data.category_id,
          subcategory_id: data.subcategory_id || '',
          amount_eur: data.amount_eur.toString(),
          amount_usd: data.amount_usd?.toString() || '',
          account_id: data.account_id || '',
          notes: data.notes || ''
        });
      }
    }

    fetchTransaction();
  }, [transactionId]);

  const mutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      const formattedData = {
        ...data,
        amount_eur: parseFloat(data.amount_eur),
        amount_usd: data.amount_usd ? parseFloat(data.amount_usd) : null,
        subcategory_id: data.subcategory_id || null,
        account_id: data.account_id || null,
        notes: data.notes || null
      };

      if (transactionId) {
        const { error } = await supabase
          .from('transactions')
          .update(formattedData)
          .eq('id', transactionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('transactions')
          .insert([formattedData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.description || !formData.amount_eur || !formData.category_id) {
      setError('Please fill in all required fields');
      return;
    }

    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear subcategory when category changes
    if (name === 'category_id') {
      setFormData(prev => ({ ...prev, subcategory_id: '' }));
    }
  };

  if (categoriesLoading || accountsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorMessage message={error} />}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option value="">Select a category</option>
            {categories?.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Subcategory
          </label>
          <select
            id="subcategory_id"
            name="subcategory_id"
            value={formData.subcategory_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            disabled={!formData.category_id || subcategoriesLoading}
          >
            <option value="">Select a subcategory</option>
            {subcategories?.map(subcategory => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount_eur" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Amount (EUR)
          </label>
          <input
            type="number"
            id="amount_eur"
            name="amount_eur"
            value={formData.amount_eur}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label htmlFor="amount_usd" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Amount (USD)
          </label>
          <input
            type="number"
            id="amount_usd"
            name="amount_usd"
            value={formData.amount_usd}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Account
          </label>
          <select
            id="account_id"
            name="account_id"
            value={formData.account_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select an account</option>
            {accounts?.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving...' : transactionId ? 'Update Transaction' : 'Create Transaction'}
        </button>
      </div>
    </form>
  );
}