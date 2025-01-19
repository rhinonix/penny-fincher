import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { ErrorMessage } from '../shared/ErrorMessage';
import type { CategoryFormData } from '../../types';

interface CategoryFormProps {
  categoryId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CategoryForm({ categoryId, onSuccess, onCancel }: CategoryFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: ''
  });
  const [error, setError] = useState('');

  // Fetch category data if editing
  useEffect(() => {
    async function fetchCategory() {
      if (!categoryId) return;
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data) {
        setFormData({
          name: data.name
        });
      }
    }

    fetchCategory();
  }, [categoryId]);

  const mutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      if (categoryId) {
        const { error } = await supabase
          .from('categories')
          .update(data)
          .eq('id', categoryId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          required
        />
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
          {mutation.isPending ? 'Saving...' : categoryId ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}