import { useContext } from 'react';
import HeroSection from '../components/layout/HeroSection';
import PromoCarousel from '../components/menu/PromoCarousel';
import Menu from '../components/menu/Menu';
import ClosedOverlay from '../components/layout/ClosedOverlay';
import { BarCtx } from '../context/barCtx';

export default function HomePage() {
    const { isOpen, schedule } = useContext(BarCtx);
    const showOverlay = !isOpen && schedule !== null;

    return (
        <>
            {showOverlay && <ClosedOverlay schedule={schedule} />}
            <HeroSection />
            <PromoCarousel />
            <Menu />
        </>
    );
}
