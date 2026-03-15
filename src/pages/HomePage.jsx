import HeroSection from '../components/layout/HeroSection';
import Menu from '../components/menu/Menu';
import ClosedOverlay from '../components/layout/ClosedOverlay';
import { useSchedule } from '../hooks/useSchedule';

export default function HomePage() {
    const { schedule, loading, isOpen } = useSchedule();
    const showOverlay = !loading && !isOpen && schedule !== null;

    return (
        <>
            {showOverlay && <ClosedOverlay schedule={schedule} />}
            <HeroSection />
            <Menu />
        </>
    );
}
