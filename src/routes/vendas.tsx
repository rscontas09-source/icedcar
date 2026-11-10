import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import capturedCSS from "../styles/site.css?raw";
import { listSales } from "@/lib/sales.functions";
import { brl } from "@/lib/order";

export const Route = createFileRoute("/vendas")({
  head: () => ({ meta: [
    { title: "Painel de vendas | Gelaki Brasil" }, { name: "description", content: "Painel interno de pedidos." },
    { property: "og:title", content: "Painel de vendas" }, { property: "og:description", content: "Painel interno de pedidos." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex, nofollow" },
  ] }),
  staticData: { importedDocument: { html: { lang: "pt-BR" }, body: { "data-tema": "kids" } } },
  component: Sales,
});

type Row = Extract<Awaited<ReturnType<typeof listSales>>, { ok: true }>["orders"][number];
const box: CSSProperties = { background: "#fff", border: "1px solid var(--kids-borda)", borderRadius: 20 };
const muted: CSSProperties = { color: "var(--kids-texto-suave)" };
const LABEL: Record<string, [string, string]> = { paid: ["Aprovado", "var(--kids-cta)"], pending: ["Pendente", "#b7791f"], refused: ["Recusado", "var(--kids-sale)"] };

function beep() {
  try {
    const ctx = new AudioContext();
    [880, 1320].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; o.connect(g); g.connect(ctx.destination); g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.18); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.3); o.start(ctx.currentTime + i * 0.18); o.stop(ctx.currentTime + i * 0.18 + 0.3); });
  } catch { /* no audio */ }
}

