import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import CategoryManager from '../components/CategoryManager'
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * Settings page component
 * 
 * Features:
 * - Multiple settings tabs (general, account, data, about)
 * - User preferences for currency, date format, and theme
 * - Google Sheets connection management
 * - Category management via CategoryManager component
 * - Data import/export options
 * - Application information
 * 
 * @returns {JSX.Element} The settings page
 */
function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [currency, setCurrency] = useState('EUR')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  const [theme, setTheme] = useState('light')
  const [loading, setLoading] = useState(false)
  
  /**
   * Handles the form submission for general settings
   * Currently simulates an API call with a setTimeout
   * 
   * @param {React.FormEvent} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Here you would save the settings to your backend or local storage
      console.log('Settings saved:', { currency, dateFormat, theme })
      alert('Settings saved successfully!')
      setLoading(false)
    }, 1000)
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'account' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'data' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Data
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'about' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              About
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Currency
                  </label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <div className="relative mt-1">
                      <select
                        id="currency"
                        name="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                        disabled={loading}
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <div className="relative mt-1">
                      <select
                        id="dateFormat"
                        name="dateFormat"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                        disabled={loading}
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <div className="relative mt-1">
                      <select
                        id="theme"
                        name="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                        disabled={loading}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Google Sheets Connection</h3>
                <p className="mt-1 text-sm text-gray-500">
                  PennyFincher is currently connected to your Google Sheets document.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Reconnect to Google Sheets
                  </button>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Account Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your personal preferences for this application.
                </p>
                
                <div className="mt-4 flex flex-col space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email notifications</label>
                      <p className="text-gray-500">Get notified when your spending exceeds your budget.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="monthlyReports"
                        name="monthlyReports"
                        type="checkbox"
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="monthlyReports" className="font-medium text-gray-700">Monthly reports</label>
                      <p className="text-gray-500">Receive monthly spending reports in your email.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div className="space-y-6">
              <CategoryManager />
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your financial data in PennyFincher.
                </p>
                
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Export Data (CSV)
                    </button>
                  </div>
                  
                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Import Data
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Be careful with these actions. They cannot be undone.
                </p>
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Reset All Data
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">About PennyFincher</h3>
                <p className="mt-1 text-sm text-gray-500">
                  PennyFincher is a personal finance tracking application that helps you manage your expenses and budget.
                </p>
                
                <div className="mt-4">
                  <h4 className="text-base font-medium text-gray-900">Version</h4>
                  <p className="text-sm text-gray-500">1.0.0</p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-base font-medium text-gray-900">Technologies</h4>
                  <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                    <li>React</li>
                    <li>TypeScript</li>
                    <li>Tailwind CSS</li>
                    <li>Google Sheets API</li>
                    <li>Chart.js</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Support</h3>
                <p className="mt-1 text-sm text-gray-500">
                  For support or feedback, please contact us at:
                </p>
                <p className="mt-2 text-sm font-medium text-green-600">support@pennyfincher.example.com</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings