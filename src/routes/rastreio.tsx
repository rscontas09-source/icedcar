import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type CSSProperties } from "react";
import capturedCSS from "../styles/site.css?raw";
import { findOrders } from "@/lib/orders.functions";
import { OrderCard } from "@/components/ShipmentCard";

export const Route = createFileRoute("/rastreio")({
  head: () => ({
    meta: [
      { title: "Rastrear pedido | IcedCar Gelaki Brasil" },
      { name: "description", content: "Acompanhe a produção e a entrega do seu mini cooler IcedCar com CPF e e-mail." },
      { property: "og:title", content: "Rastrear pedido | IcedCar" },
      { property: "og:description", content: "Consulte o status do seu pedido IcedCar personalizado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  staticData: { importedDocument: { html: { lang: "pt-BR" }, body: { "data-tema": "kids" } } },
  component: TrackPage,
});

type Found = Awaited<ReturnType<typeof findOrders>>[number];
const field = "w-full rounded-xl border px-4 py-3 text-base";
const muted: CSSProperties = { color: "var(--kids-texto-suave)" };

function TrackPage() {
  const find = useServerFn(findOrders);
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [res, setRes] = useState<Found[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { setRes(await find({ data: { cpf: cpf.replace(/\D/g, ""), email } })); }
    catch { setErr("Confira o CPF e o e-mail usados na compra."); }
    setBusy(false);
  };
  return (
    <div data-theme="kids" className="min-h-screen" style={{ background: "var(--kids-fundo)", color: "var(--kids-texto)" }}>
      <style>{capturedCSS}</style>
      <header className="p-4 text-center">
        <Link to="/" className="kids-titulo text-xl" style={{ color: "var(--kids-rosa-texto)" }}>Gelaki Brasil</Link>
      </header>
      <main className="mx-auto max-w-xl px-4 pb-10">
        <h1 className="kids-titulo text-center text-2xl">Rastrear pedido</h1>
        <p className="mt-1 text-center text-sm" style={muted}>Digite o CPF e o e-mail usados na compra.</p>
        <form onSubmit={submit} className="kids-card mt-6 space-y-3 p-5">
          <input value={cpf} onChange={(e) => setCpf(e.target.value)} inputMode="numeric" placeholder="CPF" aria-label="CPF" className={field} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail" aria-label="E-mail" className={field} />
          <button disabled={busy} className="kids-btn kids-btn-cta w-full">{busy ? "Buscando..." : "BUSCAR PEDIDO"}</button>
          {err && <p className="text-sm" style={{ color: "#c0392b" }}>{err}</p>}
        </form>
        {res && (
          <div className="mt-4 space-y-3">
            {res.length === 0 && <p className="kids-card p-4 text-center text-sm" style={muted}>Nenhum pedido encontrado com esses dados.</p>}
            {res.map((o) => <OrderCard key={o.number} o={o} />)}
          </div>
        )}
      </main>
    </div>
  );
}
