<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Imported website
- Keep imported page markup and interaction repairs in its route file, and preserve captured CSS and assets separately to retain source fidelity.
- PIX creation uses ConnectPay and cards use Masterfy through src/lib/payment.functions.ts; retain legacy provider status checks for existing charges and recompute prices server-side from src/lib/order.ts so the browser cannot set the amount.
- Advertising is isolated in a shared browser consent module: explicit acceptance gates Meta loading and confirmed-payment events, with stable payment-based IDs and no replay after refusal, to avoid counting payment attempts as sales.
- Ready-made coolers live in src/lib/catalog.ts and are ordered via Order.product (items empty); all prices derive from order.ts so PIX discount stays one rule.
- Post-checkout order page /pedido/$id is keyed by the order UUID (not the sequential number) so orders cannot be enumerated; getOrder refreshes provider status while pending.
- /vendas admin panel is gated by a 4-digit PIN checked server-side on every call against the ADMIN_PIN secret; orders are read only via supabaseAdmin inside that check.
