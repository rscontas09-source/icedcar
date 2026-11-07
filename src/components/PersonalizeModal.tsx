import { useState, type CSSProperties } from "react";
import { useNavigate } from "@tanstack/react-router";
import { type Customization, ORDER_KEY, PRIORITY_PRICE, UNIT_PRICE, brl } from "@/lib/order";

const LADOS = ["Frente", "Traseira"];
const TIPOS = ["Picape", "SUV", "Sedã", "Hatch", "Esportivo / Coupé", "Conversível"];
const MARCAS: Record<string, string[]> = {
  Chevrolet: ["Onix", "Tracker", "S10", "Cruze", "Spin", "Montana", "Camaro"],
  Fiat: ["Strada", "Toro", "Argo", "Mobi", "Pulse", "Fastback", "Uno"],
  Volkswagen: ["Gol", "Polo", "T-Cross", "Nivus", "Amarok", "Saveiro", "Virtus"],
  Toyota: ["Hilux", "Corolla", "Corolla Cross", "Yaris", "SW4", "RAV4"],
  Hyundai: ["HB20", "Creta", "Tucson", "Santa Fe"],
  Honda: ["Civic", "City", "HR-V", "Fit", "CR-V"],
  Jeep: ["Renegade", "Compass", "Commander", "Wrangler"],
  Ford: ["Ranger", "Ka", "EcoSport", "Mustang", "Maverick", "Territory"],
  Renault: ["Kwid", "Duster", "Sandero", "Oroch", "Kardian"],
  Nissan: ["Kicks", "Frontier", "Versa", "Sentra"],
  Mitsubishi: ["L200 Triton", "Pajero", "Outlander", "Eclipse Cross"],
  BMW: ["320i", "X1", "X3", "X5", "M3"],
  "Mercedes-Benz": ["Classe A", "Classe C", "GLA", "GLC"],
  Audi: ["A3", "A4", "Q3", "Q5"],
  Peugeot: ["208", "2008", "3008"],
  RAM: ["Rampage", "1500", "2500"],
  BYD: ["Dolphin", "Song Plus", "Seal", "Yuan Plus"],
  Porsche: ["911", "Cayenne", "Macan"],
};
const ANOS = Array.from({ length: 2027 - 1980 }, (_, i) => String(2026 - i));
const CORES: [string, string][] = [["Branco", "#fff"], ["Preto", "#1e2225"], ["Prata", "#b8bec2"], ["Cinza", "#737a80"], ["Azul", "#2d528a"], ["Vermelho", "#b42d29"], ["Verde", "#347752"], ["Bege", "#ccbea9"], ["Marrom", "#694833"]];

const empty = (): Customization => ({ lado: "Frente", tipo: "Picape", marca: "", modelo: "", ano: "", cor: "", placa: "", prioridade: false });

const sel = (on: boolean): CSSProperties => on
  ? { border: "2px solid var(--kids-rosa)", color: "var(--kids-rosa-texto)", background: "var(--kids-rosa-suave)" }
  : { border: "2px solid var(--kids-borda)", color: "var(--kids-texto)", background: "#fff" };

function Combo({ id, label, value, options, onChange, placeholder, error, inputMode }: { id: string; label: string; value: string; options: string[]; onChange: (v: string) => void; placeholder: string; error?: string; inputMode?: "numeric" }) {
  const [open, setOpen] = useState(false);
  const list = options.filter((o) => o.toLowerCase().includes(value.toLowerCase())).slice(0, 8);
  return (
    <div id={id}>
      <label htmlFor={`${id}-in`} className="mb-2 block text-sm font-bold">{label}</label>
      <div className="relative">
        <input id={`${id}-in`} role="combobox" aria-expanded={open} aria-invalid={!!error} autoComplete="off" inputMode={inputMode} placeholder={placeholder} value={value}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          className="h-12 w-full rounded-xl px-3 text-base md:text-sm" style={{ border: `1px solid ${error ? "var(--kids-sale)" : "var(--kids-borda)"}`, background: "#fff" }} />
        {open && list.length > 0 && (
          <ul role="listbox" className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl py-1" style={{ background: "#fff", border: "1px solid var(--kids-borda)", boxShadow: "var(--kids-sombra-card)" }}>
            {list.map((o) => <li key={o}><button type="button" role="option" aria-selected={o === value} className="w-full px-3 py-2 text-left text-sm" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(o); setOpen(false); }}>{o}</button></li>)}
          </ul>
        )}
      </div>
      {error ? <p className="mt-1 text-xs font-semibold" style={{ color: "var(--kids-sale)" }}>{error}</p> : <p className="mt-1 text-[11px]" style={{ color: "var(--kids-texto-suave)" }}>Não achou na lista? É só digitar.</p>}
    </div>
  );
}

