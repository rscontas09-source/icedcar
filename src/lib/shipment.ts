// Tracking timeline: each step unlocks by time elapsed since payment approval.
export type ShipEvent = { h: number; title: string; place: string };

const D = 24;
export const SHIP_EVENTS: ShipEvent[] = [
  { h: 0, title: "Pagamento aprovado e pedido confirmado", place: "Sistema IcedCar" },
  { h: 6, title: "Arte da personalização em preparação (carro e placa)", place: "Produção IcedCar" },
  { h: 1 * D + 10, title: "Personalização aplicada no seu mini cooler", place: "Produção IcedCar" },
  { h: 2 * D + 14, title: "Conferência de acabamento e embalagem protetora", place: "Produção IcedCar" },
  { h: 3 * D + 9, title: "Nota fiscal emitida e objeto coletado pela transportadora", place: "Centro de envio IcedCar" },
  { h: 5 * D + 8, title: "Chegada ao hub logístico para triagem de rota", place: "Hub logístico" },
  { h: 7 * D + 15, title: "Em trânsito para o seu estado", place: "Em trânsito" },
  { h: 10 * D + 9, title: "Chegada ao centro de distribuição do estado", place: "CD Regional · {UF}" },
  { h: 12 * D + 9, title: "Transferido para a unidade de entrega", place: "{CITY}/{UF}" },
  { h: 14 * D + 9, title: "Objeto saiu para entrega ao destinatário", place: "{CITY}/{UF}" },
];
export const DELIVERY_DAYS = 15;

export function trackingCode(orderNumber: string) {
  const digits = orderNumber.replace(/\D/g, "").padStart(9, "0").slice(-9);
  return `IC${digits}BR`;
}

export function shipmentState(paidAt: string | Date, now: Date = new Date()) {
  const start = new Date(paidAt).getTime();
  const elapsedH = (now.getTime() - start) / 36e5;
  const done = SHIP_EVENTS.filter((e) => e.h <= elapsedH).map((e) => ({ ...e, at: new Date(start + e.h * 36e5) }));
  const next = SHIP_EVENTS.find((e) => e.h > elapsedH) ?? null;
  const last = SHIP_EVENTS[SHIP_EVENTS.length - 1]!.h;
  const progress = Math.min(100, Math.round((Math.max(0, elapsedH) / last) * 100));
  return { done, next, progress, eta: new Date(start + DELIVERY_DAYS * 864e5) };
}

export const fillPlace = (p: string, city?: string | null, uf?: string | null) =>
  p.replace("{CITY}", city || "Sua cidade").replace(/\{UF\}/g, uf || "BR");
