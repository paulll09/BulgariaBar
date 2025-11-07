import React from "react";
import { ar$ } from "../utils/currency";
import { ShoppingBag } from "lucide-react"; // librería de íconos

export default function CartBar({ items, onOpen }) {
  const total = items.reduce((a, i) => a + i.precio * i.cant, 0);
  const qty = items.reduce((a, i) => a + i.cant, 0);
  if (!qty) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fadeInUp">
      <button
        onClick={onOpen}
        className="relative w-14 h-14 rounded-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center shadow-lg transition active:scale-95"
      >
        <ShoppingBag size={26} />
        {/* Cantidad de ítems */}
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border border-white">
          {qty}
        </span>
      </button>
    </div>
  );
}
