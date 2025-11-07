import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col items-center text-center gap-3">
        <h2 className="text-2xl font-semibold tracking-wide" style={{ fontFamily: "var(--font-title)" }}>
          BulgariaBar
        </h2>
        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} BulgariaBar — Todos los derechos reservados
        </p>

        <div className="flex gap-5 mt-3">
          <a href="https://wa.me/5493794XXXXXX" target="_blank" rel="noopener noreferrer"
             className="hover:text-red-500 transition">WhatsApp</a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer"
             className="hover:text-red-500 transition">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
