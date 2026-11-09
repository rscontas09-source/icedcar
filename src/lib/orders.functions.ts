import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isValidCPF } from "./order";

/** Public lookup: requires both CPF and the purchase e-mail; returns only tracking data. */
export const findOrders = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ cpf: z.string().refine(isValidCPF), email: z.string().trim().email().max(255) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.from("orders")
      .select("order_number, status, paid_at, created_at, city, state, customer_name")
      .eq("customer_cpf", data.cpf.replace(/\D/g, "")).eq("customer_email", data.email.toLowerCase())
      .order("created_at", { ascending: false }).limit(20);
    if (error) throw new Error("Falha na busca");
    return (rows ?? []).map((r) => ({
      number: r.order_number, status: r.status, paidAt: r.paid_at, createdAt: r.created_at,
      city: r.city, state: r.state, firstName: r.customer_name.split(" ")[0] ?? "",
    }));
  });
