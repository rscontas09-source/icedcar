const BASE = "https://api.connectpay.vc/v1";

export async function connectpay(path: string, init: { method?: string; body?: unknown } = {}) {
  const secret = process.env["CONNECTPAY_API_SECRET"];
  if (!secret) throw new Error("ConnectPay not configured");
  const res = await fetch(BASE + path, {
    method: init.method ?? "GET",
    headers: { "api-secret": secret, "Content-Type": "application/json" },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok || json["hasError"]) {
    console.error("ConnectPay error", res.status, json["error"], JSON.stringify(json["errorFields"] ?? []));
    throw new Error("connectpay_failed");
  }
  return json;
}

/** Paid only when ConnectPay says AUTHORIZED, the id matches and the amount equals what we charged. */
export function verifiedConnectpayStatus(r: Record<string, unknown>, id: string, expectedReais: number) {
  const status = String(r["status"] ?? "");
  const amount = Number(r["amount"] ?? r["total_value"] ?? NaN);
  if (status === "AUTHORIZED") {
    if (r["id"] === id && expectedReais > 0 && Math.abs(amount - expectedReais) < 0.005) return "paid";
    return "pending";
  }
  if (status === "FAILED") return "failed";
  return "pending";
}
