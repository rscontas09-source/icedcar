import { useState, type CSSProperties } from "react";
import { createFileRoute, Link, notFound, redirect, useNavigate } from "@tanstack/react-router";
import capturedCSS from "../../styles/site.css?raw";
import { PRODUCTS, productBySlug } from "@/lib/catalog";
import { ORDER_KEY, brl, pixPrice, PIX_DISCOUNT, MAX_INSTALLMENTS, FREE_SHIPPING_FROM, SHIPPING_FEE, type Order } from "@/lib/order";

export const Route = createFileRoute("/produtos/$slug")({
  beforeLoad: () => { throw redirect({ to: "/" }); },
  loader: ({ params }) => {
    const p = productBySlug(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.name} | Gelaki Brasil` : "Produto | Gelaki Brasil";
    const d = loaderData ? `${loaderData.name} por ${brl(loaderData.price)} ou ${brl(pixPrice(loaderData.price))} no PIX (10% OFF). ${loaderData.summary}` : "Caixas térmicas Gelaki Brasil.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  staticData: { importedDocument: { html: { lang: "pt-BR" }, body: { "data-tema": "kids" } } },
  component: ProductPage,
  errorComponent: () => <p className="p-8 text-center">Não foi possível abrir este produto. <Link to="/">Voltar à loja</Link></p>,
  notFoundComponent: () => <p className="p-8 text-center">Produto não encontrado. <Link to="/">Voltar à loja</Link></p>,
});

const muted: CSSProperties = { color: "var(--kids-texto-suave)" };

function ProductPage() {
  const p = Route.useLoaderData();
  const navigate = useNavigate();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const total = p.price * qty;
  const buy = () => {
    const order: Order = { quantity: qty, items: [], product: p.slug };
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    navigate({ to: "/checkout" });
  };
  const specs: [string, string][] = [
    ["Capacidade", `${p.liters} litros (${p.quarts})`],
    ["Tipo", "Caixa térmica"],
    ["Pagamento", `PIX com ${Math.round(PIX_DISCOUNT * 100)}% OFF ou até ${MAX_INSTALLMENTS}x no cartão`],
    ["Frete", `${brl(SHIPPING_FEE)} · grátis acima de ${brl(FREE_SHIPPING_FROM)}`],
    ["Garantia", "7 dias para troca ou devolução"],
    ["Nota fiscal", "Sim, emitida no seu CPF"],
  ];
  const others = PRODUCTS.filter((o) => o.slug !== p.slug).slice(0, 4);
  const current = p.images[img] ?? p.images[0];
  return (
    <div data-theme="kids" className="min-h-screen" style={{ background: "var(--kids-fundo)", color: "var(--kids-texto)" }}>
      <style>{capturedCSS}</style>
      <header className="p-4 text-center">
        <Link to="/" className="kids-titulo text-xl" style={{ color: "var(--kids-rosa-texto)" }}>Gelaki Brasil</Link>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-12">
        <nav className="mb-3 text-xs" style={muted}><Link to="/" className="underline">Início</Link> › {p.name}</nav>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="kids-card relative aspect-square overflow-hidden" style={{ background: "#fff" }}>
              {current && <img src={current.src} srcSet={current.srcSet} sizes="(max-width: 767px) 100vw, 480px" alt={p.name} className="absolute inset-0 h-full w-full object-contain p-4" />}
            </div>
            {p.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {p.images.map((im, i) => (
                  <button key={im.src} type="button" aria-label={`Ver foto ${i + 1}`} aria-pressed={i === img} onClick={() => setImg(i)} className="h-16 w-16 overflow-hidden rounded-xl" style={{ border: `2px solid ${i === img ? "var(--kids-rosa)" : "var(--kids-borda)"}`, background: "#fff" }}>
                    <img src={im.src} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="kids-titulo text-2xl leading-tight md:text-3xl">{p.name}</h1>
            <p className="mt-2 text-sm" style={muted}>{p.summary}</p>
            <div className="mt-4">
              <span className="kids-titulo block text-3xl" style={{ color: "var(--kids-rosa-texto)" }}>{brl(p.price)}</span>
              <span className="block text-sm font-semibold" style={{ color: "var(--kids-cta)" }}>ou {brl(pixPrice(p.price))} no PIX ({Math.round(PIX_DISCOUNT * 100)}% OFF)</span>
              <span className="block text-sm" style={muted}>ou até {MAX_INSTALLMENTS}x de {brl(Math.ceil(p.price / MAX_INSTALLMENTS))} sem juros no cartão</span>
            </div>
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold">Quantidade</p>
              <div className="inline-flex items-center gap-2 rounded-full p-1" style={{ background: "var(--kids-fundo-suave)" }}>
                <button type="button" aria-label="Diminuir quantidade" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-full text-xl font-bold" style={{ background: "#fff" }}>−</button>
                <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
                <button type="button" aria-label="Aumentar quantidade" disabled={qty >= 10} onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-11 w-11 place-items-center rounded-full text-xl font-bold" style={{ background: "#fff" }}>+</button>
              </div>
              {qty > 1 && <p className="mt-2 text-sm">Total: <strong>{brl(total)}</strong> · PIX <strong style={{ color: "var(--kids-cta)" }}>{brl(pixPrice(total))}</strong></p>}
            </div>
            <button type="button" onClick={buy} className="kids-btn kids-btn-cta mt-5 w-full">COMPRAR AGORA</button>
            <p className="mt-2 text-center text-xs" style={muted}>🔒 Compra segura · 🚚 Envio com rastreio · ↩️ 7 dias de garantia</p>
            <section className="kids-card mt-6 p-4">
              <h2 className="kids-titulo mb-3 text-lg">Especificações</h2>
              <dl className="divide-y text-sm">
                {specs.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2"><dt style={muted}>{k}</dt><dd className="text-right font-semibold">{v}</dd></div>)}
              </dl>
            </section>
          </div>
        </div>
        <section className="mt-10">
          <h2 className="kids-titulo mb-3 text-xl">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {others.map((o) => (
              <Link key={o.slug} to="/produtos/$slug" params={{ slug: o.slug }} onClick={() => { setImg(0); setQty(1); }} className="kids-card flex flex-col overflow-hidden">
                <div className="relative aspect-square" style={{ background: "#fff" }}><img src={o.images[0]?.src} alt={o.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-2" /></div>
                <div className="p-3"><p className="line-clamp-2 text-[13px] font-semibold">{o.name}</p><p className="kids-titulo text-lg" style={{ color: "var(--kids-rosa-texto)" }}>{brl(o.price)}</p><p className="text-[12px]" style={{ color: "var(--kids-cta)" }}>ou {brl(pixPrice(o.price))} no PIX</p></div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
