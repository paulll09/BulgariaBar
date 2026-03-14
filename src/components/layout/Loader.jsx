import { useEffect, useState } from 'react';

export default function Loader() {
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setHiding(true), 1600);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
            style={{
                transition: 'opacity 0.5s ease',
                opacity: hiding ? 0 : 1,
                pointerEvents: hiding ? 'none' : 'all',
            }}
        >
            <img
                src="/images/logo.png"
                alt="Bulgaria"
                className="w-20 h-20 object-contain animate-loader-spin"
                draggable="false"
            />
            <h1
                className="font-display font-bold text-text uppercase mt-4 animate-hero-fade"
                style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', animationDelay: '200ms' }}
            >
                Bulgaria
            </h1>
            <p className="text-text-dim text-[10px] uppercase tracking-[0.45em] font-semibold mt-1 animate-hero-fade"
               style={{ animationDelay: '350ms' }}>
                Bar &amp; Cocina
            </p>
        </div>
    );
}
