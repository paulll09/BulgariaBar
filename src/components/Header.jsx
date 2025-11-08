import React, { useEffect, useState } from "react";

/**
 * Header que se desplaza hacia arriba al hacer scroll (sin animaciones raras).
 * - No usa opacity ni transitions de Tailwind.
 * - Se mueve de forma natural con la página.
 * - Ideal para móviles: sin parpadeos ni bugs.
 */

export default function Header({ logo }) {
  const [offset, setOffset] = useState(0);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const diff = current - lastScroll;

      // Si baja, movemos el header hacia arriba hasta un máximo (por ejemplo 100px)
      if (diff > 0 && current > 50) {
        setOffset((prev) => Math.min(prev + diff, 100));
      } else {
        // Si sube, lo traemos de vuelta
        setOffset((prev) => Math.max(prev - Math.abs(diff), 0));
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <header
      className="bg-black text-white sticky top-0 z-50"
      style={{
        transform: `translateY(-${offset}px)`,
      }}
    >
      <div className="mx-auto max-w-3xl px-4">
        <a href="/" aria-label="Ir al inicio" className="block h-20 sm:h-24 md:h-28">
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={logo}
              alt="Bulgaria Bar"
              className="h-[130%] w-auto object-contain max-w-85vw"
            />
          </div>
        </a>
      </div>
    </header>
  );
}
