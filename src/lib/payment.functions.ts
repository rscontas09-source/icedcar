import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { pixTotal, shipping, subtotal, UNIT_PRICE, PRIORITY_PRICE, PIX_DISCOUNT, isValidCPF } from "./order";

const custom = z.object({
  lado: z.string().min(1).max(30), tipo: z.string().min(1).max(40), marca: z.string().trim().min(1).max(60),
  modelo: z.string().trim().min(1).max(60), ano: z.string().trim().regex(/^\d{4}$/), cor: z.string().min(1).max(30),
  placa: z.string().trim().min(1).max(10), prioridade: z.boolean(),
});

const schema = z.object({
  order: z.object({ quantity: z.number().int().min(1).max(10), items: z.array(custom).min(1).max(10) }),
  payer: z.object({
    name: z.string().trim().min(5).max(100), email: z.string().trim().email().max(255),
    phone: z.string().regex(/^\d{10,11}$/), taxId: z.string().refine(isValidCPF, "CPF inválido"),
  }),
  address: z.object({
    zipCode: z.string().regex(/^\d{8}$/), state: z.string().length(2), city: z.string().min(2).max(80),
    district: z.string().min(1).max(80), street: z.string().min(2).max(120), number: z.string().min(1).max(10),
    complement: z.string().max(60).optional(),
  }),
});

export const createPixPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["MASTERFY_API_KEY"];
    if (!key) return { ok: false as const, error: "Pagamento ainda não configurado na loja." };
    const { order, payer, address } = data;
    const fee = shipping(order);
    const amount = pixTotal(order) - fee;
    const orderId = "ice_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const items = order.items.map((i) => ({
      quantity: 1,
      name: `Mini Cooler IcedCar - ${i.marca} ${i.modelo} ${i.ano} - ${i.placa}`.slice(0, 256),
      price: Math.round((UNIT_PRICE + (i.prioridade ? PRIORITY_PRICE : 0)) * (1 - PIX_DISCOUNT)),
      type: "PHYSICAL",
    }));
    const ip = (getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for") || "").split(",")[0]!.trim().slice(0, 45);
    const body = {
      amount, currency: "BRL", method: "PIX",
      description: `Pedido ${orderId} - Mini Cooler IcedCar`, externalRef: orderId,
      ...(ip ? { ip } : {}),
      payer: { name: payer.name, taxId: payer.taxId.replace(/\D/g, ""), email: payer.email, phone: "+55" + payer.phone },
      items,
      delivery: { fee, address: { country: "BR", state: address.state, city: address.city, district: address.district,
        street: address.street, number: address.number, complement: address.complement || undefined,
        zipCode: address.zipCode.replace(/(\d{5})(\d{3})/, "$1-$2") } },
      metadata: Object.fromEntries(Object.entries({ provider: "gelaki-icedcar", orderId, sellerTaxId: process.env["MASTERFY_SELLER_TAX_ID"], sellerEmail: process.env["MASTERFY_SELLER_EMAIL"] }).filter(([, v]) => v)),
    };
    void subtotal;
    try {
      const res = await fetch("https://api.masterfypagamentos.com/v1/payment", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { id?: string; amount?: number; data?: { copypaste?: string }; message?: string; code?: string; details?: unknown };
      if (!res.ok || !json.data?.copypaste) {
        console.error("Masterfy error", res.status, json.code, json.message, JSON.stringify(json.details ?? {}));
        return { ok: false as const, error: "Não foi possível gerar o PIX. Confira seus dados e tente novamente." };
      }
      return { ok: true as const, id: json.id ?? orderId, orderId, amount: (json.amount ?? amount) + fee, copypaste: json.data.copypaste };
    } catch (e) {
      console.error("Masterfy fetch failed", e);
      return { ok: false as const, error: "Falha de conexão com o pagamento. Tente novamente." };
    }
  });
