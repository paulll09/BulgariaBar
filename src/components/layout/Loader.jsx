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
            <img
                src="/images/logo.png"
                alt="Bulgaria"
                className="w-24 h-24 object-contain animate-loader-spin"
                draggable="false"
            />
        </div>
    );
}
