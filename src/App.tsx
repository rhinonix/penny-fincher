import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

/**
 * Main application component that sets up routing
 * 
 * Configures all application routes within the main Layout component.
 * Includes routes for Dashboard, Transactions, Budget, Reports, and Settings.
 * Redirects invalid routes to the Dashboard.
 * 
 * @returns {JSX.Element} The rendered application with routing
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App