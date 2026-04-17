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

    const handleAdd = (e) => {
        e.stopPropagation();
        const effectivePrice = getEffectivePrice(product);
        addItem({ ...product, category_name: categoryName, price: effectivePrice, originalPrice: product.price });
        toast.success(`${product.name} agregado`);
    };

    const handleAddVariant = (e, variant) => {
        e.stopPropagation();
        const effectivePrice = getEffectiveVariantPrice(variant);
        addItem(
            { ...product, category_name: categoryName },
            { ...variant, price: effectivePrice, originalPrice: variant.price }
        );
        toast.success(`${product.name} (${variant.name}) agregado`);
    };

    return (
        <div className="product-card group relative overflow-hidden rounded-[20px]">

            {/* ── Hero image ──────────────────────── */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface2">
                {product.image_url ? (
                    <>
                        {!imgLoaded && (
                            <div className="absolute inset-0 card-shimmer" />
                        )}
                        <img
                            src={product.image_url}
                            alt={product.name}
                            loading="lazy"
                            onLoad={() => setImgLoaded(true)}
                            className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
                                imgLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-dim/25">
                        <ImageIcon className="w-12 h-12" />
                    </div>
                )}

                {/* ── Gradient overlay ────────────── */}
                <div className="absolute inset-0 pointer-events-none card-gradient" />

                {/* ── Discount badge ──────────────── */}
                {!hasVariants && hasDiscount(product) && (
                    <div className="absolute top-3 left-3 badge-glow bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        -{product.discount}%
                    </div>
                )}
                {hasVariants && variants.some(v => variantHasDiscount(v)) && (
                    <div className="absolute top-3 left-3 badge-glow bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        PROMO
                    </div>
                )}

                {/* ── Text overlay on image ──────── */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5 pt-10">
                    <h3 className="font-display font-bold text-white uppercase leading-[1.15] text-[1.25rem] sm:text-[1.4rem]"
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        {product.name}
                    </h3>
                    {product.description && (
                        <p className="text-white/70 text-[13px] leading-snug line-clamp-1 mt-1"
                           style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                            {product.description}
                        </p>
                    )}
                </div>

                {/* ── Price pill (single price only) ── */}
                {!hasVariants && (
                    <div className="absolute top-3 right-3">
                        <div className="price-pill px-3 py-1.5 rounded-full flex items-baseline gap-0.5">
                            <span className="text-white/80 text-[11px] font-semibold">$</span>
                            {hasDiscount(product) ? (
                                <div className="flex items-baseline gap-1.5">
                                    <span className="font-display font-bold text-white text-lg leading-none">
                                        {getEffectivePrice(product).toLocaleString('es-AR')}
                                    </span>
                                    <span className="text-white/50 text-[11px] line-through">
                                        {product.price.toLocaleString('es-AR')}
                                    </span>
                                </div>
                            ) : (
                                <span className="font-display font-bold text-white text-lg leading-none">
                                    {product.price.toLocaleString('es-AR')}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Add button (single price) ──── */}
                {!hasVariants && isOpen && (
                    <button
                        onClick={handleAdd}
                        className="absolute bottom-3.5 right-3.5 add-btn cursor-pointer flex items-center justify-center w-11 h-11 bg-primary text-white rounded-full active:scale-90"
                        aria-label={`Agregar ${product.name}`}
                    >
                        <Plus className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                )}
            </div>

            {/* ── Variants section ────────────────── */}
            {hasVariants && (
                <div className="bg-cream px-4 py-3 flex flex-col gap-2">
                    {variants.map((variant, vIdx) => {
                        const effPrice = getEffectiveVariantPrice(variant);
                        const vHasDiscount = variantHasDiscount(variant);
                        return (
                            <div
                                key={variant.id}
                                className="flex items-center justify-between gap-2 variant-row"
                                style={{ animationDelay: `${vIdx * 50}ms` }}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-text text-sm font-medium truncate">{variant.name}</span>
                                    {vHasDiscount && (
                                        <span className="text-primary text-[10px] font-bold bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                                            -{variant.discount}%
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2.5 shrink-0">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-text text-[11px] font-semibold">$</span>
                                            <span className="font-display font-bold text-text text-[1.1rem] leading-none">
                                                {effPrice.toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                        {vHasDiscount && (
                                            <span className="text-text/40 text-[10px] line-through">
                                                ${variant.price.toLocaleString('es-AR')}
                                            </span>
                                        )}
                                    </div>
                                    {isOpen && (
                                        <button
                                            onClick={(e) => handleAddVariant(e, variant)}
                                            className="add-btn cursor-pointer flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full active:scale-85"
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
            )}
        </div>
    );
}
