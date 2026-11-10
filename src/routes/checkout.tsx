import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import capturedCSS from "../styles/site.css?raw";
import { createPixPayment, createCardPayment, getPaymentStatus, getTokenizationKey } from "@/lib/payment.functions";
import { productBySlug } from "@/lib/catalog";
import { type Order, isValidOrder, ORDER_KEY, brl, cardTotal, cardSubtotal, isValidCPF, pixTotal, shipping, subtotal, PIX_DISCOUNT, MAX_INSTALLMENTS } from "@/lib/order";
import { reportConfirmedPurchase } from "@/lib/advertising";
import { getUtms } from "@/lib/tracking";

type Card = { number: string; holder: string; expMonth: string; expYear: string; cvv: string };
type MfTok = { init: (k: string) => Promise<void>; encrypt: (c: Card) => Promise<string> };
type Mf3DS = { init: (k: string) => Promise<void>; prepare: (s: unknown) => Promise<void>; start: (c: Card) => Promise<Record<string, unknown> | undefined>; finish: (r: unknown) => Promise<void> };
const loadScript = (src: string) => new Promise<void>((ok, no) => {
  if (document.querySelector(`script[src="${src}"]`)) return ok();
  const el = document.createElement("script"); el.type = "module"; el.src = src; el.onload = () => ok(); el.onerror = () => no(new Error("script")); document.head.appendChild(el);
});
const waitFor = async <T,>(get: () => T | undefined, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = get(); if (v) return v; await new Promise((r) => setTimeout(r, 100)); } throw new Error("timeout"); };
const w = () => window as unknown as { MasterFy?: MfTok; MasterFyThreeDS?: Mf3DS };
const cardErrMsg: Record<string, string> = { INVALID_CARD_NUMBER: "Número do cartão inválido.", INVALID_CARD_HOLDER: "Informe o nome impresso no cartão.", INVALID_EXP_MONTH: "Mês de validade inválido.", INVALID_EXP_YEAR: "Ano de validade inválido.", CARD_EXPIRED: "Cartão vencido.", INVALID_CVV: "CVV inválido.", THREEDS_AUTHENTICATION_FAILED: "A autenticação do banco não foi concluída. Tente novamente." };

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Finalizar compra - Mini Cooler IcedCar | Gelaki Brasil" },
    { name: "description", content: "Checkout seguro do seu Mini Cooler IcedCar personalizado. PIX com 10% de desconto ou até 12x no cartão." },
    { property: "og:title", content: "Checkout seguro | Gelaki Brasil" },
    { property: "og:description", content: "Finalize seu IcedCar personalizado com PIX e 10% de desconto." },
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
const box: CSSProperties = { padding: 20, background: "#fff", border: "1px solid var(--kids-borda)", borderRadius: 22, boxShadow: "var(--kids-sombra-card)" };

type F = Record<"ccNumber" | "ccHolder" | "ccExp" | "ccCvv" | "name" | "email" | "phone" | "cpf" | "cep" | "street" | "number" | "complement" | "district" | "city" | "state", string>;
const initial: F = { ccNumber: "", ccHolder: "", ccExp: "", ccCvv: "", name: "", email: "", phone: "", cpf: "", cep: "", street: "", number: "", complement: "", district: "", city: "", state: "" };

function luhn(n: string) { let s = 0; for (let i = 0; i < n.length; i++) { let d = Number(n[n.length - 1 - i]); if (i % 2) { d *= 2; if (d > 9) d -= 9; } s += d; } return s % 10 === 0; }

