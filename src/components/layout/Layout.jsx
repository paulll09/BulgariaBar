import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Footer from './Footer';
import PatternBackground from './PatternBackground';
import { useCartStore } from '../../store/cartStore';

export default function Layout({ children }) {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const { pathname } = useLocation();
    const showFab = pathname !== '/cart';

    return (
        <div className="relative min-h-screen flex flex-col bg-background text-text selection:bg-primary/20 selection:text-secondary">
            <PatternBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
                <main className="flex-grow w-full">
                    {children}
                </main>
                <Footer />
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
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold text-white bg-text rounded-full border-2 border-bg animate-spring">
                            {totalItems}
                        </span>
                    )}
                </Link>
            )}
        </div>
    );
}
