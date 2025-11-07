import React from "react";
import CategoryChips from "./CategoryChips";

export default function Header({ categorias, cat, setCat, logo, hidden = false }) {
  return (
    <header
      className={`bg-black text-white sticky top-0 z-50 transition-all duration-400 ease-out
        ${hidden ? "opacity-0 -translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"}
      `}
    >
      {/* Barra superior con logo centrado ocupando la altura */}
      <div className="mx-auto max-w-3xl px-4">
        <a href="/" aria-label="Ir al inicio" className="block h-20 sm:h-24 md:h-28">
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={logo}
              alt="Bulgaria Bar"
              className="h-[130%] w-auto object-contain max-w-[85vw] scale-105"
            />
          </div>
        </a>
      </div>

      {/* Banda de categorías (no-sticky porque ya estamos dentro de un header sticky) */}
      <div className="bg-black border-b border-white/10">
        <CategoryChips
          categorias={categorias}
          activa={cat}
          onChange={setCat}
          sticky={false}
        />
      </div>
    </header>
  );
}
