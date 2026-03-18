import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Footer from './Footer';
import { useCartStore } from '../../store/cartStore';
import { OverlayCtx } from '../../context/overlayCtx';
import { BarCtx } from '../../context/barCtx';

export default function Layout({ children }) {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const { pathname } = useLocation();
    const { active: overlayActive } = useContext(OverlayCtx);
    const { isOpen } = useContext(BarCtx);
    const showFab = pathname !== '/cart' && pathname !== '/reserva' && !pathname.startsWith('/admin') && !overlayActive && isOpen;
    const isLightPage = pathname.startsWith('/admin') || pathname === '/cart' || pathname === '/reserva';
    const isAdmin = pathname.startsWith('/admin');
    const needsSafeAreaBottom = isLightPage && pathname !== '/cart';

    return (
        <div
            className={`relative min-h-screen flex flex-col text-text selection:bg-primary/20 selection:text-secondary ${isLightPage ? 'bg-white' : ''}`}
            style={needsSafeAreaBottom ? { paddingBottom: 'env(safe-area-inset-bottom)' } : undefined}
        >
            {/* Navbar removed */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <main className="flex-grow w-full">
                    {children}
                </main>
                {!pathname.startsWith('/admin') && pathname !== '/cart' && pathname !== '/reserva' && <Footer />}
            </div>

            {/* Floating Cart Button — mobile only */}
            {showFab && (
                <Link
                    to="/cart"
                    className={`sm:hidden fixed bottom-5 right-5 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center active:scale-90 transition-transform ${totalItems > 0 ? 'animate-fab-pulse' : ''}`}
                    style={{ boxShadow: '0 4px 20px rgba(217,0,9,0.45)' }}
                    aria-label="Ver carrito"
                >
                    <ShoppingCart className="w-6 h-6 text-white" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold text-white bg-text rounded-full animate-fade-in">
                            {totalItems}
                        </span>
                    )}
                </Link>
            )}
        </div>
    );
}
