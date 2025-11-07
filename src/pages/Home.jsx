import React, { useEffect, useMemo, useState } from "react";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";
import CartBar from "../components/CartBar";
import CustomerModal from "../components/CustomerModal";
import menu from "../data/menu.json";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import Header from "../components/Header";


export default function Home() {
    const [cat, setCat] = useState("Todas");
    const categorias = useMemo(() => [...new Set(menu.map(m => m.categoria))], []);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const listado = menu.filter(p => cat === "Todas" || p.categoria === cat);

    const add = (p) => {
        setCart(prev => {
            const idx = prev.findIndex(x => x.id === p.id);
            if (idx > -1) {
                const cp = [...prev];
                cp[idx].cant++;
                return cp;
            }
            return [...prev, { ...p, cant: 1 }];
        });
    };

    const openCheckout = () => setOpenModal(true);

    return (
        <>



            <Header categorias={categorias} cat={cat} setCat={setCat} logo={logo} />

            <main className="mx-auto max-w-3xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listado.map(p => <ProductCard key={p.id} p={p} onAdd={add} />)}
            </main>

            <CartBar items={cart} onOpen={openCheckout} />
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
