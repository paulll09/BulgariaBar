import React, { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import CartBar from "../components/CartBar";
import CustomerModal from "../components/CustomerModal";
import menu from "../data/menu.json";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import Header from "../components/Header";

export default function Home() {
  const [cat, setCat] = useState("Todas");
  const categorias = useMemo(() => [...new Set(menu.map((m) => m.categoria))], []);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [openModal, setOpenModal] = useState(false);

  // 👉 Control de visibilidad del header con sentinel
  const [hideHeader, setHideHeader] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    // Cuando el sentinel sale del viewport, ocultamos el header (fade-out).
    const io = new IntersectionObserver(
      ([entry]) => {
        setHideHeader(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        // Ajustá este margen para adelantar o retrasar el fade:
        // p.ej. "-80px" empieza a ocultar antes; "-120px" aún antes.
        rootMargin: "-90px 0px 0px 0px",
      }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  const openCheckout = () => setOpenModal(true);

  return (
    <>
      {/* Header con fade controlado por sentinel */}
      <Header categorias={categorias} cat={cat} setCat={setCat} logo={logo} hidden={hideHeader} />

      {/* SENTINEL: va justo antes de la grilla → dispara el fade del header al salir de pantalla */}
      <div ref={sentinelRef} aria-hidden="true" />

      <main className="mx-auto max-w-3xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {listado.map((p) => (
          <ProductCard key={p.id} p={p} onAdd={add} />
        ))}
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
