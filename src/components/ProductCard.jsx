import React from "react";
import { ar$ } from "../utils/currency";
import { ShoppingCart } from "lucide-react";
import useInView from "../hooks/useInView";

export default function ProductCard({ p, onAdd, index = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <article
      ref={ref}
      className={`bg-black text-white rounded-3xl overflow-hidden transform transition duration-700 ease-out shadow-lg
        ${inView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      style={{ transitionDelay: `${Math.min(index * 80, 400)}ms` }}
    >
      <div className="relative h-72 bg-gray-900">
        <img src={p.img} alt={p.nombre} className="w-full h-full object-cover opacity-90" />
        <div className="absolute left-3 top-3 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
          {ar$(p.precio)}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-title)" }}>
          {p.nombre}
        </h3>
        <p className="text-sm text-gray-200 mt-2 line-clamp-2">{p.descripcion}</p>
        <button
          onClick={() => onAdd(p)}
          className="mt-4 w-full py-3 bg-transparent border border-white rounded-xl text-white font-medium hover:bg-white hover:text-black transition-all active:scale-95"
        >
          <ShoppingCart className="inline-block w-4 h-4 mr-2" />
          Agregar al pedido
        </button>
      </div>
    </article>
  );
}
