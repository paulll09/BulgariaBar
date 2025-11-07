import React from "react";
import { ar$ } from "../utils/currency";

export default function ProductCard({ p, onAdd }) {
    return (
        <article
            className="rounded-xl bg-white shadow overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg duration-300 animate-fadeInUp">

            <div className="aspect-4/3 overflow-hidden bg-gray-100">
                <img
                    src={p.img}
                    alt={p.nombre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <div className="p-3">
                <h3
                    className="text-xl uppercase"
                    style={{ fontFamily: "var(--font-title)" }}
                >
                    {p.nombre}
                </h3>

                {/* Nueva línea: descripción */}
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {p.descripcion}
                </p>

                <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold">{ar$(p.precio)}</span>
                    <button
                        onClick={() => onAdd(p)}
                        className="px-3 py-1 rounded bg-black text-white text-sm"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </article>
    );
}
