import { createFileRoute } from "@tanstack/react-router";

// ConnectPay requires a webhook URL. We only acknowledge it: payment status is
// always re-checked server-side against ConnectPay before the checkout confirms.
export const Route = createFileRoute("/api/public/connectpay-webhook")({
  server: {
    handlers: {
      POST: async () => new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } }),
    },
  },
});
