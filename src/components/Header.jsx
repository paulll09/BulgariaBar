import React, { useEffect, useState } from "react";
import CategoryChips from "./CategoryChips";

export default function Header({ categorias, cat, setCat, logo }) {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Solo aplicar el efecto en pantallas pequeñas
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Desliza hacia abajo → ocultar
          setVisible(false);
        } else {
          // Desliza hacia arriba → mostrar
          setVisible(true);
        }
      } else {
        setVisible(true); // en escritorio siempre visible
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`bg-black text-white sticky top-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 flex flex-col items-center justify-center">
        {/* Logo centrado */}
        <a
          href="/"
          aria-label="Ir al inicio"
          className="block h-20 sm:h-24 md:h-28"
        >
          <div className="h-full flex items-center justify-center">
            <img
              src={logo}
              alt="Bulgaria Bar"
              className="h-full w-auto object-contain max-w-[75vw]"
            />
          </div>
        </a>
      </div>

      {/* Chips de categorías */}
      <div className="bg-black">
        <CategoryChips categorias={categorias} activa={cat} onChange={setCat} />
      </div>
    </header>
  );
}
