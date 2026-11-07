export const UNIT_PRICE = 7900; // centavos
export const PRIORITY_PRICE = 1490;
export const PIX_DISCOUNT = 0.05;
export const FREE_SHIPPING_FROM = 19900;
export const SHIPPING_FEE = 1990;

export type Customization = {
  lado: string;
  tipo: string;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  placa: string;
  prioridade: boolean;
};

export type Order = { quantity: number; items: Customization[] };

export const ORDER_KEY = "icedcar-order";

export function subtotal(order: Order) {
  return order.items.reduce((s, i) => s + UNIT_PRICE + (i.prioridade ? PRIORITY_PRICE : 0), 0);
}
export function shipping(order: Order) {
  return subtotal(order) >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}
export function pixTotal(order: Order) {
  return Math.round(subtotal(order) * (1 - PIX_DISCOUNT)) + shipping(order);
}
export function cardTotal(order: Order) {
  return subtotal(order) + shipping(order);
}
export const brl = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function isValidCPF(raw: string) {
  const c = raw.replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const calc = (n: number) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += Number(c[i]) * (n + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(c[9]) && calc(10) === Number(c[10]);
}
