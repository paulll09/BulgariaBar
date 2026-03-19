import { useContext, useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarCtx } from '../../context/barCtx';
import { getEffectivePrice, hasDiscount } from '../../utils/price';

export default function ProductCard({ product, categoryName }) {
    const addItem = useCartStore((state) => state.addItem);
    const { isOpen } = useContext(BarCtx);
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleAdd = () => {
        const effectivePrice = getEffectivePrice(product);
        addItem({ ...product, category_name: categoryName, price: effectivePrice, originalPrice: product.price });
        toast.success(`${product.name} agregado`);
    };

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-cream transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)]"
             style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.07)' }}>

            {/* ── Image ───────────────────────────── */}
            <div className={`relative w-full aspect-square overflow-hidden bg-surface2 ${!imgLoaded ? 'animate-pulse' : ''}`}>
                <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-500 ease-out ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                {hasDiscount(product) && (
                    <div className="absolute top-2.5 left-2.5 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        -{product.discount}%
                    </div>
                )}
            </div>

            {/* ── Info ────────────────────────────── */}
            <div className="flex flex-col flex-grow px-4 pt-3.5 pb-4 gap-1">
                {/* Name */}
                <h3 className="font-display font-semibold text-text uppercase leading-tight text-[1.15rem] sm:text-[1.25rem]">
                    {product.name}
                </h3>

                {/* Description */}
                {product.description && (
                    <p className="text-text text-sm leading-snug line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* ── Price row ───────────────────── */}
                <div className="flex items-center justify-between mt-auto pt-3.5">
                    {/* Price badge */}
                    {hasDiscount(product) ? (
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span className="text-text text-sm font-semibold">$</span>
                                <span className="font-display font-bold text-primary text-2xl sm:text-3xl leading-none">
                                    {getEffectivePrice(product).toLocaleString('es-AR')}
                                </span>
                            </div>
                            <span className="text-text/60 text-sm line-through mt-0.5">
                                ${product.price.toLocaleString('es-AR')}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-1">
                            <span className="text-text text-sm font-semibold">$</span>
                            <span className="font-display font-bold text-text text-2xl sm:text-3xl leading-none">
                                {product.price.toLocaleString('es-AR')}
                            </span>
                        </div>
                    )}

                    {/* Add button — only when bar is open */}
                    {isOpen && (
                        <button
                            onClick={handleAdd}
                            className="cursor-pointer flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-[0_2px_8px_rgba(217,0,9,0.25)] hover:shadow-[0_4px_14px_rgba(217,0,9,0.35)]"
                            aria-label={`Agregar ${product.name}`}
                        >
                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                            Agregar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
