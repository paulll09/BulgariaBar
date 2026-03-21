import { useContext, useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Plus, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarCtx } from '../../context/barCtx';
import { getEffectivePrice, hasDiscount, getEffectiveVariantPrice, variantHasDiscount } from '../../utils/price';

export default function ProductCard({ product, categoryName }) {
    const addItem = useCartStore((state) => state.addItem);
    const { isOpen } = useContext(BarCtx);
    const [imgLoaded, setImgLoaded] = useState(false);

    const variants = product.product_variants || [];
    const hasVariants = variants.length > 0;

    const handleAdd = () => {
        const effectivePrice = getEffectivePrice(product);
        addItem({ ...product, category_name: categoryName, price: effectivePrice, originalPrice: product.price });
        toast.success(`${product.name} agregado`);
    };

    const handleAddVariant = (variant) => {
        const effectivePrice = getEffectiveVariantPrice(variant);
        addItem(
            { ...product, category_name: categoryName },
            { ...variant, price: effectivePrice }
        );
        toast.success(`${product.name} (${variant.name}) agregado`);
    };

    const anyVariantHasDiscount = hasVariants && variants.some(v => variantHasDiscount(v));

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-cream transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)]"
             style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.07)' }}>

            {/* ── Image ───────────────────────────── */}
            <div className={`relative w-full aspect-square overflow-hidden bg-surface2 ${product.image_url && !imgLoaded ? 'animate-pulse' : ''}`}>
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        className={`w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-500 ease-out ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-dim/40">
                        <ImageIcon className="w-12 h-12" />
                    </div>
                )}
                {!hasVariants && hasDiscount(product) && (
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

                {/* ── Variants list ─────────────── */}
                {hasVariants ? (
                    <div className="flex flex-col gap-2 mt-auto pt-3.5">
                        {variants.map((variant) => {
                            const effPrice = getEffectiveVariantPrice(variant);
                            const vHasDiscount = variantHasDiscount(variant);
                            return (
                                <div key={variant.id} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-text text-sm font-medium truncate">{variant.name}</span>
                                        {vHasDiscount && (
                                            <span className="text-primary text-[10px] font-bold shrink-0">-{variant.discount}%</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-text text-xs font-semibold">$</span>
                                                <span className="font-display font-bold text-text text-lg leading-none">
                                                    {effPrice.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                            {vHasDiscount && (
                                                <span className="text-text/60 text-xs line-through">
                                                    ${variant.price.toLocaleString('es-AR')}
                                                </span>
                                            )}
                                        </div>
                                        {isOpen && (
                                            <button
                                                onClick={() => handleAddVariant(variant)}
                                                className="cursor-pointer flex items-center justify-center w-9 h-9 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-200 active:scale-95 shadow-[0_2px_8px_rgba(217,0,9,0.25)] hover:shadow-[0_4px_14px_rgba(217,0,9,0.35)]"
                                                aria-label={`Agregar ${product.name} ${variant.name}`}
                                            >
                                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ── Single price row ───────────────── */
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
                )}
            </div>
        </div>
    );
}
