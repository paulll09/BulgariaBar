import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import CartBar from "../components/CartBar";
import CustomerModal from "../components/CustomerModal";
import Footer from "../components/Footer";
import CategoryChips from "../components/CategoryChips";
import Header from "../components/Header";

import menu from "../data/menu.json";
import logo from "../assets/logo.png";

// 🆕 Asegurate de colocar tu imagen de promoción en /src/assets/promocion.jpg (por ejemplo)
import promoImg from "../assets/promociones.png";

export default function Home() {
    const [cat, setCat] = useState("Todas");
    const categorias = useMemo(() => [...new Set(menu.map((m) => m.categoria))], []);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const listado = menu.filter((p) => cat === "Todas" || p.categoria === cat);

    const add = (p) => {
        setCart((prev) => {
            const idx = prev.findIndex((x) => x.id === p.id);
            if (idx > -1) {
                const cp = [...prev];
                cp[idx].cant++;
                return cp;
            }
            return [...prev, { ...p, cant: 1 }];
        });
    };

    return (
        <>
            {/* Header negro */}
            <Header logo={logo} />

            {/* Categorías con fondo blanco */}
            <div className="border-b border-gray-200">
                <CategoryChips
                    categorias={categorias}
                    activa={cat}
                    onChange={setCat}
                    sticky={false}
                />
            </div>

            {/* 🆕 Sección de Promociones */}
            <section className="bg-white py-4 px-4">
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">
                    Promociones
                </h2>

                <div className="max-w-3xl mx-auto">
                    <img
                        src={promoImg}
                        alt="Promociones del Bar"
                        className="w-full h-auto rounded-xl shadow-md object-cover"
                    />
                </div>
            </section>

            {/* Listado de productos */}
            <main className="mx-auto max-w-3xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                {listado.map((p, i) => (
                    <ProductCard key={p.id} p={p} onAdd={add} index={i} />
                ))}
            </main>


            <CartBar items={cart} onOpen={() => setOpenModal(true)} />
            <CustomerModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                items={cart}
                setCart={setCart}
            />

            <Footer />
        </>
    );
}
