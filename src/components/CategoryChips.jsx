import React from "react";

/**
 * CategoryChips mejorado .
 * -----------------------
 * - Fondo claro (blanco) debajo del header.
 * - Botones con diseño moderno, suave y agradable.
 * - Efecto hover y activo con sombras y transiciones.
 */

export default function CategoryChips({ categorias, activa, onChange, sticky = true }) {
  return (
    <nav
      className={`overflow-x-auto no-scrollbar p-4 bg-white ${
        sticky ? "sticky top-0 z-40" : ""
      }`}
    >
      <ul className="flex gap-3 justify-center flex-wrap">
        {["Todas", ...categorias].map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm
                ${
                  activa === cat
                    ? "bg-black text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md"
                }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
