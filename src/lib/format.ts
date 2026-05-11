export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const num = digits.startsWith("55") ? digits : `55${digits}`;
  const msg = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${msg}`;
}

export function calculateCommission(totalSales: number, monthlyGoal: number): {
  rate: number;
  value: number;
  bonus: number;
} {
  const rate = totalSales <= 50000 ? 0.04 : 0.06;
  const value = totalSales * rate;
  const bonus = totalSales > monthlyGoal ? totalSales * 0.005 : 0;
  return { rate, value, bonus };
}

export function calculateDiscount(
  subtotal: number,
  paymentCondition: string
): { percent: number; value: number } {
  let percent = 0;
  if (paymentCondition === "a_vista") percent = 0.03;
  if (subtotal >= 100000) percent = Math.max(percent, 0.05);
  return { percent, value: subtotal * percent };
}
