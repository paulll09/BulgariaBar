import React from "react";
import {
  Utensils,
  Coffee,
  Pizza,
  Beer,
  Home,
} from "lucide-react";
import HamburguesaIcon from "../assets/icons/burger.svg";
import SandwichIcon from "../assets/icons/sandwich.svg";
import ParaCompartirIcon from "../assets/icons/paraCompartir.svg"
/**
 * CategoryChips con íconos personalizados 🍔🥪
 * ---------------------------------------------
 * - Incluye íconos locales .svg (hamburguesa y sandwich)
 * - Diseño moderno, limpio y responsive
 * - Contraste claro sobre fondo blanco
 */

export default function CategoryChips({ categorias, activa, onChange, sticky = true }) {
  // Íconos por categoría
  const iconos = {
    Todas: <Home className="w-4 h-4" />,
    Hamburguesas: <img src={HamburguesaIcon} alt="Hamburguesa" className="w-5 h-5" />,
    Bebidas: <Beer className="w-4 h-4" />,
    Pizzas: <Pizza className="w-4 h-4" />,
    Lomitos: <Utensils className="w-4 h-4" />,
    Sandwiches: <img src={SandwichIcon} alt="Sandwich" className="w-5 h-5" />,
    ParaCompartir: <img src={ParaCompartirIcon} alt="paraCompartir" className="w-5 h-5" />,
  };

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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm
                ${
                  activa === cat
                    ? "bg-black text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md"
                }`}
            >
              {/* Render del ícono según la categoría */}
              {iconos[cat] || <Utensils className="w-4 h-4" />}
              <span>{cat}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
