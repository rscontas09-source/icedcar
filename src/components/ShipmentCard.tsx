import { useState, type CSSProperties } from "react";
import { fillPlace, shipmentState, trackingCode } from "@/lib/shipment";

export type TrackedOrder = { number: string; status: string; paidAt: string | null; createdAt: string; city: string | null; state: string | null; firstName: string };
const fmt = (d: Date) => d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const muted: CSSProperties = { color: "var(--kids-texto-suave)" };

export function OrderCard({ o }: { o: TrackedOrder }) {
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

