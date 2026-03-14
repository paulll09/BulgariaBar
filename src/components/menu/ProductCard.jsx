import { useCartStore } from '../../store/cartStore';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = () => {
        addItem(product);
        toast.success(`${product.name} agregado`, {
            style: {
                background: '#fff',
                color: '#111',
                border: '1px solid rgba(0,0,0,0.07)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
            iconTheme: { primary: '#d90009', secondary: '#fff' },
        });
    };

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-surface transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)]"
             style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)' }}>

            {/* ── Image ───────────────────────────── */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface2">
                <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
            </div>

            {/* ── Info ────────────────────────────── */}
            <div className="flex flex-col flex-grow px-4 pt-3.5 pb-4 gap-1">
                {/* Name */}
                <h3 className="font-display font-semibold text-text uppercase leading-tight text-[1.15rem] sm:text-[1.25rem]">
                    {product.name}
                </h3>

                {/* Description */}
                {product.description && (
                    <p className="text-text-muted text-[13px] leading-snug line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* ── Price row ───────────────────── */}
                <div className="flex items-center justify-between mt-auto pt-3.5">
                    {/* Price badge */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-text-dim text-xs font-semibold">$</span>
                        <span className="font-display font-bold text-text text-2xl sm:text-3xl leading-none">
                            {product.price.toLocaleString('es-AR')}
                        </span>
                    </div>

                    {/* Add button */}
                    <button
                        onClick={handleAdd}
                        className="cursor-pointer flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-[0_2px_8px_rgba(217,0,9,0.25)] hover:shadow-[0_4px_14px_rgba(217,0,9,0.35)]"
                        aria-label={`Agregar ${product.name}`}
                    >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
}
