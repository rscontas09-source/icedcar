import { productBySlug } from "./catalog";

export const CARD_UNIT_PRICE = 9900; // preço original (cartão), centavos
export const UNIT_PRICE = CARD_UNIT_PRICE; // PIX aplica o desconto sobre o preço original
export const MAX_INSTALLMENTS = 12;
export const PRIORITY_PRICE = 1490;
export const PIX_DISCOUNT = 0.1;
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

/** Personalized IcedCar orders use items; ready-made catalog orders set product and leave items empty. */
export type Order = { quantity: number; items: Customization[]; product?: string | undefined };

export const isValidOrder = (o: Order) => o.product ? !!productBySlug(o.product) && o.items.length === 0 : o.items.length > 0;
export const pixPrice = (card: number) => Math.round(card * (1 - PIX_DISCOUNT));

export const ORDER_KEY = "icedcar-order";

/** Original (card) price of the whole order before shipping. */
export function subtotal(order: Order) {
  if (order.product) return (productBySlug(order.product)?.price ?? 0) * order.quantity;
  return order.items.reduce((s, i) => s + CARD_UNIT_PRICE + (i.prioridade ? PRIORITY_PRICE : 0), 0);
}
export function shipping(order: Order) {
  return subtotal(order) >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}
export function pixTotal(order: Order) {
  return pixPrice(subtotal(order)) + shipping(order);
}
export function cardSubtotal(order: Order) {
  return subtotal(order);
}
export function cardTotal(order: Order) {
  return cardSubtotal(order) + shipping(order);
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
