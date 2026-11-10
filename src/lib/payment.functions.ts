import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { pixTotal, shipping, cardSubtotal, CARD_UNIT_PRICE, PRIORITY_PRICE, MAX_INSTALLMENTS, isValidCPF, isValidOrder, pixPrice, type Order } from "./order";
import { productBySlug } from "./catalog";

const API = "https://api.masterfypagamentos.com/v1";

const custom = z.object({
  lado: z.string().min(1).max(30), tipo: z.string().min(1).max(40), marca: z.string().trim().min(1).max(60),
  modelo: z.string().trim().min(1).max(60), ano: z.string().trim().regex(/^\d{4}$/), cor: z.string().min(1).max(30),
  placa: z.string().trim().min(1).max(10), prioridade: z.boolean(),
});

const base = z.object({
  order: z.object({ quantity: z.number().int().min(1).max(10), items: z.array(custom).max(10), product: z.string().max(80).optional() }).refine(isValidOrder, "Pedido inválido"),
  payer: z.object({
    name: z.string().trim().min(5).max(100), email: z.string().trim().email().max(255),
    phone: z.string().regex(/^\d{10,11}$/), taxId: z.string().refine(isValidCPF, "CPF inválido"),
  }),
  address: z.object({
    zipCode: z.string().regex(/^\d{8}$/), state: z.string().length(2), city: z.string().min(2).max(80),
    district: z.string().min(1).max(80), street: z.string().min(2).max(120), number: z.string().min(1).max(10),
    complement: z.string().max(60).optional(),
  }),
  utms: z.record(z.string().max(40), z.string().max(200)).optional(),
});
type Base = z.infer<typeof base>;

const cardSchema = base.extend({
  card: z.object({
    token: z.string().min(10).max(4000),
    installments: z.number().int().min(1).max(MAX_INSTALLMENTS),
    threeDS: z.record(z.string(), z.unknown()).optional(),
  }),
  returnUrl: z.string().url().max(500).optional(),
});

type MfResp = { id?: string; amount?: number; status?: string; data?: Record<string, unknown> & { copypaste?: string; message?: string; redirectUrl?: string }; message?: string; code?: string; details?: unknown };

