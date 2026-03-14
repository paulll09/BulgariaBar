import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import Loader from './components/layout/Loader';
import HomePage from './pages/HomePage';
import Cart from './components/cart/Cart';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import AdminProducts from './components/admin/AdminProducts';

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
              <Dashboard />
            </div>
          } />
          <Route path="/admin/products" element={
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
              <AdminProducts />
            </div>
          } />
        </Routes>
      </Layout>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App;