export function PersonalizeModal({ quantity, onClose }: { quantity: number; onClose: () => void }) {
  const navigate = useNavigate();
  const [items, setItems] = useState<Customization[]>(() => Array.from({ length: quantity }, empty));
  const [idx, setIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const it = items[idx] ?? items[0]!;
  const set = (patch: Partial<Customization>) => { setItems(items.map((x, i) => (i === idx ? { ...x, ...patch } : x))); setErrors({}); };

  const validate = (c: Customization) => {
    const e: Record<string, string> = {};
    if (!c.marca.trim()) e.marca = "Informe a marca do carro.";
    if (!c.modelo.trim()) e.modelo = "Informe o modelo do carro.";
    if (!/^\d{4}$/.test(c.ano) || +c.ano < 1950 || +c.ano > 2027) e.ano = "Informe um ano válido (ex.: 2022).";
    if (!c.cor) e.cor = "Escolha a cor do carro.";
    if (!c.placa.trim()) e.placa = "Digite o nome da placa.";
    return e;
  };

  const next = () => {
    const e = validate(it);
    if (Object.keys(e).length) { setErrors(e); document.getElementById(`pers-${Object.keys(e)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (idx < items.length - 1) { setIdx(idx + 1); return; }
    sessionStorage.setItem(ORDER_KEY, JSON.stringify({ quantity: items.length, items }));
    navigate({ to: "/checkout" });
  };

  const total = items.reduce((s, i) => s + UNIT_PRICE + (i.prioridade ? PRIORITY_PRICE : 0), 0);
  const summary = [it.lado, it.tipo, it.marca, it.modelo, it.ano, it.cor, it.placa && `“${it.placa}”`].filter(Boolean).join(" · ");

  return (
    <div className="import-overlay" role="dialog" aria-modal="true" aria-labelledby="kids-personalizar-titulo">
      <button className="import-backdrop" aria-label="Fechar" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col overflow-hidden rounded-t-[28px] md:inset-0 md:m-auto md:h-fit md:max-h-[88vh] md:max-w-lg md:rounded-[28px]" style={{ background: "var(--kids-fundo)", boxShadow: "var(--kids-sombra-overlay)" }}>
        <div className="flex items-start gap-3 px-5 pb-3 pt-5" style={{ borderBottom: "1px solid var(--kids-borda)" }}>
          <div className="min-w-0 flex-1">
            <h2 id="kids-personalizar-titulo" className="kids-titulo text-xl leading-tight md:text-2xl">Personalize seu IcedCar</h2>
            <p className="mt-0.5 text-xs" style={{ color: "var(--kids-texto-suave)" }}>{items.length > 1 ? `Unidade ${idx + 1} de ${items.length}` : "1 unidade"}</p>
          </div>
          <button type="button" aria-label="Fechar" className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full" style={{ background: "var(--kids-fundo-suave)" }} onClick={onClose}>✕</button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <div><p className="mb-2 text-sm font-bold">Qual lado do seu carro?</p>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">{LADOS.map((o) => <button key={o} type="button" role="radio" aria-checked={it.lado === o} className="min-h-[44px] rounded-2xl px-3 py-2 text-sm font-semibold" style={sel(it.lado === o)} onClick={() => set({ lado: o })}>{o}</button>)}</div></div>
          <div><p className="mb-2 text-sm font-bold">Tipo do carro</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup">{TIPOS.map((o) => <button key={o} type="button" role="radio" aria-checked={it.tipo === o} className="min-h-[44px] rounded-2xl px-3 py-2 text-sm font-semibold leading-tight" style={sel(it.tipo === o)} onClick={() => set({ tipo: o })}>{o}</button>)}</div></div>
          <Combo id="pers-marca" label="Marca" placeholder="Busque a marca" value={it.marca} options={Object.keys(MARCAS)} onChange={(v) => set({ marca: v, modelo: v === it.marca ? it.modelo : "" })} error={errors["marca"]} />
          <Combo id="pers-modelo" label="Modelo" placeholder={it.marca ? "Busque o modelo" : "Escolha a marca primeiro"} value={it.modelo} options={MARCAS[it.marca] ?? []} onChange={(v) => set({ modelo: v })} error={errors["modelo"]} />
          <Combo id="pers-ano" label="Ano" placeholder="Busque o ano" inputMode="numeric" value={it.ano} options={ANOS} onChange={(v) => set({ ano: v.replace(/\D/g, "").slice(0, 4) })} error={errors["ano"]} />
          <div id="pers-cor"><p className="mb-2 text-sm font-bold">Cor do carro</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup">{CORES.map(([n, c]) => <button key={n} type="button" role="radio" aria-checked={it.cor === n} className="flex min-h-[44px] items-center gap-2 rounded-2xl px-2.5 py-2 text-left text-xs font-semibold" style={sel(it.cor === n)} onClick={() => set({ cor: n })}><span aria-hidden className="h-5 w-5 flex-shrink-0 rounded-full" style={{ background: c, border: "1px solid rgba(0,0,0,.18)" }} /><span className="truncate">{n}</span></button>)}</div>
            {errors["cor"] && <p className="mt-1 text-xs font-semibold" style={{ color: "var(--kids-sale)" }}>{errors["cor"]}</p>}</div>
          <div id="pers-placa"><label htmlFor="pers-placa-in" className="mb-2 block text-sm font-bold">Nome na placa</label>
            <div aria-hidden className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[10px] bg-white" style={{ border: "3px solid #1d1d1f" }}>
              <div className="flex items-center justify-between px-2 py-[3px]" style={{ background: "#1f47a8", color: "#fff" }}><span className="text-[9px] font-bold">BR</span><span className="text-[10px] font-bold tracking-[0.3em]">BRASIL</span><span className="inline-block h-[9px] w-[14px] rounded-[1px]" style={{ background: "linear-gradient(135deg,#1a9b3c 35%,#f5d000 35% 65%,#1a9b3c 65%)" }} /></div>
              <div className="flex h-[58px] items-center justify-center px-3 font-bold uppercase" style={{ fontFamily: '"DIN Condensed","Arial Narrow","Roboto Condensed",Arial,sans-serif', fontSize: 28, letterSpacing: "0.08em", color: it.placa ? "#1d1d1f" : "#c9c9c9", whiteSpace: "nowrap" }}>{it.placa || "SEU NOME"}</div>
            </div>
            <div className="relative mt-3"><input id="pers-placa-in" aria-invalid={!!errors["placa"]} placeholder="SEU NOME" maxLength={10} autoComplete="off" value={it.placa} onChange={(e) => set({ placa: e.target.value.toUpperCase().replace(/[^A-Z0-9À-Ú ]/g, "").slice(0, 10) })} className="h-12 w-full rounded-xl px-3 pr-14 text-base md:text-sm" style={{ border: `1px solid ${errors["placa"] ? "var(--kids-sale)" : "var(--kids-borda)"}`, background: "#fff" }} /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--kids-texto-suave)" }}>{it.placa.length}/10</span></div>
            {errors["placa"] && <p className="mt-1 text-xs font-semibold" style={{ color: "var(--kids-sale)" }}>{errors["placa"]}</p>}</div>
          <button type="button" role="switch" aria-checked={it.prioridade} onClick={() => set({ prioridade: !it.prioridade })} className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left" style={sel(it.prioridade)}>
            <span className="min-w-0 flex-1 text-sm font-bold">Produção com prioridade <span style={{ color: "var(--kids-rosa-texto)" }}>(+R$ 14,90)</span><span className="block text-[11px] font-normal" style={{ color: "var(--kids-texto-suave)" }}>Seu pedido entra na frente da fila de produção.</span></span>
            <span aria-hidden className="relative h-7 w-12 flex-shrink-0 rounded-full" style={{ background: it.prioridade ? "var(--kids-rosa)" : "rgba(0,0,0,.18)" }}><span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white transition-transform" style={{ transform: it.prioridade ? "translateX(20px)" : "none" }} /></span>
          </button>
        </div>
        <div className="px-5 pb-5 pt-3" style={{ borderTop: "1px solid var(--kids-borda)" }}>
          <p className="mb-2 line-clamp-2 text-xs" aria-live="polite" style={{ color: "var(--kids-texto-suave)" }}>{summary}</p>
          <div className="flex gap-2">
            {idx > 0 && <button type="button" className="kids-btn kids-btn-rosa" onClick={() => setIdx(idx - 1)}>Voltar</button>}
            <button type="button" className="kids-btn kids-btn-cta flex-1" onClick={next}>{idx < items.length - 1 ? `Próxima unidade (${idx + 2}/${items.length})` : `Finalizar compra · ${brl(total)}`}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
