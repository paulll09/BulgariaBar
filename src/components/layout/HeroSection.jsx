import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
    const scrollToMenu = () => {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section
            className="relative w-full overflow-hidden flex flex-col items-center justify-center"
            style={{ height: '100dvh', contain: 'layout style' }}
        >
            {/* Imagen de fondo con Ken Burns — GPU-accelerated */}
            <div
                style={{
                    position: 'absolute',
                    inset: '-5%',
                    backgroundImage: "url('/images/bulhero2.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: 'kenburns-hero 20s ease-in-out infinite alternate',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    isolation: 'isolate',
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
                }}
            />

            {/* Contenido */}
            <div className="relative flex flex-col items-center text-center px-6 gap-3" style={{ zIndex: 3 }}>
                <img
                    src="/images/logo.png"
                    alt="Bar Bulgaria"
                    className="animate-hero-fade w-20 sm:w-24 h-auto object-contain drop-shadow-2xl"
                    style={{ animationDelay: '80ms' }}
                    draggable="false"
                    loading="eager"
                    decoding="async"
                />

                <h1
                    className="animate-hero-fade font-display font-bold text-white uppercase leading-none"
                    style={{
                        fontSize: 'clamp(3.4rem, 15vw, 6.5rem)',
                        animationDelay: '200ms',
                        textShadow: '0 2px 24px rgba(0,0,0,0.55)',
                    }}
                >
                    Bulgaria
                </h1>

                <p
                    className="animate-hero-fade text-white/60 text-[11px] sm:text-xs uppercase tracking-[0.45em] font-semibold"
                    style={{ animationDelay: '320ms' }}
                >
                    Bar &amp; Cocina
                </p>

                <button
                    onClick={scrollToMenu}
                    className="animate-hero-fade cursor-pointer mt-4 bg-primary hover:bg-primary-dark text-white font-semibold text-xs uppercase tracking-widest px-7 py-3 rounded-full transition-colors duration-200 active:scale-95"
                    style={{
                        animationDelay: '440ms',
                        boxShadow: '0 4px 20px rgba(217,0,9,0.45)',
                    }}
                >
                    Ver el Menú
                </button>
            </div>

            {/* Flecha bounce */}
            <button
                onClick={scrollToMenu}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-arrow cursor-pointer text-white/40 hover:text-white/70 transition-colors"
                style={{ zIndex: 3 }}
                aria-label="Ir al menú"
            >
                <ChevronDown className="w-6 h-6" />
            </button>
        </section>
    );
}
