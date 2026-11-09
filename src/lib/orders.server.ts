// Server-only order storage; numbers come from a database sequence (PEDIDO21010001, ...).
type NewOrder = {
  paymentId: string; method: "PIX" | "CARD"; amount: number;
  name: string; email: string; cpf: string; city: string; state: string;
  items: unknown; utms?: Record<string, string> | undefined;
};

export async function saveOrder(o: NewOrder): Promise<string | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("orders").insert({
      payment_id: o.paymentId, method: o.method, amount: o.amount,
      customer_name: o.name, customer_email: o.email.trim().toLowerCase(), customer_cpf: o.cpf.replace(/\D/g, ""),
      city: o.city, state: o.state, items: o.items as never, utms: (o.utms ?? {}) as never,
    }).select("order_number").single();
    if (error) { console.error("saveOrder", error.message); return null; }
    return data.order_number;
  } catch (e) { console.error("saveOrder failed", e); return null; }
}

export async function markOrderStatus(paymentId: string, status: "PAID" | "REFUSED") {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch = status === "PAID" ? { status: "paid", paid_at: new Date().toISOString() } : { status: "refused" };
    await supabaseAdmin.from("orders").update(patch).eq("payment_id", paymentId).eq("status", "pending");
  } catch (e) { console.error("markOrderStatus failed", e); }
}