function Sales() {
  const fetchSales = useServerFn(listSales);
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [orders, setOrders] = useState<Row[]>([]);
  const [copied, setCopied] = useState("");
  const paidIds = useRef<Set<string> | null>(null);

  const load = async (p: string) => {
    const r = await fetchSales({ data: { pin: p } });
    if (!r.ok) return false;
    const paid = new Set(r.orders.filter((o) => o.status === "paid").map((o) => o.id));
    if (paidIds.current && [...paid].some((id) => !paidIds.current!.has(id))) beep();
    paidIds.current = paid;
    setOrders(r.orders);
    return true;
  };

  const press = async (d: string) => {
    if (busy) return;
    const next = (pin + d).slice(0, 4);
    setPin(next); setErr("");
    if (next.length < 4) return;
    setBusy(true);
    try { if (await load(next)) { setAuthed(next); sessionStorage.setItem("vendas-pin", next); } else { setErr("PIN incorreto"); setPin(""); } }
    catch { setErr("Falha de conexão"); setPin(""); }
    setBusy(false);
  };

  useEffect(() => {
    const s = sessionStorage.getItem("vendas-pin");
    if (s) void load(s).then((ok) => ok ? setAuthed(s) : sessionStorage.removeItem("vendas-pin")).catch(() => undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => { void load(authed).catch(() => undefined); }, 15000);
    return () => clearInterval(t);
  }, [authed]); // eslint-disable-line react-hooks/exhaustive-deps

  const shell = (c: React.ReactNode) => (
    <div data-theme="kids" className="min-h-screen" style={{ background: "var(--kids-fundo-suave)", color: "var(--kids-texto)" }}>
      <style>{capturedCSS}</style>{c}
    </div>
  );

  if (!authed) return shell(
    <main className="mx-auto flex min-h-screen max-w-xs flex-col items-center justify-center px-4">
      <h1 className="kids-titulo text-2xl">Painel de vendas</h1>
      <p className="mt-1 text-sm" style={muted}>Digite o PIN de 4 dígitos</p>
      <div className="my-5 flex gap-3" aria-label="PIN digitado">{[0, 1, 2, 3].map((i) => <span key={i} className="h-4 w-4 rounded-full" style={{ background: i < pin.length ? "var(--kids-cta)" : "var(--kids-borda)" }} />)}</div>
      {err && <p role="alert" className="mb-3 text-sm font-bold" style={{ color: "var(--kids-sale)" }}>{err}</p>}
      <div className="grid w-full grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) => k === "" ? <span key={i} /> : (
          <button key={i} type="button" disabled={busy} aria-label={k === "⌫" ? "Apagar" : k} onClick={() => k === "⌫" ? setPin((p) => p.slice(0, -1)) : void press(k)}
            className="h-16 rounded-2xl text-2xl font-bold disabled:opacity-50" style={box}>{k}</button>
        ))}
      </div>
    </main>,
  );

  const paid = orders.filter((o) => o.status === "paid");
  const pix = orders.filter((o) => o.method === "PIX");
  const pixPaid = pix.filter((o) => o.status === "paid").length;
  const revenue = paid.reduce((s, o) => s + o.amount, 0);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const copy = (k: string, v: string) => { void navigator.clipboard.writeText(v); setCopied(k); setTimeout(() => setCopied(""), 1500); };
  const waLink = (o: Row) => {
    const phone = (o.customer_phone ?? "").replace(/\D/g, "");
    const first = o.customer_name.split(" ")[0];
    const msg = `Oi ${first}, tudo bem? Aqui é da Gelaki Brasil 😊 Vi que seu pedido ${o.order_number} (${brl(o.amount)}) ainda está aguardando o PIX. Seu pedido continua reservado, é só pagar por aqui: ${origin}/pedido/${o.id}`;
    return `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`;
  };

  return shell(
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="kids-titulo text-2xl">Painel de vendas</h1>
        <button type="button" className="text-sm underline" onClick={() => { sessionStorage.removeItem("vendas-pin"); setAuthed(""); setPin(""); }}>Sair</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[["Faturamento aprovado", brl(revenue)], ["Total de pedidos", `${orders.length} (${paid.length} pagos)`], ["Conversão PIX", pix.length ? `${Math.round((pixPaid / pix.length) * 100)}% (${pixPaid}/${pix.length})` : "—"]].map(([l, v]) => (
          <div key={l} className="p-4" style={box}><p className="text-xs" style={muted}>{l}</p><p className="kids-titulo mt-1 text-2xl">{v}</p></div>
        ))}
      </div>
      <p className="mt-2 text-xs" style={muted}>Atualiza a cada 15 s · toca um alerta quando entra um pedido pago (deixe esta aba aberta).</p>
      <div className="mt-5 overflow-x-auto" style={box}>
        <table className="w-full text-left text-sm">
          <thead><tr className="text-xs" style={muted}>{["Pedido", "Data", "Cliente", "Valor", "Status", "Ações"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {orders.map((o) => {
              const [label, color] = LABEL[o.status] ?? [o.status, "inherit"];
              return (
                <tr key={o.id} className="border-t align-top" style={{ borderColor: "var(--kids-borda)" }}>
                  <td className="p-3 font-bold">{o.order_number}<span className="block text-xs font-normal" style={muted}>{o.method === "PIX" ? "PIX" : "Cartão"}</span></td>
                  <td className="whitespace-nowrap p-3">{new Date(o.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="p-3">{o.customer_name}<span className="block text-xs" style={muted}>{o.customer_email}{o.customer_phone ? ` · ${o.customer_phone}` : ""} · {o.city}/{o.state}</span></td>
                  <td className="whitespace-nowrap p-3 font-bold">{brl(o.amount)}</td>
                  <td className="p-3"><span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ color, border: `1px solid ${color}` }}>{label}</span></td>
                  <td className="space-y-1 p-3 text-xs">
                    {o.status === "pending" && o.customer_phone && <a href={waLink(o)} target="_blank" rel="noopener noreferrer" className="block font-bold" style={{ color: "#128c7e" }}>Chamar no WhatsApp</a>}
                    {o.status === "pending" && o.pix_code && <button type="button" className="block underline" onClick={() => copy(o.id, o.pix_code!)}>{copied === o.id ? "✓ Copiado" : "Copiar código PIX"}</button>}
                    <a href={`/pedido/${o.id}`} target="_blank" rel="noopener noreferrer" className="block underline">Ver /pedido</a>
                  </td>
                </tr>
              );
            })}
            {!orders.length && <tr><td colSpan={6} className="p-6 text-center" style={muted}>Nenhum pedido ainda.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>,
  );
}
