import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type CSSProperties } from "react";
import capturedCSS from "../styles/site.css?raw";
import { findOrders } from "@/lib/orders.functions";
import { fillPlace, shipmentState, trackingCode } from "@/lib/shipment";

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
  component: TrackPage,
});

type Found = Awaited<ReturnType<typeof findOrders>>[number];
const fmt = (d: Date) => d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const muted: CSSProperties = { color: "var(--kids-texto-suave)" };
const field = "w-full rounded-xl border px-4 py-3 text-base";

function OrderCard({ o }: { o: Found }) {
  const [copied, setCopied] = useState(false);
  if (o.status !== "paid" || !o.paidAt) {
    return (
      <div className="kids-card p-4">
        <p className="kids-titulo text-lg">{o.number}</p>
        <p className="mt-1 text-sm" style={muted}>
          {o.status === "refused" ? "Pagamento recusado. Faça um novo pedido na loja." : "Aguardando pagamento. Assim que for aprovado, o rastreio começa aqui."}
        </p>
        <p className="mt-1 text-xs" style={muted}>Feito em {new Date(o.createdAt).toLocaleDateString("pt-BR")}</p>
      </div>
    );
  }
  const s = shipmentState(o.paidAt);
  const code = trackingCode(o.number);
  return (
    <div className="kids-card p-4">
      <p className="kids-titulo text-lg">{o.number}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <button type="button" onClick={() => { void navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="rounded-xl border p-3 text-left">
          <span style={muted}>Código de rastreio</span>
          <span className="mt-0.5 block font-mono text-sm font-bold">{code}</span>
          {copied && <span style={{ color: "var(--kids-cta)" }}>Copiado!</span>}
        </button>
        <div className="rounded-xl border p-3">
          <span style={muted}>Previsão de entrega</span>
          <p className="mt-0.5 text-sm font-bold">até {s.eta.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</p>
        </div>
      </div>
      <p className="mt-2 text-xs" style={muted}>Destinatário: {o.firstName} · {o.city}/{o.state}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: "var(--kids-borda, #eee)" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.max(4, s.progress)}%`, background: "var(--kids-cta)" }} />
      </div>
      <p className="mt-1 text-right text-[11px] font-semibold" style={{ color: "var(--kids-cta)" }}>{s.progress}% do trajeto</p>
      <ol className="mt-3 space-y-3">
        {s.next && <li className="text-sm font-semibold" style={{ color: "var(--kids-cta)" }}>● Em andamento: próxima atualização em breve</li>}
        {[...s.done].reverse().map((e, i) => (
          <li key={e.h} className="text-sm">
            <p className={i === 0 ? "font-bold" : ""} style={i === 0 ? undefined : muted}>{e.title}</p>
            <p className="text-xs" style={muted}>{fillPlace(e.place, o.city, o.state)} · {fmt(e.at)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

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
    <div className="kids-root min-h-screen">
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
