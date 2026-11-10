import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Admin sales list. Every call re-checks the PIN server-side against the ADMIN_PIN secret. */
export const listSales = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ pin: z.string().regex(/^\d{4}$/) }).parse(d))
  .handler(async ({ data }) => {
    const pin = process.env["ADMIN_PIN"];
    if (!pin || data.pin !== pin) {
      await new Promise((r) => setTimeout(r, 1200)); // slows guessing
      return { ok: false as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.from("orders")
      .select("id, order_number, method, amount, status, pix_code, customer_name, customer_email, customer_phone, city, state, items, created_at, paid_at")
      .order("created_at", { ascending: false }).limit(500);
    if (error) throw new Error("Falha ao ler pedidos");
    return { ok: true as const, orders: rows ?? [] };
  });
