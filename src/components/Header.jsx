import React, { useEffect, useState } from "react";
import CategoryChips from "./CategoryChips"; // importa tus categorías

function Header({ categorias, cat, setCat, logo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-black text-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-1" : "py-3"
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 flex flex-col items-center justify-center transition-all duration-300">
        {/* Logo centrado y clickeable */}
        <a href="/" className="flex items-center justify-center" aria-label="Ir al inicio">
          <img
            src={logo}
            alt="Bulgaria Bar"
            className={`object-contain w-auto transition-all duration-300 ${
              scrolled
                ? "h-16 sm:h-20 md:h-24 scale-95"
                : "h-28 sm:h-32 md:h-36 scale-100"
            }`}
          />
        </a>
      </div>

      {/* Chips de categorías */}
      <div className="mt-1">
        <CategoryChips categorias={categorias} activa={cat} onChange={setCat} />
      </div>
    </header>
  );
}

export default Header;