function Checkout() {
  const [order, setOrder] = useState<Order | null>(null);
  const prod = order?.product ? productBySlug(order.product) : undefined;
  const [loaded, setLoaded] = useState(false);
  const [f, setF] = useState<F>(initial);
  const [err, setErr] = useState<Partial<Record<keyof F, string | undefined>>>({});
  const [cepLoading, setCepLoading] = useState(false);
  const [secs, setSecs] = useState(15 * 60);
  const [viewers] = useState(() => 9 + Math.floor(Math.random() * 14));
  const [busy, setBusy] = useState(false);
  const [payErr, setPayErr] = useState("");
  const [pix, setPix] = useState<{ copypaste: string; amount: number; orderId: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const pay = useServerFn(createPixPayment);
  const payCard = useServerFn(createCardPayment);
  const checkStatus = useServerFn(getPaymentStatus);
  const fetchKey = useServerFn(getTokenizationKey);
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [inst, setInst] = useState(1);
  const [pk, setPk] = useState("");
  const [cardReady, setCardReady] = useState(false);
  const [payId, setPayId] = useState("");
  const [status, setStatus] = useState("");
  const [cardDone, setCardDone] = useState<{ amount: number; orderId: string } | null>(null);
  useEffect(() => {
    const payment = pix ?? cardDone;
    if (payment) reportConfirmedPurchase(status, payment.amount, payId);
  }, [status, pix, cardDone, payId]);

  // load Masterfy tokenizer + 3DS when card is chosen
  useEffect(() => {
    if (method !== "card" || cardReady) return;
    let off = false;
    (async () => {
      try {
        const k = pk || (await fetchKey()).key; if (!k) throw new Error("nokey"); setPk(k);
        await loadScript("https://api.masterfypagamentos.com/v1/scripts");
        await loadScript("https://api.masterfypagamentos.com/v1/scripts/3ds").catch(() => undefined);
        const tok = await waitFor(() => w().MasterFy); await tok.init(k);
        const t3 = w().MasterFyThreeDS; if (t3) await t3.init(k).catch(() => undefined);
        if (!off) setCardReady(true);
      } catch { if (!off) setPayErr("Pagamento com cartão indisponível no momento. Use o PIX."); }
    })();
    return () => { off = true; };
  }, [method, cardReady, pk, fetchKey]);

  // poll payment status until paid
  useEffect(() => {
    if (!payId || status === "PAID") return;
    const t = setInterval(async () => { try { const r = await checkStatus({ data: { id: payId, ...(pix ? { amount: pix.amount } : {}) } }); setStatus(r.status); } catch { /* retry */ } }, 5000);
    return () => clearInterval(t);
  }, [payId, status, checkStatus, pix]);

  useEffect(() => {
    try { const o = JSON.parse(sessionStorage.getItem(ORDER_KEY) || "null"); if (o && Array.isArray(o.items) && isValidOrder(o)) setOrder(o); } catch { /* empty */ }
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
    const e: Partial<Record<keyof F, string | undefined>> = {};
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
    if (method === "card") {
      const n = f.ccNumber.replace(/\D/g, "");
      if (!/^\d{13,19}$/.test(n) || !luhn(n)) e.ccNumber = "Número do cartão inválido.";
      if (f.ccHolder.trim().length < 3) e.ccHolder = "Nome como está no cartão.";
      const [m, y] = f.ccExp.split("/");
      const now = new Date(); const yy = 2000 + Number(y);
      if (!m || !y || y.length !== 2 || Number(m) < 1 || Number(m) > 12 || yy < now.getFullYear() || (yy === now.getFullYear() && Number(m) < now.getMonth() + 1)) e.ccExp = "Validade inválida.";
      if (!/^\d{3,4}$/.test(f.ccCvv)) e.ccCvv = "CVV inválido.";
    }
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
    const common = { utms: getUtms(),
      order,
      payer: { name: f.name.trim(), email: f.email.trim(), phone: f.phone.replace(/\D/g, ""), taxId: f.cpf.replace(/\D/g, "") },
      address: { zipCode: f.cep.replace(/\D/g, ""), state: f.state.toUpperCase(), city: f.city.trim(), district: f.district.trim(), street: f.street.trim(), number: f.number.trim(), complement: f.complement.trim() || undefined },
    };
    if (method === "pix") {
      try {
        const r = await pay({ data: common });
        if (r.ok) { setPix(r); setPayId(r.id); sessionStorage.removeItem(ORDER_KEY); window.scrollTo({ top: 0, behavior: "smooth" }); }
        else setPayErr(r.error);
      } catch { setPayErr("Confira os dados informados e tente novamente."); }
      finally { setBusy(false); }
      return;
    }
    let created = false;
    try {
      const tok = w().MasterFy; if (!cardReady || !tok) throw Object.assign(new Error("x"), { name: "Load" });
      const [m, y] = f.ccExp.split("/");
      if (!m || !y) throw new Error("Validade inválida");
      const card: Card = { number: f.ccNumber.replace(/\D/g, ""), holder: f.ccHolder.trim().toUpperCase(), expMonth: m.padStart(2, "0"), expYear: "20" + y, cvv: f.ccCvv };
      const t3 = w().MasterFyThreeDS;
      let threeDS: Record<string, unknown> | undefined;
      if (t3) {
        try {
          await t3.prepare({ amount: cardSubtotal(order), currency: "BRL", method: "CREDIT_CARD", card: { installments: inst }, payer: { name: common.payer.name, email: common.payer.email, taxId: common.payer.taxId, phone: "+55" + common.payer.phone } });
          threeDS = (await t3.start(card)) ?? undefined;
        } catch { threeDS = undefined; }
      }
      const token = await tok.encrypt(card);
      const r = await payCard({ data: { ...common, card: { token, installments: inst, ...(threeDS ? { threeDS } : {}) }, returnUrl: window.location.origin.startsWith("https://") ? window.location.href : undefined } });
      if (!r.ok) { setPayErr(r.error); return; }
      created = true;
      setPayId(r.id); setStatus(r.status); sessionStorage.removeItem(ORDER_KEY);
      if (t3) await t3.finish(JSON.parse(r.response)).catch(() => undefined);
      setCardDone({ amount: r.amount, orderId: r.orderId }); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      const code = (e as { code?: string; message?: string }).code || (e as Error).message;
      setPayErr(cardErrMsg[code] ?? "Não foi possível processar o cartão. Confira os dados ou pague no PIX.");
    } finally { if (!created) setBusy(false); }
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

        {!loaded ? null : status === "PAID" ? (
          <main className="mx-auto max-w-lg px-4 pb-16">
            <div className="p-6 text-center" style={box}>
              <p className="text-4xl">✅</p>
              <h1 className="kids-titulo mt-2 text-2xl">Pagamento confirmado!</h1>
              <p className="mt-2 text-sm" style={{ color: "var(--kids-texto-suave)" }}>Obrigado! Seu IcedCar personalizado já entrou na fila de produção. Você recebe as atualizações por e-mail e WhatsApp.</p>
              <Link to="/" className="kids-btn kids-btn-cta mt-5 inline-flex">Voltar à loja</Link>
            </div>
          </main>
        ) : cardDone ? (
          <main className="mx-auto max-w-lg px-4 pb-16">
            <div className="p-6 text-center" style={box}>
              <p className="text-3xl">💳</p>
              <h1 className="kids-titulo mt-2 text-2xl">{status === "REFUSED" ? "Pagamento recusado" : "Pagamento em análise"}</h1>
              <p className="mt-2 text-sm" style={{ color: "var(--kids-texto-suave)" }}>{status === "REFUSED" ? "O banco recusou o cartão. Volte e tente outro cartão ou o PIX." : `Pedido ${cardDone.orderId} · ${brl(cardDone.amount)}. Estamos confirmando com o banco, isso leva poucos segundos.`}</p>
              {status !== "REFUSED" && <p className="mt-4 text-xs font-semibold" style={{ color: "var(--kids-cta)" }}>⏳ Aguardando confirmação…</p>}
            </div>
          </main>
        ) : pix ? (
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
              <p className="mt-3 text-xs font-semibold" style={{ color: "var(--kids-cta)" }}>⏳ Aguardando pagamento… esta tela atualiza sozinha quando o PIX cair.</p>
              <p className="mt-2 text-xs font-semibold" style={{ color: "var(--kids-sale)" }}>⏱ O código expira em breve — pague agora para garantir o preço.</p>
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
          <main className="mx-auto grid max-w-2xl gap-5 px-4 pb-16">
            <div className="order-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-2xl px-4 py-3 text-center text-sm font-bold" style={{ background: "var(--kids-sale-suave)", color: "var(--kids-sale)" }}>
              <span>⏱ Seu desconto está reservado por <span className="tabular-nums">{mm}:{ss}</span></span>
              <span className="text-xs font-semibold">🔥 {viewers} pessoas vendo este produto agora · restam poucas unidades</span>
            </div>


            <form onSubmit={submit} noValidate className="order-3 space-y-5">
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
                {(["pix", "card"] as const).map((m) => (
                  <button key={m} type="button" aria-pressed={method === m} onClick={() => { setMethod(m); setPayErr(""); }} className="mb-3 block w-full rounded-2xl p-4 text-left"
                    style={{ border: `2px solid ${method === m ? "var(--kids-rosa)" : "var(--kids-borda)"}`, background: method === m ? "var(--kids-rosa-suave)" : "#fff" }}>
                    <div className="flex items-center justify-between"><span className="font-bold">{method === m ? "◉" : "○"} {m === "pix" ? "PIX" : "Cartão de crédito"}</span>
                      {m === "pix" ? <span className="kids-selo" style={{ background: "var(--kids-cta)", color: "#fff" }}>{Math.round(PIX_DISCOUNT * 100)}% OFF · {brl(pixTotal(order))}</span> : <span className="text-xs font-bold">{brl(cardTotal(order))} em até {MAX_INSTALLMENTS}x</span>}</div>
                    <p className="mt-1 text-xs" style={{ color: "var(--kids-texto-suave)" }}>{m === "pix" ? "Aprovação imediata. O QR Code aparece logo após finalizar." : `Até ${MAX_INSTALLMENTS}x de ${brl(Math.ceil(cardTotal(order) / MAX_INSTALLMENTS))} sem juros.`}</p>
                  </button>
                ))}
                {method === "card" && (
                  <div className="grid grid-cols-6 gap-3">
                    {field("ccNumber", "Número do cartão", { inputMode: "numeric", autoComplete: "cc-number", className: "col-span-6", fmt: (v) => v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 "), placeholder: "0000 0000 0000 0000" })}
                    {field("ccHolder", "Nome impresso no cartão", { autoComplete: "cc-name", className: "col-span-6", maxLength: 60, fmt: (v) => v.toUpperCase() })}
                    {field("ccExp", "Validade", { inputMode: "numeric", autoComplete: "cc-exp", className: "col-span-3", placeholder: "MM/AA", fmt: (v) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2") })}
                    {field("ccCvv", "CVV", { inputMode: "numeric", autoComplete: "cc-csc", className: "col-span-3", placeholder: "123", fmt: (v) => v.replace(/\D/g, "").slice(0, 4) })}
                    <div className="col-span-6">
                      <label htmlFor="co-inst" className="mb-1 block text-xs font-bold">Parcelas</label>
                      <select id="co-inst" value={inst} onChange={(e) => setInst(Number(e.target.value))} className="h-12 w-full rounded-xl px-3 text-base md:text-sm" style={{ border: "1px solid var(--kids-borda)", background: "#fff" }}>
                        {Array.from({ length: MAX_INSTALLMENTS }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}x de {brl(Math.ceil(cardTotal(order) / n))} sem juros</option>)}
                      </select>
                    </div>
                    {!cardReady && !payErr && <p className="col-span-6 text-xs" style={{ color: "var(--kids-texto-suave)" }}>Carregando pagamento seguro…</p>}
                  </div>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="flex h-6 items-center rounded border px-2 text-[11px] font-bold" style={{ color: "var(--kids-cta)", background: "#fff" }}>PIX</span>
                  {["visa", "mastercard", "elo", "hipercard", "amex"].map((b) => <img key={b} src={`https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/${b}.svg`} alt={b} loading="lazy" className="rounded" style={{ height: 24, width: 38, maxWidth: 38, objectFit: "contain", display: "inline-block" }} />)}
                </div>
                <div className="mt-4 rounded-2xl p-3 text-xs" style={{ background: "var(--kids-sale-suave)" }}>
                  <p className="font-bold" style={{ color: "var(--kids-sale)" }}>⚠️ Finalize apenas se for pagar agora</p>
                  <p className="mt-1" style={{ color: "var(--kids-texto)" }}>{prod ? "Estoque limitado: ao finalizar, sua unidade fica reservada para você." : "Cada IcedCar é produzido sob encomenda. Ao finalizar, sua vaga na produção fica reservada para você."} Se não for concluir agora, deixe a vez para quem está aguardando.</p>
                </div>
                {payErr && <p role="alert" className="mt-3 rounded-xl px-3 py-2 text-sm font-semibold" style={{ background: "var(--kids-sale-suave)", color: "var(--kids-sale)" }}>{payErr}</p>}
                <button type="submit" disabled={busy} className="kids-btn kids-btn-cta mt-4 w-full disabled:opacity-60">{busy ? (method === "pix" ? "Gerando PIX…" : "Processando cartão…") : method === "pix" ? `Pagar com PIX · ${brl(pixTotal(order))}` : `Pagar ${inst}x de ${brl(Math.ceil(cardTotal(order) / inst))}`}</button>
                <p className="mt-2 text-center text-[11px] font-semibold" style={{ color: "var(--kids-texto-suave)" }}>🛡️ Ambiente protegido com criptografia SSL</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
                  {[["🔒", "Compra 100% segura"], ["🚚", "Envio com rastreio para todo Brasil"], ["↩️", "7 dias de garantia"]].map(([i, t]) => (
                    <div key={t} className="flex flex-col items-center gap-1 rounded-2xl p-3" style={{ border: "1px solid var(--kids-borda)", background: "#fff" }}><span className="text-lg">{i}</span>{t}</div>
                  ))}
                </div>
                <p className="mt-3 rounded-xl px-3 py-2 text-center text-xs font-semibold" style={{ background: "var(--kids-fundo-suave)" }}>📅 Produção em até 3 dias úteis + entrega pelos Correios · código de rastreio por e-mail e WhatsApp</p>
              </section>
            </form>

            <aside className="order-2">
              <div className="space-y-3 p-5" style={box}>
                <h2 className="kids-titulo text-lg">Resumo do pedido</h2>
                {prod && (
                  <div className="flex gap-3 rounded-2xl p-3" style={{ background: "var(--kids-fundo-suave)" }}>
                    <img src={prod.images[0]?.src} alt="" className="h-16 w-16 flex-shrink-0 rounded-xl object-contain" style={{ background: "#fff" }} /><div className="min-w-0 text-xs"><p className="text-sm font-bold">{prod.name}</p><p>Quantidade: {order.quantity} · {brl(prod.price)} cada</p></div>
                  </div>
                )}
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
                {prod ? <Link to="/produtos/$slug" params={{ slug: prod.slug }} className="block text-xs font-semibold underline" style={{ color: "var(--kids-rosa-texto)" }}>Alterar quantidade</Link> : <Link to="/" className="block text-xs font-semibold underline" style={{ color: "var(--kids-rosa-texto)" }}>Editar personalização</Link>}
                <dl className="space-y-1 pt-2 text-sm" style={{ borderTop: "1px solid var(--kids-borda)" }}>
                  <div className="flex justify-between"><dt>Subtotal</dt><dd>{brl(subtotal(order))}</dd></div>
                  {method === "card" ? <div className="flex justify-between"><dt>Preço no cartão</dt><dd>{brl(cardSubtotal(order))}</dd></div> : null}
                  {method === "pix" && <div className="flex justify-between" style={{ color: "var(--kids-cta)" }}><dt>Desconto PIX ({Math.round(PIX_DISCOUNT * 100)}%)</dt><dd>−{brl(subtotal(order) + shipping(order) - pixTotal(order))}</dd></div>}
                  <div className="flex justify-between"><dt>Frete</dt><dd>{shipping(order) ? brl(shipping(order)) : "Grátis"}</dd></div>
                  <div className="flex justify-between pt-2 text-lg font-bold"><dt>{method === "pix" ? "Total no PIX" : "Total no cartão"}</dt><dd style={{ color: "var(--kids-cta)" }}>{brl(method === "pix" ? pixTotal(order) : cardTotal(order))}</dd></div>
                  {method === "pix" && <p className="text-right text-[11px] line-through" style={{ color: "var(--kids-texto-suave)" }}>No cartão {brl(cardTotal(order))}</p>}
                </dl>
                <div className="rounded-2xl p-3 text-xs" style={{ background: "var(--kids-fundo-suave)" }}>
                  <p>⭐⭐⭐⭐⭐ “Ficou idêntico ao meu carro, presente perfeito!”</p>
                  <p className="mt-1 font-semibold" style={{ color: "var(--kids-texto-suave)" }}>— cliente verificado</p>
                </div>
              </div>
            </aside>
          </main>
        )}
        <p className="pb-8 text-center text-xs" style={{ color: "var(--kids-texto-suave)" }}>Gelaki Brasil · CNPJ 19.633.664/0001-16 · <Link to="/rastreio" className="underline">Rastrear pedido</Link> · <a href="/privacidade" className="underline">Privacidade e cookies</a></p>
      </div>
    </>
  );
}
