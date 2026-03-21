import { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';

function ScrollReveal({ children, delay = 0, animClass = 'animate-fade-up' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Fallback: if IntersectionObserver doesn't fire (e.g. in-app browsers),
        // force content visible after a short timeout
        const fallback = setTimeout(() => setVisible(true), 1500 + delay);

        if (typeof IntersectionObserver === 'undefined') {
            return () => clearTimeout(fallback);
        }

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                    clearTimeout(fallback);
                }
            },
            { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
        );
        obs.observe(el);
        return () => { obs.disconnect(); clearTimeout(fallback); };
    }, [delay]);
    return (
        <div
            ref={ref}
            className={visible ? animClass : ''}
            style={visible ? { animationDelay: `${delay}ms` } : { opacity: 0 }}
        >
            {children}
        </div>
    );
}

export default function Menu() {
    const { products, categories, loading, error, refetch } = useProducts(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const sectionRefs = useRef({});
    const tabsRef = useRef(null);
    const btnRefs = useRef({});
    const location = useLocation();

    // Sliding pill indicator state
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

    // Guard: blocks observer during programmatic scroll to prevent feedback loops
    const isProgrammaticScroll = useRef(false);
    const scrollTimer = useRef(null);

    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]?.id);
        }
    }, [categories]);

    // Track active category via scroll — rAF-throttled (once per frame).
    // Uses hysteresis so the active tab only changes when a new section is
    // clearly dominant, avoiding rapid flickering at section boundaries.
    useEffect(() => {
        if (!categories.length) return;

        let ticking = false;

        const computeActive = () => {
            ticking = false;
            if (isProgrammaticScroll.current) return;

            // The "trigger line" sits at 35% of the viewport height.
            // Whichever section's top is closest to this line wins.
            const trigger = window.innerHeight * 0.35;
            let best = null;
            let bestDist = Infinity;

            for (const cat of categories) {
                const el = sectionRefs.current[cat.id];
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                // Skip sections completely off-screen
                if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
                const dist = Math.abs(rect.top - trigger);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = cat.id;
                }
            }

            if (best !== null) {
                setActiveCategory(prev => {
                    if (prev === best) return prev;
                    // Hysteresis: the new section must be at least 60px closer
                    // than the current one before we switch. This prevents
                    // flickering right at the boundary between two sections.
                    const currentEl = sectionRefs.current[prev];
                    if (currentEl) {
                        const currentDist = Math.abs(currentEl.getBoundingClientRect().top - trigger);
                        if (bestDist > currentDist - 60) return prev;
                    }
                    return best;
                });
            }
        };

        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(computeActive);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        computeActive();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [categories]);

    useEffect(() => {
        const scrollTo = location.state?.scrollTo;
        if (!scrollTo || !categories.length) return;
        const cat = categories.find(c => c.name.toLowerCase().includes(scrollTo));
        if (cat) {
            setTimeout(() => scrollToCategory(cat.id), 500);
            window.history.replaceState({}, '');
        }
    }, [categories, location.state?.scrollTo]);

    const scrollToCategory = useCallback((id) => {
        const el = sectionRefs.current[id];
        if (!el) return;

        isProgrammaticScroll.current = true;
        if (scrollTimer.current) clearTimeout(scrollTimer.current);

        setActiveCategory(id);

        // Offset: tabs height only (no navbar)
        const tabsEl = tabsRef.current?.parentElement;
        const tabsHeight = tabsEl ? tabsEl.offsetHeight : 44;
        const top = el.getBoundingClientRect().top + window.scrollY - tabsHeight;
        window.scrollTo({ top, behavior: 'smooth' });

        scrollTimer.current = setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 1000);
    }, []);

    // Update the sliding pill position + horizontally scroll tabs
    useEffect(() => {
        const container = tabsRef.current;
        const btn = btnRefs.current[activeCategory];
        if (!container || !btn) return;

        // Pill slides to the active button
        setPillStyle({
            left: btn.offsetLeft,
            width: btn.offsetWidth,
            opacity: 1,
        });

        // Center the active tab horizontally
        const scrollTarget = btn.offsetLeft - (container.offsetWidth / 2) + (btn.offsetWidth / 2);
        container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }, [activeCategory]);

    return (
        <div id="menu" className="relative bg-white pb-20">

            {/* ── Category Tabs ──────────────────────── */}
            <div
                className="sticky z-40 bg-white border-b border-border"
                style={{ top: 0, boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}
            >
                <div
                    ref={tabsRef}
                    className="relative flex gap-2 px-4 sm:px-6 py-2.5 overflow-x-auto hide-scrollbar"
                >
                    {/* Sliding pill indicator */}
                    <div
                        className="absolute rounded-full bg-text shadow-sm"
                        style={{
                            left: pillStyle.left,
                            width: pillStyle.width,
                            top: '50%',
                            height: 'calc(100% - 20px)',
                            transform: 'translateY(-50%)',
                            opacity: pillStyle.opacity,
                            transition: 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    />

                    {categories.map((cat) => {
                        const active = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                ref={(el) => { btnRefs.current[cat.id] = el; }}
                                data-active={active}
                                onClick={() => scrollToCategory(cat.id)}
                                className="cursor-pointer relative z-10 shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors duration-300 active:scale-95"
                                style={active
                                    ? { color: 'var(--color-bg)' }
                                    : { color: 'var(--color-text-muted)', boxShadow: '0 0 0 1px rgba(0,0,0,0.07)', background: 'var(--color-cream)' }
                                }
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Sections ──────────────────────────── */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-12 pt-10">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-surface animate-pulse h-48" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-text-muted text-sm text-center">No se pudo cargar el menú. Verificá tu conexión e intentá de nuevo.</p>
                        <button
                            onClick={refetch}
                            className="cursor-pointer bg-primary hover:bg-primary-dark text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full transition-all active:scale-95"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    categories.map((cat) => {
                        const catProducts = products.filter(p => p.category_id === cat.id);
                        if (catProducts.length === 0) return null;

                        return (
                            <section
                                key={cat.id}
                                ref={(el) => { sectionRefs.current[cat.id] = el; }}
                            >
                                <ScrollReveal animClass="animate-slide-left">
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="font-display font-semibold text-text text-2xl sm:text-3xl uppercase shrink-0">
                                        {cat.name}
                                    </h2>
                                    <div className="flex-1 h-px bg-border" />
                                </div>
                                </ScrollReveal>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                    {catProducts.map((product, pIdx) => (
                                        <ScrollReveal key={product.id} delay={pIdx * 70}>
                                            <ProductCard product={product} categoryName={cat.name} />
                                        </ScrollReveal>
                                    ))}
                                </div>
                            </section>
                        );
                    })
                )}
            </div>
        </div>
    );
}
