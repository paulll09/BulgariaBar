import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import Layout from './components/layout/Layout';
import { AdminErrorBoundary } from './components/admin/AdminErrorBoundary';
import ScrollToTop from './components/layout/ScrollToTop';
import Loader from './components/layout/Loader';
import HomePage from './pages/HomePage';
import Cart from './components/cart/Cart';

const Login = lazy(() => import('./components/admin/Login'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const AdminProducts = lazy(() => import('./components/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./components/admin/AdminCategories'));
const AdminHours = lazy(() => import('./components/admin/AdminHours'));

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus('ok');
      else { setStatus('denied'); navigate('/admin'); }
    });
  }, []);

  if (status === 'checking') return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (status === 'denied') return null;
  return children;
}

const AdminFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <BrowserRouter>
      {loading && <Loader />}
      <ScrollToTop />
      <Layout>
        <AdminErrorBoundary>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                <Cart />
              </div>
            } />
            <Route path="/admin" element={
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <Login />
              </div>
            } />
            <Route path="/admin/dashboard" element={
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              </div>
            } />
            <Route path="/admin/products" element={
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <ProtectedRoute><AdminProducts /></ProtectedRoute>
              </div>
            } />
            <Route path="/admin/categories" element={
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <ProtectedRoute><AdminCategories /></ProtectedRoute>
              </div>
            } />
            <Route path="/admin/hours" element={
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <ProtectedRoute><AdminHours /></ProtectedRoute>
              </div>
            } />
          </Routes>
        </Suspense>
        </AdminErrorBoundary>
      </Layout>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App;
