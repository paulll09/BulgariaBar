import { useEffect, useRef, useState } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';

const IconInstagram = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
);

const IconFacebook = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

const AQLogoSvg = () => (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0">
        <circle cx="20" cy="20" r="19" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
        <text x="50%" y="53%" dominantBaseline="middle" textAnchor="middle"
            fill="white" fontSize="13" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="-0.5">
            AQ
        </text>
    </svg>
);

function FadeItem({ children, delay = 0, visible }) {
    return (
        <div
            className={visible ? 'animate-fade-up' : ''}
            style={visible ? { animationDelay: `${delay}ms` } : { opacity: 0, pointerEvents: 'none' }}
        >
            {children}
        </div>
    );
}

export default function Footer() {
    const footerRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = footerRef.current;
        if (!el) return;

        const fallback = setTimeout(() => setVisible(true), 3000);

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
            { threshold: 0.08 }
        );
        obs.observe(el);
        return () => { obs.disconnect(); clearTimeout(fallback); };
    }, []);

    return (
        <footer ref={footerRef} style={{ background: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.07)' }} className="mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

                    {/* Brand */}
                    <FadeItem visible={visible} delay={80}>
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/images/logo.png" alt="Bulgaria" width="40" height="40" className="w-10 h-10 object-contain" />
                                <div>
                                    <p className="font-display font-semibold text-2xl uppercase leading-none" style={{ color: 'rgba(255,255,255,0.92)' }}>Bulgaria</p>
                                    <p className="text-[10px] uppercase tracking-[0.3em] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Bar &amp; Cocina</p>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                Las mejores hamburguesas, lomitos, pizzas y empanadas.
                            </p>
                            <div className="flex gap-2.5 mt-5">
                                <a href="https://www.instagram.com/bulgaria.23" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                                    style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                                    aria-label="Instagram">
                                    <IconInstagram />
                                </a>
                                <a href="https://web.facebook.com/profile.php?id=61581728573140" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                                    style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                                    aria-label="Facebook">
                                    <IconFacebook />
                                </a>
                            </div>
                        </div>
                    </FadeItem>

                    {/* Location & Hours */}
                    <FadeItem visible={visible} delay={200}>
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <h4 className="flex items-center gap-2 font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                Dónde estamos
                            </h4>
                            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Av. San Martín y Curesti</p>
                            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>Las Lomitas-Formosa</p>

                            <h4 className="flex items-center gap-2 font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                Horarios
                            </h4>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Jueves a Domingo: 20:00 — 00:00</p>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Lunes a Miercoles: Cerrado</p>
                        </div>
                    </FadeItem>

                    {/* Contact */}
                    <FadeItem visible={visible} delay={320}>
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <h4 className="flex items-center gap-2 font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                <Phone className="w-3.5 h-3.5 text-primary" />
                                Contacto
                            </h4>
                            <a href="tel:+5491123456789" className="text-sm transition-colors mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                                +54 9 3704915165
                            </a>
                            <a href="mailto:bulgariabar23@gmail.com" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                                bulgariabar23@gmail.com
                            </a>
                        </div>
                    </FadeItem>

                </div>

                {/* Bottom bar */}
                <FadeItem visible={visible} delay={440}>
                    <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}>
                        <p>© {new Date().getFullYear()} Bar Bulgaria. Todos los derechos reservados.</p>
                        <a
                            href="https://www.aqtech.com.ar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                        >
                            <span>Desarrollado por</span>
                            <AQLogoSvg />
                            <span className="font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.55)' }}>AQ Tech</span>
                        </a>
                    </div>
                </FadeItem>
            </div>
        </footer>
    );
}
