import Navbar from './Navbar';
import Footer from './Footer';
import PatternBackground from './PatternBackground';

export default function Layout({ children }) {
    return (
        <div className="relative min-h-screen flex flex-col bg-background text-text selection:bg-primary/20 selection:text-secondary">
            <PatternBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow w-full">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
