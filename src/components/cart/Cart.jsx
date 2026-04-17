import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Minus, Plus, Trash2, ArrowLeft, MessageCircle, User, MapPin, CreditCard, AlignLeft, Wine, Store, Truck, LocateFixed, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Defined outside to avoid re-creation on every render
const inputCls = (err) =>
    `w-full min-w-0 bg-white border ${err ? 'border-primary ring-1 ring-primary/20' : 'border-border focus:border-text-dim'} rounded-xl px-4 py-3.5 text-text text-base outline-none transition-colors placeholder:text-text-dim font-body`;

export default function Cart() {
    const {
        items, removeItem, updateQuantity, getTotalPrice, clearCart,
        orderType, setOrderType,
        checkoutForm, setCheckoutForm,
    } = useCartStore();
    const totalPrice = getTotalPrice();
    const navigate = useNavigate();

    const hasDrinks = items.some(item => item.category_name?.toLowerCase().includes('bebida'));
    const handleAddDrink = () => navigate('/', { state: { scrollTo: 'bebida' } });

    // These don't need persistence — geolocation is re-requested each session
    const [formErrors, setFormErrors] = useState({});
    const [geoLocation, setGeoLocation] = useState(null);
    const [geoStatus, setGeoStatus] = useState('idle');

    const handleGetLocation = () => {
        if (!navigator.geolocation) { setGeoStatus('error'); return; }
        setGeoStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (pos) => { setGeoLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoStatus('granted'); },
            () => setGeoStatus('error'),
            { timeout: 8000 }
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCheckoutForm({ [name]: value });
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errors = {};
        if (!checkoutForm.name.trim()) errors.name = true;
        if (orderType === 'delivery' && !checkoutForm.address.trim()) errors.address = true;
        setFormErrors(errors);
        return !Object.keys(errors).length;
    };

    const handleCheckout = () => {
        if (!orderType || !validate()) return;
        const phone = import.meta.env.VITE_WHATSAPP_PHONE ?? '5493716400743';
        let text = `¡Hola! Soy *${checkoutForm.name.trim()}* y quiero hacer el siguiente pedido:\n\n`;
        items.forEach(item => {
            const displayName = item.variantName ? `${item.name} (${item.variantName})` : item.name;
            text += `• ${item.quantity}x ${displayName} — $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
        });
        text += orderType === 'delivery'
            ? `\n*TOTAL: $${totalPrice.toLocaleString('es-AR')} + envio*\n\n`
            : `\n*TOTAL: $${totalPrice.toLocaleString('es-AR')}*\n\n`;
        text += orderType === 'pickup'
            ? `🏠 *Modalidad:* Retiro en el local\n`
            : `🚚 *Modalidad:* Envío a domicilio\n`;
        if (orderType === 'delivery') {
            if (checkoutForm.address.trim()) text += `📍 *Dirección:* ${checkoutForm.address.trim()}\n`;
            if (geoLocation) text += `🗺️ *Ubicación exacta:* https://maps.google.com/?q=${geoLocation.lat},${geoLocation.lng}\n`;
        }
        const labels = { efectivo: 'Efectivo', transferencia: 'Transferencia' };
        text += `💳 *Pago:* ${labels[checkoutForm.paymentMethod]}\n`;
        if (checkoutForm.notes.trim()) text += `📝 *Aclaraciones:* ${checkoutForm.notes.trim()}\n`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
        clearCart();
    };

    /* ── Empty ───────────────────────────────── */
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-28 animate-fade-up">
                <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mb-7"
                     style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.07)' }}>
                    <Trash2 className="w-8 h-8 text-text-dim" />
                </div>
                <h2 className="font-display font-semibold text-4xl text-text uppercase mb-2">Carrito vacío</h2>
                <p className="text-text-muted text-sm text-center mb-9 max-w-xs leading-relaxed">
                    Todavía no sumaste nada. Explorá el menú para armar tu pedido.
                </p>
                <Link
                    to="/"
                    className="flex items-center gap-2 bg-text text-bg px-7 py-3 rounded-full text-sm font-semibold uppercase tracking-widest transition-all hover:bg-text/80 active:scale-95 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Ver el menú
                </Link>
            </div>
        );
    }

    /* ── With items ──────────────────────────── */
    return (
        <div className="animate-fade-in">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <Link to="/"
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-cream hover:bg-surface2 transition-all group"
                        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
                    >
                        <ArrowLeft className="w-4 h-4 text-text-muted group-hover:text-text group-hover:-translate-x-0.5 transition-all" />
                    </Link>
                    <h2 className="font-display font-semibold text-3xl sm:text-4xl text-text uppercase">Tu Pedido</h2>
                </div>
                <button
                    onClick={clearCart}
                    className="cursor-pointer flex items-center gap-1.5 text-xs text-text-muted hover:text-primary uppercase tracking-widest font-semibold transition-colors px-3 py-2 rounded-full hover:bg-primary/5"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vaciar
                </button>
            </div>

            {/* Items */}
            <div className="space-y-2.5 mb-7">
                {items.map((item, i) => {
                    const key = item.cartKey || item.id;
                    return (
                        <div
                            key={key}
                            className="animate-fade-up flex items-center gap-3 p-3 rounded-2xl"
                            style={{ animationDelay: `${i * 55}ms`, boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)' }}
                        >
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface2 flex items-center justify-center">
                                {item.image_url
                                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    : <ImageIcon className="w-5 h-5 text-text-dim" />
                                }
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="font-display font-semibold text-text text-lg uppercase leading-tight">
                                    {item.name}{item.variantName ? ` - ${item.variantName}` : ''}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-text-muted text-sm">${item.price.toLocaleString('es-AR')}</span>
                                    {item.originalPrice && item.originalPrice !== item.price && (
                                        <span className="text-text-dim text-xs line-through">${item.originalPrice.toLocaleString('es-AR')}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-cream rounded-full p-0.5 shrink-0"
                                 style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.07)' }}>
                                <button onClick={() => updateQuantity(key, item.quantity - 1)}
                                    aria-label={`Reducir cantidad de ${item.name}`}
                                    className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full text-text-muted hover:bg-surface hover:text-text transition-all active:scale-90">
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-6 text-center text-text font-bold text-sm">{item.quantity}</span>
                                <button onClick={() => updateQuantity(key, item.quantity + 1)}
                                    aria-label={`Aumentar cantidad de ${item.name}`}
                                    className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full text-text-muted hover:bg-surface hover:text-text transition-all active:scale-90">
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <button onClick={() => removeItem(key)}
                                aria-label={`Eliminar ${item.name}`}
                                className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full text-text-dim hover:text-primary hover:bg-primary/5 transition-all shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Agregar bebida — solo cuando no hay bebidas */}
            {!hasDrinks && (
                <button
                    onClick={handleAddDrink}
                    className="cursor-pointer w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl mb-7 font-semibold text-sm uppercase tracking-widest transition-all active:scale-95 hover:opacity-90"
                    style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                        color: 'rgba(255,255,255,0.92)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                    }}
                >
                    <Wine className="w-4 h-4" style={{ color: '#c084fc' }} />
                    Agregar Bebida
                </button>
            )}

            {/* ── Modalidad de entrega ── */}
            <div
                className="rounded-2xl p-5 sm:p-7 mb-4 bg-cream animate-fade-up"
                style={{ animationDelay: `${items.length * 55 + 70}ms`, boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)' }}
            >
                <h3 className="font-display font-semibold text-text text-2xl uppercase mb-5 pb-4 border-b border-border">
                    ¿Cómo recibís tu pedido?
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'pickup', label: 'Retirar del local', Icon: Store },
                        { id: 'delivery', label: 'Envío a domicilio', Icon: Truck },
                    ].map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => {
                                setOrderType(id);
                                if (id === 'pickup') { setGeoLocation(null); setGeoStatus('idle'); }
                            }}
                            className={`cursor-pointer flex flex-col items-center gap-2.5 py-5 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                                orderType === id
                                    ? 'border-text bg-text text-bg'
                                    : 'border-border bg-cream text-text-muted hover:border-text-dim hover:text-text'
                            }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-center leading-snug px-2">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Formulario — render condicional ── */}
            {orderType && (
                <div className="rounded-2xl p-5 sm:p-7 mb-4 bg-cream animate-fade-up" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)' }}>
                    <h3 className="font-display font-semibold text-text text-2xl uppercase mb-5 pb-4 border-b border-border">
                        Tus datos
                    </h3>

                    <div className="space-y-4 mb-6">
                        {/* Nombre */}
                        <div>
                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-2">
                                <User className="w-3.5 h-3.5 text-primary" />
                                Nombre <span className="text-primary">*</span>
                            </label>
                            <input type="text" name="name" value={checkoutForm.name} onChange={handleChange}
                                placeholder="Ej: Juan Pérez" className={inputCls(formErrors.name)} />
                            {formErrors.name && (
                                <p className="text-primary text-xs mt-1">Nombre es obligatorio</p>
                            )}
                        </div>

                        {/* Dirección + geolocalización — solo para envío */}
                        {orderType === 'delivery' && (
                            <div className="flex flex-col gap-2.5 animate-fade-in">
                                <div>
                                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-2">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        Dirección <span className="text-primary">*</span>
                                    </label>
                                    <input type="text" name="address" value={checkoutForm.address} onChange={handleChange}
                                        placeholder="Ej: Calle Paraguay 1234" className={inputCls(formErrors.address)} />
                                    {formErrors.address && (
                                        <p className="text-primary text-xs mt-1">Dirección es obligatoria para envío</p>
                                    )}
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        disabled={geoStatus === 'loading'}
                                        className={`cursor-pointer flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all border ${
                                            geoStatus === 'granted'
                                                ? 'border-green-500/40 bg-green-500/10 text-green-600'
                                                : geoStatus === 'error'
                                                ? 'border-primary/30 bg-primary/5 text-primary'
                                                : 'border-border bg-cream text-text-muted hover:text-text hover:border-text-dim'
                                        }`}
                                    >
                                        <LocateFixed className="w-3.5 h-3.5" />
                                        {geoStatus === 'loading' ? 'Obteniendo ubicación…'
                                            : geoStatus === 'granted' ? 'Ubicación obtenida ✓'
                                            : geoStatus === 'error' ? 'No se pudo obtener la ubicación'
                                            : 'Compartir ubicación exacta (opcional)'}
                                    </button>
                                    {geoStatus === 'idle' && (
                                        <p className="text-[10px] text-text-dim mt-1.5 text-center">
                                            Tu ubicación GPS se enviará junto al pedido por WhatsApp
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Medio de pago */}
                        <div>
                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-2">
                                <CreditCard className="w-3.5 h-3.5 text-primary" />
                                Medio de Pago
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['efectivo', 'transferencia'].map((m) => (
                                    <label key={m} className={`cursor-pointer rounded-xl py-3 px-2 text-center transition-all text-[11px] font-semibold uppercase tracking-wide ${
                                        checkoutForm.paymentMethod === m ? 'bg-text text-bg' : 'bg-cream text-text-muted hover:text-text'
                                    }`}
                                    style={checkoutForm.paymentMethod !== m ? { boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' } : {}}>
                                        <input type="radio" name="paymentMethod" value={m} checked={checkoutForm.paymentMethod === m}
                                            onChange={handleChange} className="hidden" />
                                        {m}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Aclaraciones */}
                        <div>
                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-2">
                                <AlignLeft className="w-3.5 h-3.5 text-primary" />
                                Aclaraciones
                                <span className="normal-case tracking-normal font-normal text-text-dim ml-1">(opcional)</span>
                            </label>
                            <textarea name="notes" value={checkoutForm.notes} onChange={handleChange}
                                placeholder="Sin cebolla, sin mayonesa etc..." rows="2"
                                className={`${inputCls(false)} resize-none`} />
                        </div>
                    </div>

                    {/* Total + botón — desktop */}
                    <div className="hidden sm:block pt-5 border-t border-border">
                        <div className="flex justify-between items-end mb-5">
                            <span className="text-text-muted text-xs font-semibold uppercase tracking-widest">Total</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-text-dim text-sm font-semibold">$</span>
                                <span className="font-display font-bold text-text text-4xl leading-none">{totalPrice.toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                        <button onClick={handleCheckout}
                            className="cursor-pointer w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors active:scale-[0.98] shadow-[0_4px_16px_rgba(217,0,9,0.25)]">
                            <MessageCircle className="w-[18px] h-[18px]" />
                            Pedir por WhatsApp
                        </button>
                        <p className="text-xs text-center text-text-dim mt-4">Serás redirigido a WhatsApp para confirmar tu pedido.</p>
                        {orderType === 'delivery' && (
                            <p className="text-[11px] text-center text-text-dim mt-1">* El costo de envío se acuerda aparte.</p>
                        )}
                    </div>

                </div>
            )}

            {/* Sticky bottom bar — mobile */}
            {orderType && (
                <div
                    className="sm:hidden fixed bottom-0 left-0 right-0 z-[100] border-t border-border px-4 py-3 bg-white"
                    style={{ background: '#ffffff', boxShadow: '0 -4px 24px rgba(0,0,0,0.12)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
                >
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-[10px] text-text-muted font-semibold uppercase tracking-widest">Total</p>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-text-dim text-xs">$</span>
                                <span className="font-display font-bold text-text text-2xl leading-none">{totalPrice.toLocaleString('es-AR')}</span>
                            </div>
                            {orderType === 'delivery' && <p className="text-[10px] text-text-dim mt-0.5">* Envío aparte</p>}
                        </div>
                        <button onClick={handleCheckout}
                            className="cursor-pointer flex-1 bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-[0.97] shadow-[0_4px_14px_rgba(217,0,9,0.3)]">
                            <MessageCircle className="w-4 h-4" />
                            Pedir por WhatsApp
                        </button>
                    </div>
                </div>
            )}

            {orderType && <div className="sm:hidden h-28" />}
        </div>
    );
}
