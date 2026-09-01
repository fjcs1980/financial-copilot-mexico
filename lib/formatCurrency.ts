/**
 * Formatea un número como moneda en pesos mexicanos (MXN).
 * Ejemplo: 15000 -> "$15,000.00" o "$15,000" según decimales.
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '$0.00';

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}