import { z } from "zod";

type Credentials = { appKey: string | undefined; connectionKey: string | undefined };

export async function xpag(path: string, credentials: Credentials, body?: Record<string, unknown>) {
  if (!credentials.appKey || !credentials.connectionKey) throw new Error("Pagamento XPag não configurado.");
  const response = await fetch(`https://connector-gateway.lovable.dev/udc_xpag${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${credentials.appKey}`, "X-Connection-Api-Key": credentials.connectionKey, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json() as Record<string, unknown>;
  if (!response.ok || result["ok"] !== true) {
    console.error("XPag request failed", { status: response.status, code: result["error_code"] });
    throw new Error("A XPag não conseguiu processar o pagamento agora. Tente novamente mais tarde.");
  }
  return result;
}

const chargeSchema = z.object({
  transaction_id: z.string().min(1).max(160).optional(),
  request_number: z.string().min(1).max(160).optional(),
  copyPaste: z.string().min(20).max(10000),
}).refine((r) => r.transaction_id || r.request_number);

export function parseXpagCharge(result: Record<string, unknown>) {
  const charge = chargeSchema.safeParse(result);
  if (!charge.success) throw new Error("A XPag não retornou um código PIX válido. Tente novamente mais tarde.");
  const id = charge.data.transaction_id ?? charge.data.request_number;
  if (!id) throw new Error("Identificador PIX indisponível.");
  return { id, code: charge.data.copyPaste };
}

export function verifiedXpagStatus(result: Record<string, unknown>, id: string, amount: number) {
  if (result["ok"] !== true || result["type"] !== "cashin" ||
      (result["transaction_id"] !== id && result["request_number"] !== id) ||
      typeof result["amount"] !== "number" || Math.round(result["amount"] * 100) !== Math.round(amount * 100) ||
      (result["currency"] !== undefined && result["currency"] !== "BRL")) return null;
  if (result["status"] === "confirmed" || result["status"] === "completed") return "paid";
  if (result["status"] === "failed" || result["status"] === "expired") return "failed";
  return null;
}