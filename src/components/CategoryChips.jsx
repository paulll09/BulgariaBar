import React from "react";

export default function CategoryChips({ categorias, activa, onChange }) {
  return (
    <nav className="overflow-x-auto no-scrollbar p-3 bg-black text-white sticky top-0 z-50">
      <ul className="flex gap-2">
        {["Todas", ...categorias].map(cat => (
          <li key={cat}>
            <button
              onClick={() => onChange(cat)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                activa === cat ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"
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
