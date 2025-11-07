    const TELEFONO_COCINA = "5493794XXXXXX"; // <-- reemplazá por el nro real (sin + ni 0)

export function buildWhatsAppUrl({ items, modalidad, cliente }) {
  const total = items.reduce((a, i) => a + i.precio * i.cant, 0);

  const lineas = [
    "*Nuevo pedido*",
    `Modalidad: ${modalidad}`,
    "-----------------------",
    ...items.map(i => `• ${i.nombre} x${i.cant} (${i.precio})`),
    "-----------------------",
    `Total: ${total}`,
    "",
    "*Datos cliente*",
    `Nombre: ${cliente?.nombre || "-"}`,
    `Tel: ${cliente?.tel || "-"}`,
    ...(modalidad === "Envío a domicilio" ? [`Dirección: ${cliente?.direccion || "-"}`] : []),
    `Notas: ${cliente?.notas || "-"}`
  ];

  const msg = encodeURIComponent(lineas.join("\n"));
  return `https://wa.me/${TELEFONO_COCINA}?text=${msg}`;
}
