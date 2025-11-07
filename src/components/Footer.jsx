import React from "react";
import { Instagram, MapPin, MessageCircle } from "lucide-react"; // íconos modernos

function Footer() {
  return (
    <footer className="bg-black text-white mt-10 pb-6">
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col items-center text-center gap-4">
        {/* Nombre del bar */}
        <h2
          className="text-2xl font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-title)" }}
        >
          BULGARIABAR
        </h2>

        {/* Ubicación */}
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <MapPin size={18} className="text-red-600" />
          <span>Av. San Martin - Las Lomitas</span>
        </div>

        {/* Íconos de redes */}
        <div className="flex gap-6 mt-3">
          {/* WhatsApp */}
          <a
            href="https://wa.me/5493794XXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition"
          >
            <MessageCircle size={26} />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition"
          >
            <Instagram size={26} />
          </a>
        </div>

        {/* Texto de derechos */}
        <p className="text-sm text-gray-400 mt-3">
          © {new Date().getFullYear()} BulgariaBar — Todos los derechos reservados
        </p>
      </div>

    
      {/* Franja negra para eliminar borde blanco */}
      <div className="h-6 w-full bg-black"></div>
    </footer>
  );
}

export default Footer;
