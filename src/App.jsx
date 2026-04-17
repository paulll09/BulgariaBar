import { useState, useEffect, useMemo, useContext, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import { AdminErrorBoundary } from './components/admin/AdminErrorBoundary';
import ScrollToTop from './components/layout/ScrollToTop';
import Loader from './components/layout/Loader';
import HomePage from './pages/HomePage';
import Cart from './components/cart/Cart';
import ReservationPage from './pages/ReservationPage';
import { OverlayCtx } from './context/overlayCtx';
import { BarCtx } from './context/barCtx';
import { FeaturesCtx } from './context/featuresCtx';
import { useSchedule } from './hooks/useSchedule';
import { useAdminSession } from './hooks/useAdminSession';
import { ConfirmProvider } from './components/ui/ConfirmDialog';

const Login           = lazy(() => import('./components/admin/Login'));
const Dashboard       = lazy(() => import('./components/admin/Dashboard'));
const AdminProducts   = lazy(() => import('./components/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./components/admin/AdminCategories'));
const AdminHours      = lazy(() => import('./components/admin/AdminHours'));
const AdminQR         = lazy(() => import('./components/admin/AdminQR'));
const AdminPromotions = lazy(() => import('./components/admin/AdminPromotions'));

const AdminFallback = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-pulse">
    <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6" />
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-xl" />
      ))}
    </div>
  </div>
);

function ProtectedRoute({ children }) {
  const status = useAdminSession();
  if (status === 'checking') return <AdminFallback />;
  if (status === 'denied') return null;
  return children;
}

function FeatureRoute({ feature, fallback = '/', children }) {
  const features = useContext(FeaturesCtx);
  if (!features[feature]) return <Navigate to={fallback} replace />;
  return children;
}

const adminWrapper = (children) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</div>
);

function App() {
  const [loading, setLoading] = useState(true);
  const [overlayActive, setOverlayActive] = useState(false);
  const { isOpen, schedule, features } = useSchedule();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const barCtxValue     = useMemo(() => ({ isOpen, schedule, appLoading: loading }), [isOpen, schedule, loading]);
  const overlayCtxValue = useMemo(() => ({ active: overlayActive, setActive: setOverlayActive }), [overlayActive]);

  return (
    <FeaturesCtx.Provider value={features}>
    <BarCtx.Provider value={barCtxValue}>
    <OverlayCtx.Provider value={overlayCtxValue}>
    <ConfirmProvider>
    <BrowserRouter>
      {loading && <Loader />}
      <ScrollToTop />
      <Layout>
        <AdminErrorBoundary>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6"><Cart /></div>
            } />

            {/* Feature: reservas (cliente) */}
            <Route path="/reserva" element={
              <FeatureRoute feature="reservations"><ReservationPage /></FeatureRoute>
            } />

            {/* Admin — público */}
            <Route path="/admin" element={adminWrapper(<Login />)} />

            {/* Admin — protegidas */}
            <Route path="/admin/dashboard"  element={adminWrapper(<ProtectedRoute><Dashboard /></ProtectedRoute>)} />
            <Route path="/admin/products"   element={adminWrapper(<ProtectedRoute><AdminProducts /></ProtectedRoute>)} />
            <Route path="/admin/categories" element={adminWrapper(<ProtectedRoute><AdminCategories /></ProtectedRoute>)} />
            <Route path="/admin/hours"      element={adminWrapper(<ProtectedRoute><AdminHours /></ProtectedRoute>)} />
            <Route path="/admin/qr"         element={adminWrapper(<ProtectedRoute><AdminQR /></ProtectedRoute>)} />

            {/* Admin — rutas premium */}
            <Route path="/admin/promotions" element={adminWrapper(
              <ProtectedRoute>
                <FeatureRoute feature="promotions" fallback="/admin/dashboard">
                  <AdminPromotions />
                </FeatureRoute>
              </ProtectedRoute>
            )} />
          </Routes>
        </Suspense>
        </AdminErrorBoundary>
      </Layout>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#fff',
            color: '#111',
            border: '1px solid rgba(0,0,0,0.07)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            maxWidth: '380px',
          },
          success: { iconTheme: { primary: '#d90009', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#d90009', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
    </ConfirmProvider>
    </OverlayCtx.Provider>
    </BarCtx.Provider>
    </FeaturesCtx.Provider>
  );
}

export default App;
