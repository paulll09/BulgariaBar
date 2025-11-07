import React, { useEffect, useMemo, useState } from "react";
import { ar$ } from "../utils/currency";
import { buildWhatsAppUrl } from "../utils/whatsapp";

export default function CustomerModal({ open, onClose, items, setCart }) {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);
  const [modalidad, setModalidad] = useState("Retirar");
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("cliente");
    return saved ? JSON.parse(saved) : { nombre: "", tel: "", direccion: "", notas: "" };
  });

  // Montaje/desmontaje controlado para animar salida
  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
      // bloquear scroll de fondo
      document.body.style.overflow = "hidden";
    } else if (visible) {
      setClosing(true);
      const t = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = ""; // restaurar
      }, 220); // coincide con .22s de modalOut
      return () => clearTimeout(t);
    }
  }, [open, visible]);

  useEffect(() => {
    localStorage.setItem("cliente", JSON.stringify(form));
  }, [form]);

  const total = useMemo(
    () => items.reduce((a, i) => a + i.precio * i.cant, 0),
    [items]
  );

  if (!visible) return null;

  const inc = (id) => setCart(prev => prev.map(it => it.id === id ? { ...it, cant: it.cant + 1 } : it));
  const dec = (id) => setCart(prev =>
    prev.map(it => it.id === id ? { ...it, cant: Math.max(0, it.cant - 1) } : it).filter(it => it.cant > 0)
  );
  const delItem = (id) => setCart(prev => prev.filter(it => it.id !== id));
  const clear = () => setCart([]);

  const enviar = () => {
    if (!form.tel.trim()) { alert("Ingresá un teléfono de contacto."); return; }
    if (modalidad === "Envío a domicilio" && !form.direccion.trim()) {
      alert("Ingresá la dirección para el envío."); return;
    }
    const url = buildWhatsAppUrl({ items, modalidad, cliente: form });
    window.open(url, "_blank");
    handleClose();
  };

  const handleClose = () => {
    setClosing(true);
    const t = setTimeout(() => {
      setVisible(false);
      onClose?.();
      document.body.style.overflow = "";
    }, 220);
    return () => clearTimeout(t);
  };

  return (
    <div
      className={`fixed inset-0 z-60 flex items-end sm:items-center justify-center ${
        closing ? "animate-overlayOut" : "animate-overlayIn"
      } bg-black/60`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-4 shadow-lg ${
          closing ? "animate-modalOut" : "animate-modalIn"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tu pedido</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        {/* Modalidad dentro del carrito */}
        <div className="mt-3 rounded-lg border p-3">
          <span className="text-sm font-semibold">Modalidad</span>
          <div className="mt-2 flex gap-4 text-sm">
            <label className="flex items-center gap-1">
              <input type="radio" name="mod" value="Retirar"
                checked={modalidad === "Retirar"} onChange={e=>setModalidad(e.target.value)} />
              Retirar
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="mod" value="Envío a domicilio"
                checked={modalidad === "Envío a domicilio"} onChange={e=>setModalidad(e.target.value)} />
              Envío a domicilio
            </label>
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-3 rounded-lg border p-3 max-h-[35vh] overflow-y-auto">
          <h3 className="font-semibold mb-2">Resumen</h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">El carrito está vacío.</p>
          ) : (
            <ul className="text-sm space-y-2">
              {items.map(i => (
                <li key={i.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{i.nombre}</div>
                    <div className="text-gray-600">{ar$(i.precio)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => dec(i.id)} className="w-8 h-8 rounded border">-</button>
                    <span className="w-6 text-center">{i.cant}</span>
                    <button onClick={() => inc(i.id)} className="w-8 h-8 rounded border">+</button>
                    <button onClick={() => delItem(i.id)} className="ml-1 text-xs text-red-600">Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 border-t pt-2 flex items-center justify-between font-semibold">
            <span>Total</span><span>{ar$(total)}</span>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="mt-2 text-xs text-gray-600 underline">
              Vaciar carrito
            </button>
          )}
        </div>

        {/* Datos del cliente — inputs en 16px para evitar zoom */}
        <div className="mt-3 space-y-2">
          <label className="block text-sm">
            Nombre
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base"
              value={form.nombre}
              onChange={e=>setForm(f=>({...f, nombre:e.target.value}))}
            />
          </label>
          <label className="block text-sm">
            Teléfono
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base"
              inputMode="tel"
              value={form.tel}
              onChange={e=>setForm(f=>({...f, tel:e.target.value}))}
            />
          </label>
          {modalidad === "Envío a domicilio" && (
            <label className="block text-sm">
              Dirección
              <input
                className="mt-1 w-full border rounded px-3 py-2 text-base"
                value={form.direccion}
                onChange={e=>setForm(f=>({...f, direccion:e.target.value}))}
              />
            </label>
          )}
          <label className="block text-sm">
            Notas (sin pepino, piso 2, etc.)
            <textarea
              className="mt-1 w-full border rounded px-3 py-2 text-base"
              rows={2}
              value={form.notas}
              onChange={e=>setForm(f=>({...f, notas:e.target.value}))}
            />
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={handleClose} className="flex-1 px-4 py-2 rounded border">
            Volver
          </button>
          <button
            onClick={enviar}
            disabled={items.length === 0}
            className="flex-1 px-4 py-2 rounded bg-black text-white disabled:opacity-60"
          >
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
