import { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { BarCtx } from '../../context/barCtx';

const LOADER_DURATION = 1900;

export default function HeroSection() {
    const { appLoading } = useContext(BarCtx);
    const hadLoader = useRef(appLoading).current;
    const d = (base) => `${hadLoader ? LOADER_DURATION + base : base}ms`;

    const scrollToMenu = () => {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section
            className="relative w-full overflow-hidden flex flex-col items-center justify-center bg-black"
            style={{ minHeight: '100svh', height: '100svh', contain: 'layout style' }}
        >
            {/* Imagen de fondo — reveal inmediato (el loader lo cubre mientras dura) */}
            <div
                style={{
                    position: 'absolute',
                    inset: '-5%',
                    backgroundImage: "url('/images/bulhero2.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: 'hero-bg-reveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    willChange: 'transform, opacity',
                    transform: 'translateZ(0)',
                    opacity: 0,
                }}
            />

            {/* Overlay degradado */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.10) 52%, rgba(0,0,0,0.36) 100%)',
                    zIndex: 2,
                    pointerEvents: 'none',
                    transform: 'translateZ(0)',
                }}
            />

            {/* Contenido */}
            <div className="relative flex flex-col items-center text-center px-6 gap-3" style={{ zIndex: 3 }}>
                <img
                    src="/images/logo.png"
                    alt="Bar Bulgaria"
                    width="96"
                    height="96"
                    className="animate-hero-logo w-20 sm:w-24 h-auto object-contain"
                    style={{ animationDelay: d(500) }}
                    draggable="false"
                    loading="eager"
                    decoding="async"
                />

                <h1
                    className="animate-hero-title font-display font-bold text-white uppercase leading-none"
                    style={{
                        fontSize: 'clamp(3.4rem, 15vw, 6.5rem)',
                        animationDelay: d(680),
                        textShadow: '0 2px 24px rgba(0,0,0,0.55)',
                    }}
                >
                    Bulgaria
                </h1>

                <p
                    className="animate-hero-fade text-white/60 text-[11px] sm:text-xs uppercase tracking-[0.45em] font-semibold"
                    style={{ animationDelay: d(860) }}
                >
                    Bar &amp; Cocina
                </p>

                <div className="animate-hero-fade flex flex-col sm:flex-row items-center gap-3 mt-4" style={{ animationDelay: d(1020) }}>
                    <button
                        onClick={scrollToMenu}
                        className="cursor-pointer bg-primary hover:bg-primary-dark text-white font-semibold text-xs uppercase tracking-widest px-7 py-3 rounded-full transition-colors duration-200 active:scale-95"
                        style={{ boxShadow: '0 4px 20px rgba(217,0,9,0.45)' }}
                    >
                        Ver el Menú
                    </button>
                    <Link
                        to="/reserva"
                        className="bg-primary hover:bg-primary-dark text-white font-semibold text-xs uppercase tracking-widest px-7 py-3 rounded-full transition-colors duration-200 active:scale-95"
                        style={{ boxShadow: '0 4px 20px rgba(217,0,9,0.45)' }}
                    >
                        Realizar Reserva
                    </Link>
                </div>
            </div>

            {/* Flecha roja animada */}
            <button
                onClick={scrollToMenu}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-arrow cursor-pointer transition-opacity hover:opacity-100"
                style={{ zIndex: 3, opacity: 0.85 }}
                aria-label="Ir al menú"
            >
                <ChevronDown className="w-7 h-7" style={{ color: '#d90009' }} strokeWidth={2.5} />
            </button>
        </section>
    );
}
