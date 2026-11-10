import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import capturedCSS from "../../styles/site.css?raw";
import { getOrder } from "@/lib/payment.functions";
import { brl } from "@/lib/order";
import { reportConfirmedPurchase } from "@/lib/advertising";
import { OrderCard } from "@/components/ShipmentCard";
import { SUPPORT_WHATSAPP, PIX_EXPIRES_MIN } from "@/lib/store";

export const Route = createFileRoute("/pedido/$id")({
  head: () => ({ meta: [
    { title: "Seu pedido | Gelaki Brasil" }, { name: "description", content: "Acompanhe o pagamento e a entrega do seu pedido Gelaki Brasil." },
    { property: "og:title", content: "Seu pedido | Gelaki Brasil" }, { property: "og:description", content: "Pagamento e rastreio do seu pedido." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  staticData: { importedDocument: { html: { lang: "pt-BR" }, body: { "data-tema": "kids" } } },
  component: OrderPage,
});

type O = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
const box: CSSProperties = { background: "#fff", border: "1px solid var(--kids-borda)", borderRadius: 24 };
const muted: CSSProperties = { color: "var(--kids-texto-suave)" };

function OrderPage() {
  const { id } = Route.useParams();
  const fetchOrder = useServerFn(getOrder);
  const [o, setO] = useState<O | null | undefined>(undefined);
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let off = false;
    const load = async () => { try { const r = await fetchOrder({ data: { id } }); if (!off) setO(r); } catch { if (!off) setO((x) => x ?? null); } };
    void load();
    const t = setInterval(() => { setO((cur) => { if (!cur || cur.status === "pending") void load(); return cur; }); }, 5000);
    const c = setInterval(() => setNow(Date.now()), 1000);
    return () => { off = true; clearInterval(t); clearInterval(c); };
  }, [id, fetchOrder]);

  useEffect(() => { if (o?.status === "paid") reportConfirmedPurchase("PAID", o.amount, o.id); }, [o]);

  const wa = (msg: string) => `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  const left = o ? Math.max(0, new Date(o.createdAt).getTime() + PIX_EXPIRES_MIN * 60000 - now) : 0;
  const mm = String(Math.floor(left / 60000)).padStart(2, "0"), ss = String(Math.floor(left / 1000) % 60).padStart(2, "0");

  return (
    <div data-theme="kids" className="min-h-screen" style={{ background: "var(--kids-fundo-suave)", color: "var(--kids-texto)" }}>
      <style>{capturedCSS}</style>
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Link to="/" className="kids-titulo text-xl" style={{ color: "var(--kids-rosa-texto)" }}>Gelaki Brasil</Link>
        <span className="text-xs font-semibold" style={muted}>🔒 Ambiente seguro</span>
      </header>
      <main className="mx-auto max-w-lg space-y-4 px-4 pb-16">
        {o === undefined ? <p className="p-8 text-center" style={muted}>Carregando pedido…</p>
        : o === null ? (
          <div className="p-8 text-center" style={box}>
            <h1 className="kids-titulo text-xl">Pedido não encontrado</h1>
            <Link to="/rastreio" className="kids-btn kids-btn-cta mt-5 inline-flex">Buscar meu pedido</Link>
          </div>
        ) : o.status === "paid" ? (
          <>
            <div className="p-6 text-center" style={box}>
              <p className="text-4xl">✅</p>
              <h1 className="kids-titulo mt-2 text-2xl">Pagamento Aprovado</h1>
              <p className="mt-1 text-sm" style={muted}>Obrigado, {o.firstName}! Pedido {o.number} · {brl(o.amount)}</p>
            </div>
            <OrderCard o={o} />
            <a href={wa(`Olá! Tenho uma dúvida sobre o ${o.number}.`)} target="_blank" rel="noopener noreferrer" className="kids-btn kids-btn-rosa w-full">Falar no WhatsApp</a>
          </>
        ) : o.status === "refused" ? (
          <div className="p-6 text-center" style={box}>
            <p className="text-3xl">⚠️</p>
            <h1 className="kids-titulo mt-2 text-2xl">Pagamento recusado</h1>
            <p className="mt-2 text-sm" style={muted}>Pedido {o.number}. Tente outro cartão ou pague no PIX.</p>
            <Link to="/checkout" className="kids-btn kids-btn-cta mt-5 inline-flex">Tentar novamente</Link>
          </div>
        ) : o.pixCode ? (
          <div className="p-6 text-center" style={box}>
            <h1 className="kids-titulo text-2xl">Pedido reservado!</h1>
            <p className="mt-1 text-sm" style={muted}>Pague o PIX para confirmar o {o.number}</p>
            <p className="mt-4 text-3xl font-bold" style={{ color: "var(--kids-cta)" }}>{brl(o.amount)}</p>
            <p className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold tabular-nums" style={{ background: "var(--kids-sale-suave)", color: "var(--kids-sale)" }}>
              {left > 0 ? `⏱ Expira em ${mm}:${ss}` : "⏱ Código expirado — gere um novo no checkout"}
            </p>
            <img className="mx-auto mt-4 h-56 w-56 rounded-xl" alt="QR Code PIX" src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(o.pixCode)}`} />
            <p className="mt-4 break-all rounded-xl p-3 text-left text-[11px]" style={{ background: "var(--kids-fundo-suave)" }}>{o.pixCode}</p>
            <button type="button" className="kids-btn kids-btn-cta mt-3 w-full" onClick={() => { void navigator.clipboard.writeText(o.pixCode ?? ""); setCopied(true); setTimeout(() => setCopied(false), 2500); }}>{copied ? "✓ Código copiado!" : "Copiar código PIX"}</button>
            <ol className="mt-5 space-y-1 text-left text-sm">
              <li>1. Abra o app do seu banco e escolha <b>PIX Copia e Cola</b>.</li>
              <li>2. Cole o código e confirme o pagamento.</li>
              <li>3. Esta tela muda sozinha para “Pagamento Aprovado”.</li>
            </ol>
            <p className="mt-3 text-xs font-semibold" style={{ color: "var(--kids-cta)" }}>⏳ Aguardando pagamento…</p>
            <a href={wa(`Olá! Preciso de ajuda para pagar o PIX do ${o.number}.`)} target="_blank" rel="noopener noreferrer" className="kids-btn kids-btn-rosa mt-4 w-full">Suporte no WhatsApp</a>
          </div>
        ) : (
          <div className="p-6 text-center" style={box}>
            <p className="text-3xl">💳</p>
            <h1 className="kids-titulo mt-2 text-2xl">Pagamento em análise</h1>
            <p className="mt-2 text-sm" style={muted}>Pedido {o.number} · {brl(o.amount)}. Estamos confirmando com o banco.</p>
            <p className="mt-4 text-xs font-semibold" style={{ color: "var(--kids-cta)" }}>⏳ Aguardando confirmação…</p>
            <a href={wa(`Olá! Tenho uma dúvida sobre o ${o.number}.`)} target="_blank" rel="noopener noreferrer" className="kids-btn kids-btn-rosa mt-4 w-full">Suporte no WhatsApp</a>
          </div>
        )}
      </main>
    </div>
  );
}
