import { useRef, useState, useEffect } from 'react';
import { dummyCategories, dummyProducts } from '../../data/dummyMenu';
import ProductCard from './ProductCard';

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState(dummyCategories[0]?.id);
    const sectionRefs = useRef({});
    const tabsRef = useRef(null);

    useEffect(() => {
        const observers = [];
        dummyCategories.forEach((cat) => {
            const el = sectionRefs.current[cat.id];
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveCategory(cat.id); },
                { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, []);

    const scrollToCategory = (id) => {
        const el = sectionRefs.current[id];
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 14 - 52 - 8;
        window.scrollTo({ top, behavior: 'smooth' });
        setActiveCategory(id);
    };

    useEffect(() => {
        const btn = tabsRef.current?.querySelector('[data-active="true"]');
        btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [activeCategory]);

    return (
        <div id="menu" className="pb-20 bg-bg">

            {/* ── Category Tabs ──────────────────────── */}
            <div
                className="sticky z-40 bg-bg/95 backdrop-blur-md border-b border-border"
                style={{ top: '56px', boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}
            >
                <div
                    ref={tabsRef}
                    className="flex gap-2 px-4 sm:px-6 py-2.5 overflow-x-auto"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {dummyCategories.map((cat) => {
                        const active = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                data-active={active}
                                onClick={() => scrollToCategory(cat.id)}
                                className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 active:scale-95 ${
                                    active
                                        ? 'bg-text text-bg shadow-sm'
                                        : 'bg-cream text-text-muted hover:bg-surface2 hover:text-text'
                                }`}
                                style={active ? {} : { boxShadow: '0 0 0 1px rgba(0,0,0,0.07)' }}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Sections ──────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-12 pt-10">
                {dummyCategories.map((cat, catIdx) => {
                    const products = dummyProducts.filter(p => p.category_id === cat.id);
                    if (products.length === 0) return null;

                    return (
                        <section
                            key={cat.id}
                            ref={(el) => { sectionRefs.current[cat.id] = el; }}
                        >
                            {/* Section header */}
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="font-display font-semibold text-text text-2xl sm:text-3xl uppercase shrink-0">
                                    {cat.name}
                                </h2>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                {products.map((product, pIdx) => (
                                    <div
                                        key={product.id}
                                        className="animate-fade-up"
                                        style={{ animationDelay: `${pIdx * 70}ms` }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
