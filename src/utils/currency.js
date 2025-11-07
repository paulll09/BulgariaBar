export const ar$ = n =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);
