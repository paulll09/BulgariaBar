import { useEffect, useState } from 'react';

export default function Loader() {
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setHiding(true), 1400);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
                background: '#000',
                transition: 'opacity 0.5s ease',
                opacity: hiding ? 0 : 1,
                pointerEvents: hiding ? 'none' : 'all',
            }}
        >
            <div className="flex flex-col items-center">
                <img
                    src="/images/logo.png"
                    alt="Bulgaria"
                    className="w-24 h-24 object-contain animate-loader-bounce"
                    draggable="false"
                />
                <p className="mt-5 text-white/50 text-xs font-display tracking-[0.35em] uppercase">Cargando Menú</p>
            </div>
        </div>
    );
}
