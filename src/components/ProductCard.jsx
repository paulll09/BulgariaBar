import React from "react";
import { ar$ } from "../utils/currency";
import { ShoppingCart } from "lucide-react";
import useInView from "../hooks/useInView";

export default function ProductCard({ p, onAdd, index = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <article
      ref={ref}
      className={`bg-white rounded-3xl shadow-md ring-1 ring-gray-200 overflow-hidden transform transition duration-700 ease-out
        ${inView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      style={{
        transitionDelay: `${Math.min(index * 80, 400)}ms`,
      }}
    >
      <div className="relative h-64 sm:h-72 bg-gray-100">
        <img
          src={p.img}
          alt={p.nombre}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 rounded-full bg-black/80 text-white text-xs px-3 py-1">
          {ar$(p.precio)}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-title)" }}>
          {p.nombre}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.descripcion}</p>
        <button
          onClick={() => onAdd(p)}
          className="mt-4 w-full py-3 bg-black text-white rounded-xl font-medium active:scale-95 transition-all"
        >
          <ShoppingCart className="inline-block w-4 h-4 mr-2" />
          Agregar al pedido
        </button>
      </div>
    </article>
  );
}
