import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import CategoryForm from '../../components/forms/CategoryForm';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../components/shared/ErrorMessage';
import type { Category, Subcategory } from '../../types';

export default function Categories() {
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
    const { data: categories, isLoading, error } = useQuery<Category[]>({
      queryKey: ['categories'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('categories')
          .select(`
            *,
            subcategories (
              id,
              name
            )
          `)
          .order('name');
        if (error) throw error;
        return data;
      }
    });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load categories" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h1>
        {!isAddingCategory && (
          <button
            onClick={() => setIsAddingCategory(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Category
          </button>
        )}
      </div>

      {isAddingCategory && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">New Category</h2>
          <CategoryForm
            onSuccess={() => setIsAddingCategory(false)}
            onCancel={() => setIsAddingCategory(false)}
          />
        </div>
      )}

      {editingCategoryId && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Edit Category</h2>
          <CategoryForm
            categoryId={editingCategoryId}
            onSuccess={() => setEditingCategoryId(null)}
            onCancel={() => setEditingCategoryId(null)}
          />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subcategories
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {categories?.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {category.subcategories?.map((sub: Subcategory) => sub.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingCategoryId(category.id)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}