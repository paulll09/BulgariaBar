import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export default function Navbar() {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const { pathname } = useLocation();
    const isHome = pathname === '/';

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const transparent = isHome && !isScrolled;

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={
                    transparent
                        ? { background: 'transparent', borderBottom: '1px solid transparent', boxShadow: 'none', paddingTop: 'env(safe-area-inset-top)' }
                        : { background: 'rgba(255,255,255,0.96)', borderBottom: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 0 rgba(0,0,0,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', paddingTop: 'env(safe-area-inset-top)' }
                }
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

                    {/* Logo + brand */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img
                            src="/images/logo.png"
                            alt="Bar Bulgaria"
                            className="h-8 w-auto object-contain group-hover:scale-105 transition-all duration-300"
                            style={{ filter: transparent ? 'none' : 'brightness(0) saturate(100%)' }}
                        />
                        <span
                            className="font-display font-semibold text-xl uppercase tracking-wide leading-none transition-colors duration-300"
                            style={{ color: transparent ? 'rgba(255,255,255,0.92)' : '' }}
                        >
                            {!transparent && <span className="group-hover:text-primary transition-colors duration-300 text-text">Bulgaria</span>}
                            {transparent && 'Bulgaria'}
                        </span>
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 group"
                        style={
                            transparent
                                ? { background: 'rgba(255,255,255,0.15)', boxShadow: '0 0 0 1px rgba(255,255,255,0.25)' }
                                : { background: 'var(--color-cream)', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }
                        }
                        aria-label="Ver carrito"
                    >
                        <ShoppingCart
                            className="w-[18px] h-[18px] transition-colors duration-200"
                            style={{ color: transparent ? 'rgba(255,255,255,0.85)' : 'var(--color-text-muted)' }}
                        />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-primary rounded-full animate-spring border-2 border-bg">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>

            {/* Spacer on non-home pages only */}
            {!isHome && <div style={{ height: 'calc(3.5rem + env(safe-area-inset-top))' }} />}
        </>
    );
}
