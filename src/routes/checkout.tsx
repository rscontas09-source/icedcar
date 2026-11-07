import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import capturedCSS from "../styles/site.css?raw";
import { createPixPayment } from "@/lib/payment.functions";
import { type Order, ORDER_KEY, brl, cardTotal, isValidCPF, pixTotal, shipping, subtotal, PIX_DISCOUNT } from "@/lib/order";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Finalizar compra - Mini Cooler IcedCar | Gelaki Brasil" },
    { name: "description", content: "Checkout seguro do seu Mini Cooler IcedCar personalizado. PIX com 5% de desconto." },
    { property: "og:title", content: "Checkout seguro | Gelaki Brasil" },
    { property: "og:description", content: "Finalize seu IcedCar personalizado com PIX e 5% de desconto." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  staticData: { importedDocument: { html: { lang: "pt-BR" }, body: { "data-tema": "kids" } } },
  component: Checkout,
});

const mask = {
  cpf: (v: string) => v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  phone: (v: string) => v.replace(/\D/g, "").slice(0, 11).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2"),
  cep: (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"),
};
const box: CSSProperties = { background: "#fff", border: "1px solid var(--kids-borda)", borderRadius: 22, boxShadow: "var(--kids-sombra-card)" };

type F = Record<"name" | "email" | "phone" | "cpf" | "cep" | "street" | "number" | "complement" | "district" | "city" | "state", string>;
const initial: F = { name: "", email: "", phone: "", cpf: "", cep: "", street: "", number: "", complement: "", district: "", city: "", state: "" };

function Checkout() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [f, setF] = useState<F>(initial);
  const [err, setErr] = useState<Partial<Record<keyof F, string>>>({});
  const [cepLoading, setCepLoading] = useState(false);
  const [secs, setSecs] = useState(15 * 60);
  const [viewers] = useState(() => 9 + Math.floor(Math.random() * 14));
  const [busy, setBusy] = useState(false);
  const [payErr, setPayErr] = useState("");
  const [pix, setPix] = useState<{ copypaste: string; amount: number; orderId: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const pay = useServerFn(createPixPayment);

  useEffect(() => {
    try { const o = JSON.parse(sessionStorage.getItem(ORDER_KEY) || "null"); if (o?.items?.length) setOrder(o); } catch { /* empty */ }
    try { const s = JSON.parse(localStorage.getItem("icedcar-buyer") || "null"); if (s) setF((x) => ({ ...x, ...s })); } catch { /* empty */ }
    setLoaded(true);
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const up = (k: keyof F, v: string) => { setF((x) => ({ ...x, [k]: v })); setErr((e) => ({ ...e, [k]: undefined })); };

  const lookupCep = async (v: string) => {
    const d = v.replace(/\D/g, "");
    if (d.length !== 8) return;
    setCepLoading(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const j = await r.json();
      if (j.erro) setErr((e) => ({ ...e, cep: "CEP não encontrado." }));
      else { setErr((e) => ({ ...e, street: undefined, district: undefined, city: undefined, state: undefined })); setF((x) => ({ ...x, street: j.logradouro || x.street, district: j.bairro || x.district, city: j.localidade || "", state: j.uf || "" })); }
    } catch { /* manual */ } finally { setCepLoading(false); }
  };

  const validate = () => {
    const e: Partial<Record<keyof F, string>> = {};
    if (f.name.trim().split(/\s+/).length < 2 || f.name.trim().length < 5) e.name = "Digite nome e sobrenome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "E-mail inválido.";
    if (!/^\d{10,11}$/.test(f.phone.replace(/\D/g, ""))) e.phone = "Celular com DDD inválido.";
    if (!isValidCPF(f.cpf)) e.cpf = "CPF inválido.";
    if (f.cep.replace(/\D/g, "").length !== 8) e.cep = "CEP inválido.";
    if (f.street.trim().length < 2) e.street = "Informe a rua.";
    if (!f.number.trim()) e.number = "Informe o número.";
    if (!f.district.trim()) e.district = "Informe o bairro.";
    if (f.city.trim().length < 2) e.city = "Informe a cidade.";
    if (!/^[A-Za-z]{2}$/.test(f.state)) e.state = "UF";
    setErr(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`co-${first}`)?.focus();
    return !first;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!order || !validate()) return;
    setBusy(true); setPayErr("");
    localStorage.setItem("icedcar-buyer", JSON.stringify({ name: f.name, email: f.email, phone: f.phone }));
    try {
      const r = await pay({ data: {
        order,
        payer: { name: f.name.trim(), email: f.email.trim(), phone: f.phone.replace(/\D/g, ""), taxId: f.cpf.replace(/\D/g, "") },
        address: { zipCode: f.cep.replace(/\D/g, ""), state: f.state.toUpperCase(), city: f.city.trim(), district: f.district.trim(), street: f.street.trim(), number: f.number.trim(), complement: f.complement.trim() || undefined },
      } });
      if (r.ok) { setPix(r); sessionStorage.removeItem(ORDER_KEY); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else setPayErr(r.error);
    } catch { setPayErr("Confira os dados informados e tente novamente."); }
    finally { setBusy(false); }
  };

  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");

  const field = (k: keyof F, label: string, props: React.InputHTMLAttributes<HTMLInputElement> & { fmt?: (v: string) => string } = {}) => {
    const { fmt, className, ...rest } = props;
    return (
      <div className={className}>
        <label htmlFor={`co-${k}`} className="mb-1 block text-xs font-bold">{label}</label>
        <input id={`co-${k}`} value={f[k]} aria-invalid={!!err[k]} onChange={(e) => up(k, fmt ? fmt(e.target.value) : e.target.value)} {...rest}
          className="h-12 w-full rounded-xl px-3 text-base md:text-sm" style={{ border: `1px solid ${err[k] ? "var(--kids-sale)" : "var(--kids-borda)"}`, background: "#fff" }} />
        {err[k] && <p className="mt-1 text-xs font-semibold" style={{ color: "var(--kids-sale)" }}>{err[k]}</p>}
      </div>
    );
  };

  return (
    <>
      <style>{capturedCSS}</style>
      <div data-theme="kids" className="min-h-screen" style={{ background: "var(--kids-fundo-suave)", color: "var(--kids-texto)" }}>
        <div className="py-2 text-center text-xs font-bold" style={{ background: "var(--kids-rosa)", color: "#fff" }}>
          🔒 Compra 100% segura · Frete grátis acima de R$ 199 · Nota fiscal em todos os pedidos
        </div>
        <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="kids-titulo text-xl" style={{ color: "var(--kids-rosa-texto)" }}>Gelaki Brasil</Link>
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--kids-texto-suave)" }}>🔒 Ambiente seguro</span>
        </header>

        {!loaded ? null : pix ? (
          <main className="mx-auto max-w-lg px-4 pb-16">
            <div className="p-6 text-center" style={box}>
              <p className="text-3xl">🎉</p>
              <h1 className="kids-titulo mt-2 text-2xl">Pedido reservado!</h1>
              <p className="mt-1 text-sm" style={{ color: "var(--kids-texto-suave)" }}>Pague o PIX para confirmar. Pedido {pix.orderId}</p>
              <p className="mt-4 text-3xl font-bold" style={{ color: "var(--kids-cta)" }}>{brl(pix.amount)}</p>
              <img className="mx-auto mt-4 h-56 w-56 rounded-xl" alt="QR Code PIX" src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(pix.copypaste)}`} />
              <p className="mt-4 break-all rounded-xl p-3 text-left text-[11px]" style={{ background: "var(--kids-fundo-suave)" }}>{pix.copypaste}</p>
              <button type="button" className="kids-btn kids-btn-cta mt-3 w-full" onClick={() => { navigator.clipboard.writeText(pix.copypaste); setCopied(true); setTimeout(() => setCopied(false), 2500); }}>{copied ? "✓ Código copiado!" : "Copiar código PIX"}</button>
              <ol className="mt-5 space-y-1 text-left text-sm">
                <li>1. Abra o app do seu banco e escolha <b>PIX Copia e Cola</b>.</li>
                <li>2. Cole o código e confirme o pagamento.</li>
                <li>3. Pronto! Você recebe a confirmação por e-mail e a produção começa.</li>
              </ol>
              <p className="mt-4 text-xs font-semibold" style={{ color: "var(--kids-sale)" }}>⏱ O código expira em breve — pague agora para garantir o preço.</p>
            </div>
          </main>
        ) : !order ? (
          <main className="mx-auto max-w-lg px-4 pb-16 text-center">
            <div className="p-8" style={box}>
              <h1 className="kids-titulo text-xl">Seu carrinho está vazio</h1>
              <p className="mt-2 text-sm" style={{ color: "var(--kids-texto-suave)" }}>Personalize seu IcedCar para continuar.</p>
              <Link to="/" className="kids-btn kids-btn-cta mt-5 inline-flex">Personalizar meu IcedCar</Link>
            </div>
          </main>
        ) : (
          <main className="mx-auto grid max-w-5xl gap-5 px-4 pb-16 md:grid-cols-[1fr_380px]">
            <div className="md:col-span-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-2xl px-4 py-3 text-center text-sm font-bold" style={{ background: "var(--kids-sale-suave)", color: "var(--kids-sale)" }}>
              <span>⏱ Seu desconto está reservado por <span className="tabular-nums">{mm}:{ss}</span></span>
              <span className="text-xs font-semibold">🔥 {viewers} pessoas vendo este produto agora · restam poucas unidades</span>
            </div>

            <form onSubmit={submit} noValidate className="space-y-5 md:order-1">
              <section className="p-5" style={box}>
                <h2 className="kids-titulo mb-4 text-lg">1. Seus dados</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("name", "Nome completo", { autoComplete: "name", className: "sm:col-span-2", maxLength: 100 })}
                  {field("email", "E-mail", { type: "email", autoComplete: "email", className: "sm:col-span-2", maxLength: 255 })}
                  {field("phone", "Celular (WhatsApp)", { inputMode: "tel", autoComplete: "tel", fmt: mask.phone, placeholder: "(11) 99999-9999" })}
                  {field("cpf", "CPF (para a nota fiscal)", { inputMode: "numeric", fmt: mask.cpf, placeholder: "000.000.000-00" })}
                </div>
              </section>
              <section className="p-5" style={box}>
                <h2 className="kids-titulo mb-4 text-lg">2. Entrega</h2>
                <div className="grid grid-cols-6 gap-3">
                  {field("cep", cepLoading ? "CEP (buscando…)" : "CEP", { inputMode: "numeric", autoComplete: "postal-code", className: "col-span-6 sm:col-span-2", fmt: mask.cep, onBlur: (e) => lookupCep(e.target.value), onKeyUp: (e) => lookupCep((e.target as HTMLInputElement).value), placeholder: "00000-000" })}
                  {field("street", "Rua", { autoComplete: "address-line1", className: "col-span-6 sm:col-span-4" })}
                  {field("number", "Número", { className: "col-span-2", maxLength: 10 })}
                  {field("complement", "Complemento (opcional)", { className: "col-span-4", maxLength: 60 })}
                  {field("district", "Bairro", { className: "col-span-6 sm:col-span-2" })}
                  {field("city", "Cidade", { className: "col-span-4 sm:col-span-3" })}
                  {field("state", "UF", { className: "col-span-2 sm:col-span-1", maxLength: 2, fmt: (v) => v.toUpperCase().replace(/[^A-Z]/g, "") })}
                </div>
                <p className="mt-3 rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "var(--kids-cta-suave)", color: "var(--kids-cta)" }}>
                  {shipping(order) === 0 ? "🚚 Frete GRÁTIS para todo o Brasil" : `🚚 Frete fixo ${brl(shipping(order))} · Produção em até 3 dias úteis + envio`}
                </p>
              </section>
              <section className="p-5" style={box}>
                <h2 className="kids-titulo mb-4 text-lg">3. Pagamento</h2>
                <div className="rounded-2xl p-4" style={{ border: "2px solid var(--kids-rosa)", background: "var(--kids-rosa-suave)" }}>
                  <div className="flex items-center justify-between"><span className="font-bold">◉ PIX</span><span className="kids-selo" style={{ background: "var(--kids-cta)", color: "#fff" }}>{Math.round(PIX_DISCOUNT * 100)}% OFF</span></div>
                  <p className="mt-1 text-xs" style={{ color: "var(--kids-texto-suave)" }}>Aprovação imediata. O QR Code aparece logo após finalizar.</p>
                </div>
                {payErr && <p role="alert" className="mt-3 rounded-xl px-3 py-2 text-sm font-semibold" style={{ background: "var(--kids-sale-suave)", color: "var(--kids-sale)" }}>{payErr}</p>}
                <button type="submit" disabled={busy} className="kids-btn kids-btn-cta mt-4 w-full disabled:opacity-60">{busy ? "Gerando PIX…" : `Finalizar pedido · ${brl(pixTotal(order))}`}</button>
                <ul className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold" style={{ color: "var(--kids-texto-suave)" }}>
                  <li>🔒 Dados criptografados</li><li>🧾 Nota fiscal eletrônica</li><li>↩️ 7 dias para troca</li><li>✅ +10 mil clientes</li>
                </ul>
              </section>
            </form>

            <aside className="md:order-2">
              <div className="space-y-3 p-5 md:sticky md:top-4" style={box}>
                <h2 className="kids-titulo text-lg">Resumo do pedido</h2>
                {order.items.map((i, n) => (
                  <div key={n} className="flex gap-3 rounded-2xl p-3" style={{ background: "var(--kids-fundo-suave)" }}>
                    <img src="/site-assets/1570458ae2415f83.webp" alt="" className="h-16 w-16 flex-shrink-0 rounded-xl object-contain" style={{ background: "#fff" }} />
                    <div className="min-w-0 text-xs">
                      <p className="text-sm font-bold">Mini Cooler IcedCar 45L</p>
                      <p style={{ color: "var(--kids-texto-suave)" }}>{i.marca} {i.modelo} {i.ano} · {i.cor} · {i.lado}</p>
                      <p className="font-bold">Placa: “{i.placa}”{i.prioridade ? " · ⚡ Prioridade" : ""}</p>
                    </div>
                  </div>
                ))}
                <Link to="/" className="block text-xs font-semibold underline" style={{ color: "var(--kids-rosa-texto)" }}>Editar personalização</Link>
                <dl className="space-y-1 pt-2 text-sm" style={{ borderTop: "1px solid var(--kids-borda)" }}>
                  <div className="flex justify-between"><dt>Subtotal</dt><dd>{brl(subtotal(order))}</dd></div>
                  <div className="flex justify-between" style={{ color: "var(--kids-cta)" }}><dt>Desconto PIX (5%)</dt><dd>−{brl(subtotal(order) - Math.round(subtotal(order) * (1 - PIX_DISCOUNT)))}</dd></div>
                  <div className="flex justify-between"><dt>Frete</dt><dd>{shipping(order) ? brl(shipping(order)) : "Grátis"}</dd></div>
                  <div className="flex justify-between pt-2 text-lg font-bold"><dt>Total no PIX</dt><dd style={{ color: "var(--kids-cta)" }}>{brl(pixTotal(order))}</dd></div>
                  <p className="text-right text-[11px] line-through" style={{ color: "var(--kids-texto-suave)" }}>De {brl(Math.round(cardTotal(order) * 99.9 / 79))}</p>
                </dl>
                <div className="rounded-2xl p-3 text-xs" style={{ background: "var(--kids-fundo-suave)" }}>
                  <p>⭐⭐⭐⭐⭐ “Ficou idêntico ao meu carro, presente perfeito!”</p>
                  <p className="mt-1 font-semibold" style={{ color: "var(--kids-texto-suave)" }}>— cliente verificado</p>
                </div>
              </div>
            </aside>
          </main>
        )}
      </div>
    </>
  );
}
