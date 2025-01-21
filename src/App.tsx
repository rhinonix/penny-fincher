import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';


// Simple Layout component
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              PennyFincher
            </span>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">Dashboard</Link>
              <Link to="/transactions" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">Transactions</Link>
              <Link to="/categories" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">Categories</Link>
              <Link to="/accounts" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">Accounts</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Page components
function Transactions() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
      <p className="text-gray-600 dark:text-gray-300">Your transactions will appear here.</p>
    </div>
  );
}

function Categories() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      <p className="text-gray-600 dark:text-gray-300">Manage your expense categories here.</p>
    </div>
  );
}

function Accounts() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Accounts</h1>
      <p className="text-gray-600 dark:text-gray-300">Manage your accounts here.</p>
    </div>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
          <Route path="/categories" element={<Layout><Categories /></Layout>} />
          <Route path="/accounts" element={<Layout><Accounts /></Layout>} />
          <Route path="*" element={<Layout><Dashboard /></Layout>} /> {/* Catch all route */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;