import { useState, useEffect } from 'react'
import { googleSheets } from '../lib/googleSheets'
import Skeleton from 'react-loading-skeleton'

interface CategoryData {
  categories: string[]
  subcategories: Record<string, string[]>
  allSubcategories: string[]
}

function CategoryManager() {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    categories: [],
    subcategories: {},
    allSubcategories: []
  })
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategory, setNewSubcategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: 'success' as const, visible: false })

  useEffect(() => {
    loadCategoryData()
  }, [])

  const loadCategoryData = async () => {
    setLoading(true)
    try {
      // Force refresh by invalidating cache first
      googleSheets.invalidateCategoryCache()
      const data = await googleSheets.fetchCategoryData()
      setCategoryData(data)
      
      // Set first category as active if available
      if (data.categories.length > 0 && !activeCategory) {
        setActiveCategory(data.categories[0])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      showNotification('Failed to load categories. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type, visible: true })
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }))
    }, 3000)
  }

  // This function is a mockup since we don't have a direct way to edit the Google Sheet from this app
  // In a real implementation, this would call an API to update the Settings sheet
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    
    setIsSubmitting(true)
    
    try {
      // Mockup of what would happen - normally we'd call an API to update the Google Sheet
      showNotification(
        'To add categories, please update the Settings sheet directly in Google Sheets. ' +
        'The app will reflect changes on reload.', 
        'success'
      )
      
      // Reset input
      setNewCategory('')
    } catch (error) {
      console.error('Error adding category:', error)
      showNotification('Failed to add category.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // This function is a mockup since we don't have a direct way to edit the Google Sheet from this app
  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim() || !activeCategory) return
    
    setIsSubmitting(true)
    
    try {
      // Mockup of what would happen - normally we'd call an API to update the Google Sheet
      showNotification(
        'To add subcategories, please update the Settings sheet directly in Google Sheets. ' +
        'The app will reflect changes on reload.', 
        'success'
      )
      
      // Reset input
      setNewSubcategory('')
    } catch (error) {
      console.error('Error adding subcategory:', error)
      showNotification('Failed to add subcategory.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton height={40} />
        <Skeleton height={200} />
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Categories & Subcategories</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your transaction categories and subcategories.
          </p>
          
          {/* Notification */}
          {notification.visible && (
            <div className={`mt-4 p-3 rounded-md ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {notification.message}
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Categories */}
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="text-base font-medium text-gray-900 mb-4">Categories</h4>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                <ul className="space-y-2">
                  {categoryData.categories.map(category => (
                    <li key={category}>
                      <button
                        type="button"
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeCategory === category 
                            ? 'bg-green-100 text-green-800 font-medium' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                  {categoryData.categories.length === 0 && (
                    <li className="text-gray-500 text-sm italic p-2">No categories found</li>
                  )}
                </ul>
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                  className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={isSubmitting || !newCategory.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
            
            {/* Subcategories */}
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="text-base font-medium text-gray-900 mb-4">
                {activeCategory ? `Subcategories for ${activeCategory}` : 'Subcategories'}
              </h4>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                <ul className="space-y-2">
                  {activeCategory && categoryData.subcategories[activeCategory]?.map(subcategory => (
                    <li key={subcategory} className="px-3 py-2 text-sm">
                      {subcategory}
                    </li>
                  ))}
                  {!activeCategory && (
                    <li className="text-gray-500 text-sm italic p-2">Select a category to see subcategories</li>
                  )}
                  {activeCategory && (!categoryData.subcategories[activeCategory] || categoryData.subcategories[activeCategory].length === 0) && (
                    <li className="text-gray-500 text-sm italic p-2">No subcategories found</li>
                  )}
                </ul>
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="New subcategory"
                  className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  disabled={!activeCategory}
                />
                <button
                  type="button"
                  onClick={handleAddSubcategory}
                  disabled={isSubmitting || !newSubcategory.trim() || !activeCategory}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          {/* Refresh Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={loadCategoryData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              Refresh Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryManager