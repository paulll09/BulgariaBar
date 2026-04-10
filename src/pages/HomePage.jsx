import { useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import HeroSection from '../components/layout/HeroSection';
import PromoCarousel from '../components/menu/PromoCarousel';
import Menu from '../components/menu/Menu';
import ClosedOverlay from '../components/layout/ClosedOverlay';
import { BarCtx } from '../context/barCtx';
import { useProducts } from '../hooks/useProducts';
import { MotionDiv, fadeUp, popIn, lineStagger, lineSlideUp, VIEWPORT } from '../lib/motion';

export default function HomePage() {
    const { isOpen, schedule } = useContext(BarCtx);
    const showOverlay = !isOpen && schedule !== null;
    const { products, categories, loading, error, refetch } = useProducts(false);

    return (
        <>
            {showOverlay && <ClosedOverlay schedule={schedule} />}
            <HeroSection />

            {/* ── Sección de texto premium — fondo negro ── */}
            <section className="bg-black py-20 sm:py-24 px-6 -mb-px">
                <div className="text-center max-w-3xl mx-auto">

                    {/* Título — staggered slide-up por línea */}
                    <motion.h2
                        className="font-display font-bold uppercase leading-[1.05] mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={VIEWPORT}
                        variants={lineStagger}
                    >
                        <motion.span
                            className="block text-white text-4xl sm:text-5xl md:text-6xl"
                            variants={lineSlideUp}
                        >
                            ¡El mejor lugar
                        </motion.span>
                        <motion.span
                            className="block text-primary text-4xl sm:text-5xl md:text-6xl mt-1"
                            variants={lineSlideUp}
                        >
                            para comer!
                        </motion.span>
                    </motion.h2>

                    {/* Párrafo — fade-in + slide-up */}
                    <MotionDiv variants={fadeUp}>
                        <p className="font-headline italic text-white text-2xl sm:text-3xl leading-snug max-w-lg mx-auto mb-6">
                            Buscás comer rico y bien? Acá tenés de todo: lomitos, pizzas y
                            hamburguesas tremendas.
                        </p>
                    </MotionDiv>

                    {/* ── Ubicación + Horarios — integrado ── */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-0 mt-12 mb-12 max-w-xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={VIEWPORT}
                        variants={lineStagger}
                    >
                        {/* Dónde estamos */}
                        <motion.div
                            variants={lineSlideUp}
                            className="flex flex-col items-center gap-2.5 px-8 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />
                                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.25em]">
                                    Dónde estamos
                                </span>
                            </div>
                            <p className="font-display font-bold uppercase text-white text-xl sm:text-2xl leading-none tracking-wide">
                                Av. San Martín y Curesti
                            </p>
                            <p className="font-display font-normal uppercase text-white text-base leading-none tracking-wider">
                                Las Lomitas, Formosa
                            </p>
                        </motion.div>

                        {/* Divisor — vertical en desktop, horizontal en mobile */}
                        <motion.div
                            variants={fadeUp}
                            className="hidden sm:block w-px h-16 self-center"
                            style={{ background: 'rgba(255,255,255,0.15)' }}
                        />
                        <div
                            className="block sm:hidden w-12 h-px my-3"
                            style={{ background: 'rgba(255,255,255,0.15)' }}
                        />

                        {/* Horarios */}
                        <motion.div
                            variants={lineSlideUp}
                            className="flex flex-col items-center gap-2.5 px-8 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />
                                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.25em]">
                                    Horarios
                                </span>
                            </div>
                            <p className="font-display font-bold uppercase text-white text-xl sm:text-2xl leading-none tracking-wide">
                                Jue — Dom · 20:00 — 00:00
                            </p>
                            <p className="font-display font-normal uppercase text-white text-base leading-none tracking-wider">
                                Lun — Mié · Cerrado
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Línea final — pop-in con escala */}
                    <MotionDiv variants={popIn}>
                        <p className="font-display font-bold uppercase text-white text-2xl sm:text-3xl leading-tight tracking-wide">
                            No te quedes con las ganas, pasá por{' '}
                            <span className="text-primary">
                                Bulgaria Bar
                            </span>
                            .
                        </p>
                    </MotionDiv>
                </div>
            </section>

            <PromoCarousel />

            <Menu
                products={products}
                categories={categories}
                loading={loading}
                error={error}
                refetch={refetch}
            />
        </>
    );
}