/** Builds the Masterfy body; prices always come from order.ts, never from the browser. */
function buildBody(data: Base, method: "PIX" | "CREDIT_CARD", extraMeta: Record<string, string> = {}) {
  const { order, payer, address } = data;
  const fee = shipping(order as Order);
  const isPix = method === "PIX";
  const amount = isPix ? pixTotal(order as Order) - fee : cardSubtotal(order as Order);
  const orderId = "ice_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const prod = order.product ? productBySlug(order.product) : undefined;
  const items = prod
    ? [{ quantity: order.quantity, name: prod.name.slice(0, 256), price: isPix ? pixPrice(prod.price) : prod.price, type: "PHYSICAL" }]
    : order.items.map((i) => {
      const card = CARD_UNIT_PRICE + (i.prioridade ? PRIORITY_PRICE : 0);
      return { quantity: 1, name: `Mini Cooler IcedCar - ${i.marca} ${i.modelo} ${i.ano} - ${i.placa}`.slice(0, 256), price: isPix ? pixPrice(card) : card, type: "PHYSICAL" };
    });
  const sv = [process.env["MASTERFY_SELLER_TAX_ID"] ?? "", process.env["MASTERFY_SELLER_EMAIL"] ?? ""].map((v) => v.trim());
  const sellerEmail = sv.find((v) => v.includes("@")) ?? "";
  const sellerTax = (sv.find((v) => !v.includes("@")) ?? "").replace(/\D/g, "");
  const ip = ((getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for") || "").split(",")[0] ?? "").trim().slice(0, 45);
  const body = {
    amount, currency: "BRL", method,
    description: `Pedido ${orderId} - Mini Cooler IcedCar`, externalRef: orderId,
    ...(ip ? { ip } : {}),
    payer: { name: payer.name, taxId: payer.taxId.replace(/\D/g, ""), email: payer.email, phone: "+55" + payer.phone },
    items,
    delivery: { fee, address: { country: "BR", state: address.state, city: address.city, district: address.district,
      street: address.street, number: address.number, complement: address.complement || undefined,
      zipCode: address.zipCode.replace(/(\d{5})(\d{3})/, "$1-$2") } },
    metadata: Object.fromEntries(Object.entries({ provider: "gelaki-icedcar", orderId, sellerTaxId: sellerTax, sellerEmail, ...extraMeta }).filter(([, v]) => v)),
  };
  return { body, fee, amount, orderId };
}

async function record(data: Base, paymentId: string, method: "PIX" | "CARD", amount: number, fallback: string) {
  const { saveOrder } = await import("./orders.server");
  const n = await saveOrder({ paymentId, method, amount, name: data.payer.name, email: data.payer.email, cpf: data.payer.taxId,
    city: data.address.city, state: data.address.state, items: data.order.product ? [{ product: data.order.product, quantity: data.order.quantity }] : data.order.items, utms: data.utms });
  return n ?? fallback;
}

async function post(key: string, body: unknown) {
  const res = await fetch(`${API}/payment`, {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as MfResp;
  return { res, json };
}

export const createPixPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => base.parse(d))
  .handler(async ({ data }) => {
    const { connectpay } = await import("./connectpay.server");
    const { body, fee, amount, orderId } = buildBody(data, "PIX");
    const total = amount + fee;
    try {
      const r = await connectpay("/transactions", { method: "POST", body: {
        external_id: orderId, total_amount: total / 100, payment_method: "PIX",
        ip: body.ip || "127.0.0.1",
        customer: { name: data.payer.name, email: data.payer.email, document: data.payer.taxId.replace(/\D/g, ""), document_type: "CPF", phone: data.payer.phone },
        items: body.items.map((item, index) => ({ id: `${orderId}_${index}`, title: item.name, description: item.name, quantity: item.quantity, price: item.price / 100, is_physical: true })),
        webhook_url: "https://icedcar.lovable.app/api/public/connectpay-webhook",
      } });
      const pix = r["pix"] as { payload?: unknown } | undefined;
      if (typeof r["id"] !== "string" || typeof pix?.payload !== "string" || !pix.payload) throw new Error("Invalid ConnectPay PIX response");
      const id = "cp_" + r["id"];
      const number = await record(data, id, "PIX", total, orderId);
      return { ok: true as const, id, orderId: number, amount: total, copypaste: pix.payload };
    } catch (e) {
      console.error("ConnectPay pix failed", e);
      return { ok: false as const, error: "Não foi possível gerar o PIX. Confira seus dados e tente novamente." };
    }
  });

export const createCardPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => cardSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["MASTERFY_API_KEY"];
    if (!key) return { ok: false as const, error: "Pagamento ainda não configurado na loja." };
    const returnUrl = data.returnUrl?.startsWith("https://") ? data.returnUrl : "";
    const { body, fee, amount, orderId } = buildBody(data, "CREDIT_CARD", { returnUrl });
    const full = { ...body, card: { token: data.card.token, installments: data.card.installments, chargeInterest: false, ...(data.card.threeDS ? { threeDS: data.card.threeDS } : {}) } };
    try {
      const { res, json } = await post(key, full);
      if (!res.ok || !json.id) {
        console.error("Masterfy card error", res.status, json.code, json.message, JSON.stringify(json.details ?? {}));
        const refused = json.code?.includes("installments") ? "Parcelamento indisponível para este valor." : "Pagamento não aprovado. Confira os dados do cartão ou use outro cartão.";
        return { ok: false as const, error: refused };
      }
      if (json.status === "REFUSED") return { ok: false as const, error: "Cartão recusado pelo banco. Tente outro cartão ou pague no PIX." };
      // the whole response goes back so the 3DS SDK finish() can use it
      const number = await record(data, json.id, "CARD", (json.amount ?? amount) + fee, orderId);
      return { ok: true as const, id: json.id, orderId: number, status: json.status ?? "PROCESSING", amount: (json.amount ?? amount) + fee, response: JSON.stringify(json) };
    } catch (e) {
      console.error("Masterfy card fetch failed", e);
      return { ok: false as const, error: "Falha de conexão com o pagamento. Tente novamente." };
    }
  });

export const getPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().regex(/^(xp_[A-Za-z0-9_-]{1,160}|cp_[A-Fa-f0-9-]{36}|[a-z0-9]{10,40})$/), amount: z.number().int().positive().optional() }).parse(d))
  .handler(async ({ data }) => {
    const r = await checkProvider(data);
    if (r.status === "PAID" || r.status === "REFUSED") {
      const { markOrderStatus } = await import("./orders.server");
      await markOrderStatus(data.id, r.status);
    }
    return r;
  });

async function checkProvider(data: { id: string; amount?: number | undefined }): Promise<{ status: string }> {
  {
    if (data.id.startsWith("cp_")) {
      const tx = data.id.slice(3);
      try {
        const { connectpay, verifiedConnectpayStatus } = await import("./connectpay.server");
        const r = await connectpay(`/transactions/${encodeURIComponent(tx)}`);
        const st = verifiedConnectpayStatus(r, tx, (data.amount ?? 0) / 100);
        return { status: st === "paid" ? "PAID" : st === "failed" ? "REFUSED" : "PENDING" };
      } catch { return { status: "UNKNOWN" }; }
    }
    if (data.id.startsWith("xp_")) {
      const tx = data.id.slice(3);
      try {
        const { xpag, verifiedXpagStatus } = await import("./xpag.server");
        const r = await xpag(`/consult-transaction?transaction_id=${encodeURIComponent(tx)}`, { appKey: process.env["LOVABLE_API_KEY"], connectionKey: process.env["UDC_XPAG_API_KEY"] });
        const st = verifiedXpagStatus(r, tx, (data.amount ?? 0) / 100);
        return { status: st === "paid" ? "PAID" : st === "failed" ? "REFUSED" : "PENDING" };
      } catch { return { status: "UNKNOWN" }; }
    }
    const key = process.env["MASTERFY_API_KEY"];
    if (!key) return { status: "UNKNOWN" };
    try {
      const res = await fetch(`${API}/payment/${data.id}`, { headers: { Authorization: `Bearer ${key}` } });
      const json = (await res.json().catch(() => ({}))) as MfResp;
      return { status: res.ok ? json.status ?? "UNKNOWN" : "UNKNOWN" };
    } catch {
      return { status: "UNKNOWN" };
    }
  }
}

/** Publishable key used only to encrypt the card in the browser. */
export const getTokenizationKey = createServerFn({ method: "GET" }).handler(async () => ({ key: process.env["MASTERFY_TOKENIZATION_KEY"] ?? "" }));
