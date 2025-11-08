import React from "react";
import { ar$ } from "../utils/currency";
import { ShoppingCart } from "lucide-react";
import useInView from "../hooks/useInView";

export default function ProductCard({ p, onAdd, index = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.18 });

  return (
    <article
      ref={ref}
      className={`rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden
        transform transition duration-500 ease-out
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{
        transitionDelay: `${Math.min(index * 70, 280)}ms`,
        willChange: "transform, opacity",
      }}
    >
      <div className="relative aspect-4/3 bg-gray-100">
        <img
          src={p.img}
          alt={p.nombre}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />

        {/* Precio chip */}
        <div className="absolute left-2 top-2">
          <span className="rounded-full bg-black/80 text-white text-xs px-3 py-1">
            {ar$(p.precio)}
          </span>
        </div>

        {/* Botón flotante */}
        <button
          onClick={() => onAdd(p)}
          className="absolute right-2 bottom-2 rounded-full bg-black text-white w-10 h-10 grid place-items-center active:scale-95"
          aria-label={`Agregar ${p.nombre}`}
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3">
        <h3
          className="text-base font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-title)" }}
        >
          {p.nombre}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.descripcion}</p>
      </div>
    </article>
  );
}
