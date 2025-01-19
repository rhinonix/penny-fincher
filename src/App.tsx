// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/transactions/Transactions';
import Categories from './pages/categories/Categories';
import Accounts from './pages/accounts/Accounts';
import AuthCallback from './pages/AuthCallback';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
              <Route path="/categories" element={<Layout><Categories /></Layout>} />
              <Route path="/accounts" element={<Layout><Accounts /></Layout>} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;