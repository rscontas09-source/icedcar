import type { CSSProperties } from "react";
import { Fragment, useEffect, useRef } from "react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import capturedCSS from "../styles/site.css?raw";
import { PersonalizeModal } from "@/components/PersonalizeModal";
import { CartDrawer, readOrder } from "@/components/CartDrawer";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Mini Cooler IcedCar 45L Personalizado com Seu Carro - Gelaki Brasil" },
    { name: "description", content: "Mini Cooler IcedCar personalizado de 45 litros com seu carro e seu nome na placa. Gelaki Brasil." },
    { property: "og:title", content: "Mini Cooler IcedCar Personalizado | Gelaki Brasil" },
    { property: "og:description", content: "Conheça o IcedCar de 45 litros personalizado com seu carro e seu nome na placa." },
    { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }
  ] }),
  staticData: { importedDocument: { html: { "lang": "pt-BR" }, body: { "data-tema": "kids" } } },
  component: Index,
});

function Index() {
  const [activeSlide0, setActiveSlide0] = useState(0);
  const [panel, setPanel] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => { setCartCount(readOrder()?.items.length ?? 0); }, [panel]);
  const [quantity, setQuantity] = useState(1);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [fields, setFields] = useState<Record<string, string>>({});
  const [shippingError, setShippingError] = useState(false);
  const [validation, setValidation] = useState(false);
  const [search, setSearch] = useState("");
  const lastFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openPanel = (name: string) => { lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setPanel(name); setValidation(false); };
  const closePanel = () => { setPanel(null); lastFocus.current?.focus(); };
  useEffect(() => {
    if (!panel) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>('button, input, a')?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
      if (event.key === "Tab") {
        const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, input, a, [tabindex="0"]') ?? []).filter(e => e.getBoundingClientRect().width > 0 && e.getAttribute("tabindex") !== "-1");
        const first = items[0]; const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", keys);
    return () => { document.body.style.overflow = prior; document.removeEventListener("keydown", keys); };
  }, [panel]);
  const gallery = ["62b91b6cf7e1c3b3.png", "d13ce69f22a0e9fb.png", "a26fb4e9ae8651c4.png", "5fcdf01e7aa5287d.webp", "f74af6715e67af2f.png", "dcbda0caf343600d.webp", "97f8fd3f86de5ce1.webp"];

  const carouselContent0 = (<>
<Fragment>
<div className={"w-full \x70x-4 \x70y-2"} style={{ background: "var(--kids-rosa)", color: "rgb(255, 255, 255)" }} aria-live="polite" data-site-import-desktop-variant="">
  <span className={"block truncate text-center text-[13px] \x66ont-semibold"}>PIX com 5% de desconto ou até 12x no cartão</span>
</div>
<div className={"w-full \x70x-4 \x70y-2"} style={{ background: "var(--kids-rosa)", color: "rgb(255, 255, 255)", "--site-import-responsive-display": "block" } as CSSProperties} aria-live="polite" data-site-import-mobile-variant="">
  <a className={"block \x75nderline-offset-2 \x68over:\x75nderline"} href="/rastreamento">
    <span className={"block truncate text-center text-[13px] \x66ont-semibold"}>Enviamos com código de rastreio</span>
  </a>
</div>
<header className={"sticky top-0 z-40 w-full \x62order-b transition-shadow"} style={{ background: "var(--kids-fundo)", borderColor: "var(--kids-borda)", boxShadow: "none" }}>
  <div className={"\x6dx-auto grid h-16 max-w-6xl grid-cols-[88px_1fr_88px] items-center \x70x-4 \x6dd:\x68-20 \x6dd:\x67rid-cols-[\x31fr_auto_1fr] \x6dd:\x67ap-6"}>
    <div className="flex items-center justify-start gap-0">
      <button className={"grid h-11 w-11 place-items-center rounded-full \x6dd:\x68idden"} type="button" aria-label="Abrir menu" onClick={() => openPanel("menu")} aria-expanded={panel === "menu"}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
      <button className={"kids-busca-header grid h-11 w-11 place-items-center rounded-full \x6dd:\x66lex \x6dd:\x77-full \x6dd:\x6dax-w-[\x3300px] \x6dd:\x69tems-center \x6dd:\x6austify-start \x6dd:\x67ap-2.\x35 \x6dd:\x70x-4 \x6dd:\x74ext-sm"} style={{ color: "var(--kids-texto)" }} type="button" aria-label="Buscar produtos" onClick={() => openPanel("search")}>
        <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
          <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span className={"hidden \x6dd:\x69nline"} style={{ color: "var(--kids-texto-suave)" }}>Buscar produtos</span>
      </button>
    </div>
    <a className="justify-self-center" aria-label="Ir para a home" href="/">
      <img className={"h-11 w-auto max-w-full object-contain \x6dd:\x68-14"} style={{ color: "transparent" }} alt="Gelaki Brasil" loading="eager" width="105" height="44" decoding="async" src="/site-assets/da3afb74f22ad006.png" />
    </a>
    <div className="flex items-center justify-end gap-0">
      <a className="grid h-11 w-11 place-items-center rounded-full" aria-label="Rastrear pedido" href="/rastreamento">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 17.8h1.87a1.71 1.71 0 0 0 1.71-1.72V11.25a3.27 3.27 0 0 0-3.27-3.27H14.4l-.1 7.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.71 18.18c1.57 0 3.1-.16 4.57-.32m-9.94-.09a1.78 1.78 0 0 1-1.58-1.56c-.19-1.6-.4-3.26-.4-4.96s.21-3.37.4-4.96a1.78 1.78 0 0 1 1.58-1.56c1.72-.19 3.52-.41 5.37-.41s3.64.22 5.37.41a1.78 1.78 0 0 1 1.57 1.56c.07.56.14 1.13.2 1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.06 21.07a2.89 2.89 0 1 1 0-5.79 2.89 2.89 0 0 1 0 5.79ZM5.83 21.07a2.89 2.89 0 1 1 0-5.79 2.89 2.89 0 0 1 0 5.79Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <button className="relative grid h-11 w-11 place-items-center rounded-full" type="button" aria-label="Abrir carrinho" onClick={() => openPanel("cart")}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M11 7H3.577A2 2 0 0 0 1.64 9.497l2.051 8A2 2 0 0 0 5.63 19H16.37a2 2 0 0 0 1.937-1.503l2.052-8A2 2 0 0 0 18.422 7H11Zm0 0V1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold" style={{ background: "var(--kids-sale)", color: "#fff" }}>{cartCount}</span>}</button>
    </div>
  </div>
  <nav className={"hidden \x62order-t \x6dd:\x62lock"} style={{ borderColor: "var(--kids-borda)" }} aria-label="Categorias">
    <ul className={"\x6dx-auto flex h-11 max-w-6xl items-center justify-center gap-1 \x70x-4 \x74ext-sm \x66ont-semibold"}>
      <li>
        <a className={"kids-nav-link rounded-full \x70x-4 \x70y-2"} href="/produtos">Todos os produtos</a>
      </li>
      <li>
        <a className={"kids-nav-link rounded-full \x70x-4 \x70y-2"} style={{ color: "var(--kids-rosa-texto)" }} href="/produtos?ordem=desconto">Promoções</a>
      </li>
    </ul>
  </nav>
</header>
<main className="flex-1">
  <div className={"\x6dx-auto max-w-6xl \x6dd:\x70x-4 \x6dd:\x70b-6 \x6dd:\x70t-5"}>
    <div className={"\x6dd:\x67rid \x6dd:\x67rid-cols-[\x6dinmax(\x30,\x31fr)\x5fminmax(\x30,\x31fr)] \x6dd:\x69tems-start \x6dd:\x67ap-10"}>
      <div className={"pb-6 \x6dd:\x73ticky \x6dd:\x74op-36 \x6dd:\x70b-0"}>
        <div className={"relative w-full select-none overflow-hidden \x6dd:\x72ounded-[\x320px] \x6dd:\x62order"} style={{ background: "rgb(255, 255, 255)", borderColor: "var(--kids-borda)", touchAction: "pan-y" }}>
          <div className={"relative w-full aspect-[var(--kids-galeria-formato)] \x6dd:\x61spect-square"} style={{ transform: "translateX(0px)", transition: "transform 220ms var(--kids-motion-curva)", "--kids-galeria-formato": "1 / 1.25" } as CSSProperties}>
            <img className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Mini Cooler IcedCar 45L Personalizado com Seu Carro" draggable="false" fetchPriority="high" decoding="async" sizes="(max-width: 767px) 100vw, 560px"  src={`/site-assets/${gallery[activeSlide0]}`} />
          </div>
          <button className="absolute bottom-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-full" style={{ background: "rgba(255, 255, 255, 0.92)", boxShadow: "var(--kids-sombra-card)", color: "var(--kids-texto)" }} type="button" aria-label="Ampliar imagem" onClick={() => openPanel("zoom")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
              <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
          <button className={"absolute top-1/2 hidden h-9 w-9 \x2dtranslate-y-1/\x32 place-items-center rounded-full \x6dd:\x67rid"} style={{ left: "8px", background: "rgba(255, 255, 255, 0.92)", boxShadow: "var(--kids-sombra-card)", color: "var(--kids-texto)" }} type="button" aria-label="Imagem anterior" onClick={() => setActiveSlide0(i => (i + 6) % 7)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={"absolute top-1/2 hidden h-9 w-9 \x2dtranslate-y-1/\x32 place-items-center rounded-full \x6dd:\x67rid"} style={{ right: "8px", background: "rgba(255, 255, 255, 0.92)", boxShadow: "var(--kids-sombra-card)", color: "var(--kids-texto)" }} type="button" aria-label="Próxima imagem" onClick={() => setActiveSlide0(i => (i + 1) % 7)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className={"absolute left-3 top-3 rounded-full \x70x-2 \x70y-0.\x35 text-[11px] \x66ont-bold \x6dd:\x68idden"} style={{ background: "rgba(255, 255, 255, 0.9)", color: "var(--kids-texto-suave)" }}>{activeSlide0 + 1}/7</span>
        </div>
        <div className={"mt-3 flex gap-2 overflow-x-auto \x70x-4 pb-1 \x6dd:\x70x-0"} style={{ scrollbarWidth: "none" } as CSSProperties}>
          <button className={"relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl p-[3px] \x6dd:\x68-16 \x6dd:\x77-16"} style={{ background: "rgb(255, 255, 255)", border: "2px solid var(--kids-rosa)" } as CSSProperties} type="button" aria-label="Ver imagem 1" onClick={() => setActiveSlide0(0)} aria-pressed={activeSlide0 === 0}>
            <span className="relative block h-full w-full overflow-hidden rounded-[9px]">
              <img className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="" loading="lazy" decoding="async" sizes="64px" srcSet="/site-assets/81bbeb2b87725fb9.webp 400w, /site-assets/ab325eff7fcfd3ee.webp 800w, /site-assets/e6165e2f1078e8fc.webp 1600w, /site-assets/62b91b6cf7e1c3b3.png 3840w" src="/site-assets/62b91b6cf7e1c3b3.png" />
            </span>
          </button>
          <button className={"relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl p-[3px] \x6dd:\x68-16 \x6dd:\x77-16"} style={{ background: "rgb(255, 255, 255)", border: "2px solid var(--kids-borda)" } as CSSProperties} type="button" aria-label="Ver imagem 2" onClick={() => setActiveSlide0(1)} aria-pressed={activeSlide0 === 1}>
            <span className="relative block h-full w-full overflow-hidden rounded-[9px]">
              <img className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="" loading="lazy" decoding="async" sizes="64px" srcSet="/site-assets/cd179ed5c93f1f5c.webp 400w, /site-assets/dd2bc8362bdb424e.webp 800w, /site-assets/26dce700461ffda3.webp 1600w, /site-assets/d13ce69f22a0e9fb.png 3840w" src="/site-assets/d13ce69f22a0e9fb.png" />
            </span>
          </button>
          <button className={"relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl p-[3px] \x6dd:\x68-16 \x6dd:\x77-16"} style={{ background: "rgb(255, 255, 255)", border: "2px solid var(--kids-borda)" } as CSSProperties} type="button" aria-label="Ver imagem 3" onClick={() => setActiveSlide0(2)} aria-pressed={activeSlide0 === 2}>
            <span className="relative block h-full w-full overflow-hidden rounded-[9px]">
              <img className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="" loading="lazy" decoding="async" sizes="64px" srcSet="/site-assets/db5cac137e7b8ab1.webp 400w, /site-assets/8c3b54c213f6e366.webp 800w, /site-assets/566c3fe5dea9cfe4.webp 1600w, /site-assets/a26fb4e9ae8651c4.png 3840w" src="/site-assets/a26fb4e9ae8651c4.png" />
            </span>
          </button>
          <button className={"relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl p-[3px] \x6dd:\x68-16 \x6dd:\x77-16"} style={{ background: "rgb(255, 255, 255)", border: "2px solid var(--kids-borda)" } as CSSProperties} type="button" aria-label="Ver imagem 4" onClick={() => setActiveSlide0(3)} aria-pressed={activeSlide0 === 3}>
            <span className="relative block h-full w-full overflow-hidden rounded-[9px]">
              <img className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="" loading="lazy" decoding="async" sizes="64px" srcSet="/site-assets/ae940f2e00df4cee.webp 400w, /site-assets/c3942773e606f8f6.webp 800w, /site-assets/c3942773e606f8f6.webp 1600w, /site-assets/5fcdf01e7aa5287d.webp 3840w" src="/site-assets/5fcdf01e7aa5287d.webp" />
            </span>
          </button>
          <button className={"relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl p-[3px] \x6dd:\x68-16 \x6dd:\x77-16"} style={{ background: "rgb(255, 255, 255)", border: "2px solid var(--kids-borda)" } as CSSProperties} type="button" aria-label="Ver imagem 5" onClick={() => setActiveSlide0(4)} aria-pressed={activeSlide0 === 4}>
            <span className="relative block h-full w-full overflow-hidden rounded-[9px]">
              <img className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="" loading="lazy" decoding="async" sizes="64px" srcSet="/site-assets/4bcc10365193f2db.webp 400w, /site-assets/70869c928aedea63.webp 800w, /site-assets/b18054ff6c40d1a1.webp 1600w, /site-assets/f74af6715e67af2f.png 3840w" src="/site-assets/f74af6715e67af2f.png" />
            </span>
          </button>
          <button className={"relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl p-[3px] \x6dd:\x68-16 \x6dd:\x77-16"} style={{ background: "rgb(255, 255, 255)", border: "2px solid var(--kids-borda)" } as CSSProperties} type="button" aria-label="Ver imagem 6" onClick={() => setActiveSlide0(5)} aria-pressed={activeSlide0 === 5}>
            <span className="relative block h-full w-full overflow-hidden rounded-[9px]">
              <img className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="" loading="lazy" decoding="async" sizes="64px" srcSet="/site-assets/ca853db0a9d90dbe.webp 400w, /site-assets/13ef970c4349322f.webp 800w, /site-assets/dc2acc743220c7e2.webp 1600w, /site-assets/dcbda0caf343600d.webp 3840w" src="/site-assets/dcbda0caf343600d.webp" />
            </span>
          </button>
          <button className={"relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl p-[3px] \x6dd:\x68-16 \x6dd:\x77-16"} style={{ background: "rgb(255, 255, 255)", border: "2px solid var(--kids-borda)" } as CSSProperties} type="button" aria-label="Ver imagem 7" onClick={() => setActiveSlide0(6)} aria-pressed={activeSlide0 === 6}>
            <span className="relative block h-full w-full overflow-hidden rounded-[9px]">
              <img className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="" loading="lazy" decoding="async" sizes="64px" srcSet="/site-assets/3e737ae38efae5d5.webp 400w, /site-assets/de67a3488dde9a5c.webp 800w, /site-assets/cedb121530166b91.webp 1600w, /site-assets/97f8fd3f86de5ce1.webp 3840w" src="/site-assets/97f8fd3f86de5ce1.webp" />
            </span>
          </button>
        </div>
      </div>
      <div className={"relative -mt-6 \x72ounded-t-[\x328px] \x70x-4 pt-5 \x6dd:\x6dt-0 \x6dd:\x72ounded-none \x6dd:\x70x-0 \x6dd:\x70t-0"} style={{ background: "var(--kids-fundo)" }}>
        <h1 className={"kids-titulo mb-3 \x74ext-2xl \x6ceading-tight \x6dd:\x74ext-3xl"}>Mini Cooler IcedCar 45L Personalizado com Seu Carro</h1>
        <div className="mb-5">
          <span className="mb-0.5 flex items-center gap-2">
            <span className={"\x74ext-sm line-through"} style={{ color: "var(--kids-texto-suave)" }}>R$ 99,90</span>
            <span className="kids-selo kids-selo-sale">-21%</span>
          </span>
          <span className={"kids-titulo block \x74ext-3xl \x6dd:\x74ext-4xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 79,00</span>
          <span className={"mt-1 block \x74ext-sm \x66ont-semibold"} style={{ color: "var(--kids-cta)" }}>ou R$ 75,05 no PIX (5% OFF)</span>
          <span className={"block \x74ext-sm"} style={{ color: "var(--kids-texto-suave)" }}>ou em até 2x no cartão a partir de R$ 90,00</span>
          <button className={"\x2dmx-2 mt-0.5 min-h-[44px] \x70x-2 \x74ext-xs \x66ont-semibold underline"} style={{ color: "var(--kids-texto-suave)" }} type="button" onClick={() => openPanel("payment")}>formas de pagamento</button>
        </div>
        <div className={"mb-4 \x73croll-mt-24"} id="eixo-quantidade">
          <p className={"mb-2 \x74ext-xs"} style={{ color: "var(--kids-texto-suave)" }}>Quantidade: <span className={"\x66ont-bold"} style={{ color: "var(--kids-texto)" }}>{quantity === 1 ? "1 unidade" : "2 unidades"}</span></p>
          <div className="flex flex-wrap gap-2">
            <button className={"kids-btn \x70x-4 \x74ext-sm"} style={{ background: "var(--kids-fundo)", color: "var(--kids-rosa-texto)", border: "2px solid var(--kids-rosa)" } as CSSProperties} type="button" aria-pressed="true" aria-label="1 unidade" onClick={() => setQuantity(1)}>1 unidade</button>
            <button className={"kids-btn \x70x-4 \x74ext-sm"} style={{ background: "var(--kids-fundo)", color: "var(--kids-texto)", border: "2px solid var(--kids-borda)" } as CSSProperties} type="button" aria-pressed="false" aria-label="2 unidades" onClick={() => setQuantity(2)}>2 unidades</button>
          </div>
        </div>
        <p className={"\x73r-only"} style={{ color: "var(--kids-texto-suave)" }} role="status" />
        <div className="kids-card mb-4 p-3.5" style={{ border: "2px dashed var(--kids-rosa)" } as CSSProperties}>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl" style={{ background: "var(--kids-rosa-suave)", color: "var(--kids-rosa-texto)" }} aria-hidden="true">
              <svg className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                <path d="M20 3v4" />
                <path d="M22 5h-4" />
                <path d="M4 17v2" />
                <path d="M5 18H3" />
              </svg>
            </span>
            <p className={"kids-titulo min-w-0 flex-1 text-[15px] \x6ceading-tight \x6dd:\x74ext-base"}>Personalize seu IcedCar</p>
            <button className={"kids-btn kids-btn-rosa flex-shrink-0 \x70x-4"} type="button" onClick={() => openPanel("personalize")}>Personalizar</button>
          </div>
        </div>
        <div className="mb-2 flex items-stretch gap-2">
          <button className="kids-btn kids-btn-cta flex-1 disabled:opacity-50" type="button" onClick={() => openPanel("buy")}>Comprar agora</button>
        </div>
        <ul className="mb-5 mt-4 grid grid-cols-2 gap-2">
          <li className="flex items-start gap-2 rounded-2xl p-2.5" style={{ background: "var(--kids-fundo-suave)" }}>
            <span className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full" style={{ background: "var(--kids-rosa-suave)", color: "var(--kids-rosa-texto)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className={"block text-[13px] \x66ont-bold \x6ceading-tight"}>Frete grátis</span>
              <span className={"block text-[11px] \x6ceading-tight"} style={{ color: "var(--kids-texto-suave)" }}>Acima de R$ 69,90</span>
            </span>
          </li>
          <li className="flex items-start gap-2 rounded-2xl p-2.5" style={{ background: "var(--kids-fundo-suave)" }}>
            <span className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full" style={{ background: "var(--kids-rosa-suave)", color: "var(--kids-rosa-texto)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 7h10v8H3zM13 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className={"block text-[13px] \x66ont-bold \x6ceading-tight"}>Envio com rastreio</span>
              <span className={"block text-[11px] \x6ceading-tight"} style={{ color: "var(--kids-texto-suave)" }}>Você acompanha até a porta</span>
            </span>
          </li>
          <li className="flex items-start gap-2 rounded-2xl p-2.5" style={{ background: "var(--kids-fundo-suave)" }}>
            <span className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full" style={{ background: "var(--kids-rosa-suave)", color: "var(--kids-rosa-texto)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 9a8 8 0 0 1 13-3l2 2M20 15a8 8 0 0 1-13 3l-2-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className={"block text-[13px] \x66ont-bold \x6ceading-tight"}>7 dias para trocar</span>
              <span className={"block text-[11px] \x6ceading-tight"} style={{ color: "var(--kids-texto-suave)" }}>Direito de arrependimento</span>
            </span>
          </li>
          <li className="flex items-start gap-2 rounded-2xl p-2.5" style={{ background: "var(--kids-fundo-suave)" }}>
            <span className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full" style={{ background: "var(--kids-rosa-suave)", color: "var(--kids-rosa-texto)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16v10H4zM4 11h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className={"block text-[13px] \x66ont-bold \x6ceading-tight"}>Em até 2x</span>
              <span className={"block text-[11px] \x6ceading-tight"} style={{ color: "var(--kids-texto-suave)" }}>No cartão, a partir de R$ 90,00</span>
            </span>
          </li>
        </ul>
        <div className="mb-4">
          <div className="kids-card p-4">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <h3 className={"kids-titulo flex items-center gap-2 \x74ext-sm"}><svg className="h-4 w-4" style={{ color: "var(--kids-rosa)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>Calcular prazo de entrega</h3>
              <a className="text-[11px] underline" style={{ color: "var(--kids-texto-suave)" }} href="https://buscacepinter.correios.com.br/app/endereco/index.php" rel="noopener noreferrer" target="_blank">Não sei meu CEP</a>
            </div>
            <div className="flex items-center gap-2">
              <input className={"min-h-[44px] min-w-0 flex-1 rounded-full \x70x-4 text-center \x74ext-sm \x6dd:\x74ext-left"} style={{ background: "var(--kids-fundo-suave)", border: "1px solid var(--kids-borda)", color: "var(--kids-texto)" } as CSSProperties} type="text" name="cep" autoComplete="postal-code" inputMode="numeric" placeholder="00000-000" maxLength={9} aria-label="Digite seu CEP" value={fields["cep"] ?? ""} onChange={e => { setFields({ ...fields, cep: e.target.value }); setShippingError(false); }} />
              <button className={"kids-btn kids-btn-rosa flex-shrink-0 \x70x-5 \x74ext-sm disabled:opacity-50"} type="button" onClick={() => setShippingError(true)}>Calcular</button>
            </div>{shippingError && <p role="alert" className="text-kids-sale mt-3 text-xs">{(fields["cep"] ?? "").replace(/\D/g, "").length !== 8 ? "CEP inválido. Digite um CEP com 8 dígitos." : "Consulta de prazo indisponível."}</p>}
          </div>
        </div>
        <section className={"\x70y-6"} aria-label="Descrição do produto">
          <h2 className={"kids-titulo mb-2 \x74ext-lg"}>Sobre o produto</h2>
          <div className="jsx-6c7f369fbc16f23a mb-4 last:mb-0">
            <div className="jsx-6c7f369fbc16f23a isolated-html-content">
              <p>Do primeiro gelo à última gelada, o IcedCar foi feito para quem ama carros, churrasco e aquela resenha que começa sem hora para acabar.</p>
              <h3>O seu carro. Do seu jeito.</h3>
              <p>Escolha o seu modelo e coloque seu nome na placa. O IcedCar foi pensado para quem tem paixão por carro e quer levar um pouco dessa personalidade para a garagem, a área gourmet ou o espaço do churrasco. Não é só um cooler: é uma peça com a sua cara.</p>
              <h3>Prepare-se para ouvir: “Onde você comprou isso?”</h3>
              <p>É difícil o IcedCar passar despercebido. Encha de gelo, coloque as bebidas e deixe o resto acontecer. No churrasco com os amigos, no encontro de carros ou no domingo em família, ele foi feito para ser o centro da resenha.</p>
              <h3>Tudo sobre o IcedCar</h3>
              <ul>
                <li><strong>Capacidade:</strong> 45 litros</li>
                <li><strong>Armazenamento:</strong> até 60 latas</li>
                <li><strong>Conservação térmica:</strong> até 12 horas</li>
                <li><strong>Material:</strong> estrutura rígida e resistente</li>
                <li><strong>Transporte:</strong> alça telescópica e rodas</li>
                <li><strong>Dimensões:</strong> 65 × 40 × 38 cm</li>
                <li><strong>Personalização:</strong> seu carro e seu nome na placa</li>
                <li><strong>Ideal para:</strong> churrasco, garagem e área gourmet</li>
              </ul>
              <h3>Perguntas frequentes sobre o IcedCar</h3>
              <p><strong>O IcedCar é uma caixa térmica em formato de carro?</strong><br />É. O IcedCar é uma caixa térmica de 45 litros em formato de carroceria de carro: você escolhe a frente ou a traseira, o tipo, a marca, o modelo, o ano e a cor do seu carro, e o seu nome vai na placa.</p>
              <p><strong>Tem caixa térmica com formato de carroceria de caminhonete?</strong><br />Tem. Na personalização, escolha Picape e depois a sua caminhonete, como Hilux, S10, Ranger, Amarok, Strada, Toro, Saveiro, Frontier ou L200. Para caminhão, o modelo é o <a href="/produtos/mini-cooler-gelatruck-personalizado">GelaTruck</a>.</p>
              <p><strong>Dá para fazer a caixa térmica em formato de traseira de carro?</strong><br />Dá. Em "Qual lado do seu carro?", escolha Traseira: o cooler sai com a traseira do seu modelo e a placa com o seu nome.</p>
              <p><strong>Ice Car e IcedCar são o mesmo cooler?</strong><br />São. Muita gente procura como Ice Car, mas o nome é IcedCar: o mini cooler personalizado de quem é apaixonado por carros e churrasco.</p>
              <p><strong>Quantas latas cabem e quanto tempo ele gela?</strong><br />Cabem até 60 latas nos 45 litros, e ele conserva a temperatura por até 12 horas. Tem rodas e alça telescópica para levar cheio até o churrasco.</p>
            </div>
          </div>
        </section>
        <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
          <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Envio e prazo"]} onClick={() => setAnswers({ ...answers, ["Envio e prazo"]: !answers["Envio e prazo"] })}>
            <span className={"\x74ext-sm \x66ont-semibold"}>Envio e prazo</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>{answers["Envio e prazo"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Enviamos para todo o Brasil com código de rastreio. O prazo aparece no cálculo de frete acima, a partir do seu CEP. Assim que o pedido é postado, o código chega no seu e-mail e pode ser acompanhado na "}<a className="underline" href="/rastreamento" style={{"color": "var(--kids-rosa-texto)"} as CSSProperties}>{"página de rastreamento"}</a>{"."}</div></div>}
        </div>
        <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
          <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Trocas e devolu\u00e7\u00f5es"]} onClick={() => setAnswers({ ...answers, ["Trocas e devolu\u00e7\u00f5es"]: !answers["Trocas e devolu\u00e7\u00f5es"] })}>
            <span className={"\x74ext-sm \x66ont-semibold"}>Trocas e devoluções</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>{answers["Trocas e devolu\u00e7\u00f5es"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Você tem 7 dias corridos após o recebimento para solicitar a devolução, conforme o Código de Defesa do Consumidor. Produto com defeito a gente troca sem custo. "}<a className="underline" href="/trocas-devolucoes" style={{"color": "var(--kids-rosa-texto)"} as CSSProperties}>{"Ver a política completa"}</a>{"."}</div></div>}
        </div>
        <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
          <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Formas de pagamento"]} onClick={() => setAnswers({ ...answers, ["Formas de pagamento"]: !answers["Formas de pagamento"] })}>
            <span className={"\x74ext-sm \x66ont-semibold"}>Formas de pagamento</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>{answers["Formas de pagamento"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"PIX com 5% de desconto e aprovação na hora. Cartão a partir de R$ 90,00 em compras. O pagamento acontece numa página segura e a loja não guarda os dados do seu cartão."}</div></div>}
        </div>
      </div>
    </div>
  </div>
  <section className={"\x73croll-mt-20 \x6dd:\x73croll-mt-36 \x70x-4 \x70y-6"} id="similares" aria-label="Você também pode gostar">
    <div className={"\x6dx-auto max-w-6xl"}>
      <h2 className={"kids-titulo mb-3 \x74ext-xl"}>Você também pode gostar</h2>
      <div className={"grid grid-cols-2 gap-3 \x6dd:\x67rid-cols-4"}>
        <div className="kids-card relative flex h-full flex-col overflow-hidden">
          <a className="group flex flex-1 flex-col" href="/produtos/caixa-termica-marine-contour-de-150-qt">
            <div className="relative aspect-square w-full overflow-hidden" style={{ background: "rgb(255, 255, 255)" }}>
              <img className={"object-contain p-2 \x74ransition-transform \x64uration-300 \x6dd:\x70-3 \x6dd:\x67roup-hover:\x73cale-105"} style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Caixa Térmica Marine Contour de 142 litros" loading="lazy" decoding="async" sizes="(max-width: 767px) 50vw, 280px" srcSet="/site-assets/ba1ab31545eb88da.webp 400w, /site-assets/3e95186607cb2e87.webp 800w, /site-assets/d7bdc37465f0006d.webp 1600w, /site-assets/279f4da61927fa49.jpg 3840w" src="/site-assets/279f4da61927fa49.jpg" />
            </div>
            <div className={"flex flex-1 flex-col p-3 \x6dd:\x70-4"}>
              <h3 className={"mb-1 \x6cine-clamp-2 text-[13px] \x66ont-semibold \x6ceading-snug \x6dd:\x6db-2 \x6dd:\x74ext-[\x315px]"}>Caixa Térmica Marine Contour de 142 litros</h3>
              <div className="mt-auto">
                <span className={"kids-titulo block \x74ext-lg \x6ceading-tight \x6dd:\x74ext-xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 144,99</span>
                <span className={"block text-[12px] \x6dd:\x74ext-[\x313px]"} style={{ color: "var(--kids-cta)" }}>ou R$ 137,74 no PIX</span>
              </div>
            </div>
          </a>
          <button className="kids-btn kids-btn-rosa m-3 mt-0 cursor-pointer" type="button" aria-label="Adicionar: Caixa Térmica Marine Contour de 142 litros" aria-disabled="false">Adicionar</button>
        </div>
        <div className="kids-card relative flex h-full flex-col overflow-hidden">
          <a className="group flex flex-1 flex-col" href="/produtos/caixa-termica-nfl-legacy-de-20-qt">
            <div className="relative aspect-square w-full overflow-hidden" style={{ background: "rgb(255, 255, 255)" }}>
              <img className={"object-contain p-2 \x74ransition-transform \x64uration-300 \x6dd:\x70-3 \x6dd:\x67roup-hover:\x73cale-105"} style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Caixa térmica NFL Legacy de 19 litros" loading="lazy" decoding="async" sizes="(max-width: 767px) 50vw, 280px" srcSet="/site-assets/2895c5cf7aa80ed3.webp 400w, /site-assets/49f82abf11880f08.webp 800w, /site-assets/165099d112a22ac3.webp 1600w, /site-assets/831fe66b29cb100e.jpg 3840w" src="/site-assets/831fe66b29cb100e.jpg" />
            </div>
            <div className={"flex flex-1 flex-col p-3 \x6dd:\x70-4"}>
              <h3 className={"mb-1 \x6cine-clamp-2 text-[13px] \x66ont-semibold \x6ceading-snug \x6dd:\x6db-2 \x6dd:\x74ext-[\x315px]"}>Caixa térmica NFL Legacy de 19 litros</h3>
              <div className="mt-auto">
                <span className={"kids-titulo block \x74ext-lg \x6ceading-tight \x6dd:\x74ext-xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 199,99</span>
                <span className={"block text-[12px] \x6dd:\x74ext-[\x313px]"} style={{ color: "var(--kids-cta)" }}>ou R$ 189,99 no PIX</span>
              </div>
            </div>
          </a>
          <button className="kids-btn kids-btn-rosa m-3 mt-0 cursor-pointer" type="button" aria-label="Adicionar: Caixa térmica NFL Legacy de 19 litros" aria-disabled="false">Adicionar</button>
        </div>
        <div className="kids-card relative flex h-full flex-col overflow-hidden">
          <a className="group flex flex-1 flex-col" href="/produtos/caixa-termica-retro-picnic-basket-de-25-qt">
            <div className="relative aspect-square w-full overflow-hidden" style={{ background: "rgb(255, 255, 255)" }}>
              <img className={"object-contain p-2 \x74ransition-transform \x64uration-300 \x6dd:\x70-3 \x6dd:\x67roup-hover:\x73cale-105"} style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Caixa térmica Retro Picnic Basket de 24 litros" loading="lazy" decoding="async" sizes="(max-width: 767px) 50vw, 280px" srcSet="/site-assets/a6bab716bccd33c6.webp 400w, /site-assets/749108d313644210.webp 800w, /site-assets/4914722cef2e621c.webp 1600w, /site-assets/524c277a8dfe4242.jpg 3840w" src="/site-assets/524c277a8dfe4242.jpg" />
            </div>
            <div className={"flex flex-1 flex-col p-3 \x6dd:\x70-4"}>
              <h3 className={"mb-1 \x6cine-clamp-2 text-[13px] \x66ont-semibold \x6ceading-snug \x6dd:\x6db-2 \x6dd:\x74ext-[\x315px]"}>Caixa térmica Retro Picnic Basket de 24 litros</h3>
              <div className="mt-auto">
                <span className={"kids-titulo block \x74ext-lg \x6ceading-tight \x6dd:\x74ext-xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 65,99</span>
                <span className={"block text-[12px] \x6dd:\x74ext-[\x313px]"} style={{ color: "var(--kids-cta)" }}>ou R$ 62,69 no PIX</span>
              </div>
            </div>
          </a>
          <button className="kids-btn kids-btn-rosa m-3 mt-0 cursor-pointer" type="button" aria-label="Adicionar: Caixa térmica Retro Picnic Basket de 24 litros" aria-disabled="false">Adicionar</button>
        </div>
        <div className="kids-card relative flex h-full flex-col overflow-hidden">
          <a className="group flex flex-1 flex-col" href="/produtos/caixa-termica-party-bar-de-125-qt">
            <div className="relative aspect-square w-full overflow-hidden" style={{ background: "rgb(255, 255, 255)" }}>
              <img className={"object-contain p-2 \x74ransition-transform \x64uration-300 \x6dd:\x70-3 \x6dd:\x67roup-hover:\x73cale-105"} style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Caixa térmica Party Bar de 118 litros" loading="lazy" decoding="async" sizes="(max-width: 767px) 50vw, 280px" srcSet="/site-assets/1f23fea3237c63b5.webp 400w, /site-assets/5599454458e4ebb6.webp 800w, /site-assets/6e1dfd9879fde0bf.webp 1600w, /site-assets/aa032b640d266a2c.jpg 3840w" src="/site-assets/aa032b640d266a2c.jpg" />
            </div>
            <div className={"flex flex-1 flex-col p-3 \x6dd:\x70-4"}>
              <h3 className={"mb-1 \x6cine-clamp-2 text-[13px] \x66ont-semibold \x6ceading-snug \x6dd:\x6db-2 \x6dd:\x74ext-[\x315px]"}>Caixa térmica Party Bar de 118 litros</h3>
              <div className="mt-auto">
                <span className={"kids-titulo block \x74ext-lg \x6ceading-tight \x6dd:\x74ext-xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 279,99</span>
                <span className={"block text-[12px] \x6dd:\x74ext-[\x313px]"} style={{ color: "var(--kids-cta)" }}>ou R$ 265,99 no PIX</span>
              </div>
            </div>
          </a>
          <button className="kids-btn kids-btn-rosa m-3 mt-0 cursor-pointer" type="button" aria-label="Adicionar: Caixa térmica Party Bar de 118 litros" aria-disabled="false">Adicionar</button>
        </div>
        <div className="kids-card relative flex h-full flex-col overflow-hidden">
          <a className="group flex flex-1 flex-col" href="/produtos/caixa-termica-tag-along-too-remix">
            <div className="relative aspect-square w-full overflow-hidden" style={{ background: "rgb(255, 255, 255)" }}>
              <img className={"object-contain p-2 \x74ransition-transform \x64uration-300 \x6dd:\x70-3 \x6dd:\x67roup-hover:\x73cale-105"} style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Caixa térmica Tag Along Too Remix" loading="lazy" decoding="async" sizes="(max-width: 767px) 50vw, 280px" srcSet="/site-assets/eb0e3304397bf28b.webp 400w, /site-assets/b95b53da88e740e2.webp 800w, /site-assets/65743cbf9099cb11.webp 1600w, /site-assets/efea9fe6a85082a0.jpg 3840w" src="/site-assets/efea9fe6a85082a0.jpg" />
            </div>
            <div className={"flex flex-1 flex-col p-3 \x6dd:\x70-4"}>
              <h3 className={"mb-1 \x6cine-clamp-2 text-[13px] \x66ont-semibold \x6ceading-snug \x6dd:\x6db-2 \x6dd:\x74ext-[\x315px]"}>Caixa térmica Tag Along Too Remix</h3>
              <div className="mt-auto">
                <span className={"kids-titulo block \x74ext-lg \x6ceading-tight \x6dd:\x74ext-xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 59,99</span>
                <span className={"block text-[12px] \x6dd:\x74ext-[\x313px]"} style={{ color: "var(--kids-cta)" }}>ou R$ 56,99 no PIX</span>
              </div>
            </div>
          </a>
          <button className="kids-btn kids-btn-rosa m-3 mt-0 cursor-pointer" type="button" aria-label="Adicionar: Caixa térmica Tag Along Too Remix" aria-disabled="false">Adicionar</button>
        </div>
        <div className="kids-card relative flex h-full flex-col overflow-hidden">
          <a className="group flex flex-1 flex-col" href="/produtos/caixa-termica-latitude-de-30-qt">
            <div className="relative aspect-square w-full overflow-hidden" style={{ background: "rgb(255, 255, 255)" }}>
              <img className={"object-contain p-2 \x74ransition-transform \x64uration-300 \x6dd:\x70-3 \x6dd:\x67roup-hover:\x73cale-105"} style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Caixa térmica Latitude de 28 litros" loading="lazy" decoding="async" sizes="(max-width: 767px) 50vw, 280px" srcSet="/site-assets/5b7c349f722ea20f.webp 400w, /site-assets/82e414c9c3cc7a2b.webp 800w, /site-assets/9e50236c4b60ad4d.webp 1600w, /site-assets/5992bafc4e6b37d8.jpg 3840w" src="/site-assets/5992bafc4e6b37d8.jpg" />
            </div>
            <div className={"flex flex-1 flex-col p-3 \x6dd:\x70-4"}>
              <h3 className={"mb-1 \x6cine-clamp-2 text-[13px] \x66ont-semibold \x6ceading-snug \x6dd:\x6db-2 \x6dd:\x74ext-[\x315px]"}>Caixa térmica Latitude de 28 litros</h3>
              <div className="mt-auto">
                <span className={"kids-titulo block \x74ext-lg \x6ceading-tight \x6dd:\x74ext-xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 49,99</span>
                <span className={"block text-[12px] \x6dd:\x74ext-[\x313px]"} style={{ color: "var(--kids-cta)" }}>ou R$ 47,49 no PIX</span>
              </div>
            </div>
          </a>
          <button className="kids-btn kids-btn-rosa m-3 mt-0 cursor-pointer" type="button" aria-label="Adicionar: Caixa térmica Latitude de 28 litros" aria-disabled="false">Adicionar</button>
        </div>
        <div className="kids-card relative flex h-full flex-col overflow-hidden">
          <a className="group flex flex-1 flex-col" href="/produtos/caixa-termica-polar-de-120-qt">
            <div className="relative aspect-square w-full overflow-hidden" style={{ background: "rgb(255, 255, 255)" }}>
              <img className={"object-contain p-2 \x74ransition-transform \x64uration-300 \x6dd:\x70-3 \x6dd:\x67roup-hover:\x73cale-105"} style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Caixa térmica Polar de 114 litros" loading="lazy" decoding="async" sizes="(max-width: 767px) 50vw, 280px" srcSet="/site-assets/112276509c8649ec.webp 400w, /site-assets/5d4f5fd03bfe1a88.webp 800w, /site-assets/1570458ae2415f83.webp 1600w, /site-assets/2df690d7fea59d4c.jpg 3840w" src="/site-assets/2df690d7fea59d4c.jpg" />
            </div>
            <div className={"flex flex-1 flex-col p-3 \x6dd:\x70-4"}>
              <h3 className={"mb-1 \x6cine-clamp-2 text-[13px] \x66ont-semibold \x6ceading-snug \x6dd:\x6db-2 \x6dd:\x74ext-[\x315px]"}>Caixa térmica Polar de 114 litros</h3>
              <div className="mt-auto">
                <span className={"kids-titulo block \x74ext-lg \x6ceading-tight \x6dd:\x74ext-xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 129,99</span>
                <span className={"block text-[12px] \x6dd:\x74ext-[\x313px]"} style={{ color: "var(--kids-cta)" }}>ou R$ 123,49 no PIX</span>
              </div>
            </div>
          </a>
          <button className="kids-btn kids-btn-rosa m-3 mt-0 cursor-pointer" type="button" aria-label="Adicionar: Caixa térmica Polar de 114 litros" aria-disabled="false">Adicionar</button>
        </div>
        <div className="kids-card relative flex h-full flex-col overflow-hidden">
          <a className="group flex flex-1 flex-col" href="/produtos/caixa-termica-marine-de-25-qt">
            <div className="relative aspect-square w-full overflow-hidden" style={{ background: "rgb(255, 255, 255)" }}>
              <img className={"object-contain p-2 \x74ransition-transform \x64uration-300 \x6dd:\x70-3 \x6dd:\x67roup-hover:\x73cale-105"} style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} alt="Caixa térmica Marine de 24 litros" loading="lazy" decoding="async" sizes="(max-width: 767px) 50vw, 280px" srcSet="/site-assets/e0104b3f8ce39299.webp 400w, /site-assets/cc304c8be670f8d0.webp 800w, /site-assets/e529793bd15e5cce.webp 1600w, /site-assets/be16826e0184c216.jpg 3840w" src="/site-assets/be16826e0184c216.jpg" />
            </div>
            <div className={"flex flex-1 flex-col p-3 \x6dd:\x70-4"}>
              <h3 className={"mb-1 \x6cine-clamp-2 text-[13px] \x66ont-semibold \x6ceading-snug \x6dd:\x6db-2 \x6dd:\x74ext-[\x315px]"}>Caixa térmica Marine de 24 litros</h3>
              <div className="mt-auto">
                <span className={"kids-titulo block \x74ext-lg \x6ceading-tight \x6dd:\x74ext-xl"} style={{ color: "var(--kids-rosa-texto)" }}>R$ 46,99</span>
                <span className={"block text-[12px] \x6dd:\x74ext-[\x313px]"} style={{ color: "var(--kids-cta)" }}>ou R$ 44,64 no PIX</span>
              </div>
            </div>
          </a>
          <button className="kids-btn kids-btn-rosa m-3 mt-0 cursor-pointer" type="button" aria-label="Adicionar: Caixa térmica Marine de 24 litros" aria-disabled="false">Adicionar</button>
        </div>
      </div>
    </div>
  </section>
  <section className={"\x70x-4 \x70y-6"} aria-labelledby="faq-titulo">
    <div className={"\x6dx-auto max-w-3xl"}>
      <h2 className={"kids-titulo mb-1 \x74ext-xl"} id="faq-titulo">Dúvidas frequentes</h2>
      <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Vem com nota fiscal?"]} onClick={() => setAnswers({ ...answers, ["Vem com nota fiscal?"]: !answers["Vem com nota fiscal?"] })}>
          <span className={"\x74ext-sm \x66ont-semibold"}>Vem com nota fiscal?</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>{answers["Vem com nota fiscal?"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Sim. Todo pedido sai com nota fiscal emitida pelo nosso CNPJ (19.633.664/0001-16)."}</div></div>}
      </div>
      <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Voc\u00eas entregam na minha cidade?"]} onClick={() => setAnswers({ ...answers, ["Voc\u00eas entregam na minha cidade?"]: !answers["Voc\u00eas entregam na minha cidade?"] })}>
          <span className={"\x74ext-sm \x66ont-semibold"}>Vocês entregam na minha cidade?</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>{answers["Voc\u00eas entregam na minha cidade?"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Sim. Entregamos em todo o Brasil e todo pedido vai com código de rastreio. O frete aparece no checkout antes de você pagar, e é grátis acima de R$ 69,90."}</div></div>}
      </div>
      <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Como acompanho meu pedido?"]} onClick={() => setAnswers({ ...answers, ["Como acompanho meu pedido?"]: !answers["Como acompanho meu pedido?"] })}>
          <span className={"\x74ext-sm \x66ont-semibold"}>Como acompanho meu pedido?</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>{answers["Como acompanho meu pedido?"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Quando o pedido é enviado, você recebe o código de rastreio por e-mail. Com ele, é só abrir a página Rastrear pedido, no topo do site, e acompanhar cada etapa da entrega."}</div></div>}
      </div>
      <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Quais as formas de pagamento?"]} onClick={() => setAnswers({ ...answers, ["Quais as formas de pagamento?"]: !answers["Quais as formas de pagamento?"] })}>
          <span className={"\x74ext-sm \x66ont-semibold"}>Quais as formas de pagamento?</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>{answers["Quais as formas de pagamento?"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"PIX, com 5% de desconto e aprovação na hora, ou cartão de crédito em até 12x para compras a partir de R$ 90. O pagamento acontece em ambiente seguro e a loja não guarda os dados do seu cartão."}</div></div>}
      </div>
      <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Qual cooler escolher?"]} onClick={() => setAnswers({ ...answers, ["Qual cooler escolher?"]: !answers["Qual cooler escolher?"] })}>
          <span className={"\x74ext-sm \x66ont-semibold"}>Qual cooler escolher?</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>{answers["Qual cooler escolher?"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Pense em quantas pessoas e por quanto tempo. Para um passeio curto, de 15 a 30 litros resolve. Para praia ou camping com a turma, os de 45 a 70 litros com rodas são os mais práticos. Cada produto traz capacidade, medidas e peso na descrição."}</div></div>}
      </div>
      <div className={"\x62order-b"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left"} type="button" aria-expanded={!!answers["Quanto tempo tenho para trocar ou devolver?"]} onClick={() => setAnswers({ ...answers, ["Quanto tempo tenho para trocar ou devolver?"]: !answers["Quanto tempo tenho para trocar ou devolver?"] })}>
          <span className={"\x74ext-sm \x66ont-semibold"}>Quanto tempo tenho para trocar ou devolver?</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>{answers["Quanto tempo tenho para trocar ou devolver?"] && <div ><div className="pb-4 text-sm leading-relaxed" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Você tem 7 dias corridos, contados do recebimento, para desistir da compra e pedir a devolução, sem precisar justificar. Se o produto chegar com defeito, a gente troca sem custo. Os detalhes estão na página Trocas e devoluções."}</div></div>}
      </div>
    </div>
  </section>
  <section className="jsx-3148083873 avaliacoes" aria-label="Avaliações de clientes">
    <div className="jsx-3148083873 cabecalho">
      <h2 className="jsx-3148083873">Avaliações de quem já comprou</h2>
      <div className="jsx-3148083873 nota">
        <span className="jsx-3148083873 estrelas" aria-label="5 de 5">
          <svg className="jsx-3148083873 estrela cheia" viewBox="0 0 24 24" aria-hidden="true">
            <path className="jsx-3148083873" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="jsx-3148083873 estrela cheia" viewBox="0 0 24 24" aria-hidden="true">
            <path className="jsx-3148083873" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="jsx-3148083873 estrela cheia" viewBox="0 0 24 24" aria-hidden="true">
            <path className="jsx-3148083873" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="jsx-3148083873 estrela cheia" viewBox="0 0 24 24" aria-hidden="true">
            <path className="jsx-3148083873" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="jsx-3148083873 estrela cheia" viewBox="0 0 24 24" aria-hidden="true">
            <path className="jsx-3148083873" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </span>
        <span className="jsx-3148083873"><strong className="jsx-3148083873">4.9</strong>/5 · 1.923 avaliações</span>
      </div>
    </div>
    <div className="jsx-3148083873 trilhas">
      <div className="jsx-3148083873 trilha" data-kids-movimento="sempre">
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Mariana Alves</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Chegou antes do que eu esperava e veio bem embalado. Gostei bastante!</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Rafael Costa</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Levei o cooler no churrasco domingo e deu certinho pra gente. Bem melhor que ficar ocupando a geladeira da minha mãe kkk</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Camila Rocha</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei, só achei um pouco menor do que imaginava. Devia ter olhado as medidas com mais atenção.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">B</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Bruno Martins</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">veio tudo certo, sem nenhum arranhão</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">J</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Juliana Ferreira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei na Gelaki para dar de presente. A pessoa gostou tanto que já usou no mesmo fim de semana.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">F</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Felipe Souza</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O cooler é bom. Cheio fica pesado pra tirar do carro, então prefiro colocar as bebidas quando já estou no lugar.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">B</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Beatriz Lima</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A cor é linda pessoalmente! Era o que eu mais tava com medo de ser diferente da foto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Lucas Ribeiro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Entrega rápida e produto conforme o pedido.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">F</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Fernanda Oliveira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Usei só uma vez por enquanto, mas gostei. Coube o que precisava levar pro passeio.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">G</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Gustavo Santos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">as rodinhas ajudam demais, meu antigo não tinha e era um sofrimento carregar tudo</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">P</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Patrícia Mendes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei do cuidado com a embalagem. Chegou tudo direitinho aqui.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">André Almeida</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Bonito e espaçoso. Só preciso arrumar um lugar melhor pra guardar, porque no armário que eu pensei não coube.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Larissa Nunes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">amei!! já quero levar pra praia</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">D</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Diego Barbosa</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Coloquei gelo e bebida de manhã e ainda tava gelada no fim do churrasco. Pra mim tá ótimo.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Renata Moreira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A bolsa térmica me atendeu bem. Consigo levar os lanches sem precisar carregar uma caixa maior.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">T</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Thiago Gomes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Primeira compra na Gelaki e deu tudo certo. O pedido chegou no prazo informado.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Amanda Carvalho</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei a do Pooh e fiquei apaixonada. O desenho é muito bonitinho, dá até dó de sujar hahaha</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Rodrigo Lopes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Bom acabamento. Ainda não fiz uma viagem longa com ele, usei mais aqui em casa mesmo.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Carolina Dias</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">chegou rapidinho aqui, gostei mto</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">E</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Eduardo Pereira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Já deixei separado pras pescarias. O tamanho ficou bom no carro junto com as outras coisas.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">D</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Débora Castro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Veio bem embalado. Achei que caberia mais coisa, mas tem que lembrar que o gelo também ocupa espaço.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Marcelo Azevedo</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Finalmente um cooler que não preciso ficar pedindo emprestado pro meu irmão</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">V</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Vanessa Teixeira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Tudo certo com a compra. Era exatamente a cor que eu queria.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">V</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Vinícius Cardoso</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei do cooler, mas cheio eu carrego com ajuda. Pra quem vai andar bastante, vale pensar nisso.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">G</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Gabriela Monteiro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A embalagem chegou meio amassada e fiquei preocupada, mas por dentro tava tudo intacto. Gostei bastante do produto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">H</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Henrique Fernandes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei pro aniversário aqui em casa. As bebidas ficaram separadas nele e liberou um espaço enorme na geladeira.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">T</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Tatiane Correia</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A bolsa é bonita e fácil de guardar depois do uso. Pra nossa rotina achei melhor que o cooler grande.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">P</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Pedro Henrique</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">curti demais, veio certinho</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">P</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Priscila Duarte</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Meu marido escolheu pelo tamanho e eu pela cor. No fim os dois ficaram satisfeitos rs</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Leonardo Freitas</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">É grande mesmo. Recomendo medir o porta-malas antes, principalmente se for levar mala junto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Aline Batista</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Amei o do Stitch! Comprei pra minha filha, mas acho que vou acabar usando mais que ela.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Matheus Vieira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O cooler já estreou no fim de semana. Bebida gelada e ninguém precisando entrar em casa toda hora.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">I</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Isabela Ramos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A mochila térmica é prática. Só não dá pra exagerar no peso se for passar muito tempo andando.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Caio Moura</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Chegou bem embalado e sem defeitos. Nada a reclamar.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Luciana Reis</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei sem saber se ia usar tanto e agora levo até quando vou passar o dia na casa da minha irmã.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">D</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Daniel Farias</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei. A entrega levou um dia a mais do que eu tinha previsto, mas chegou tudo certo.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Letícia Campos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">é mais bonito ao vivo adorei a cor</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">F</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Fábio Cunha</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Era o tamanho que faltava aqui. O outro era enorme pra levar só bebida e uns lanches.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">J</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Jéssica Moraes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O cooler é uma graça. Comprei mais pelo desenho mesmo, pra usar em passeios pequenos.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Alexandre Pinto</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Segunda vez comprando na Gelaki. Dessa vez peguei um maior pra quando a família toda se reúne.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Mariana Alves</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Chegou antes do que eu esperava e veio bem embalado. Gostei bastante!</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Rafael Costa</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Levei o cooler no churrasco domingo e deu certinho pra gente. Bem melhor que ficar ocupando a geladeira da minha mãe kkk</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Camila Rocha</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei, só achei um pouco menor do que imaginava. Devia ter olhado as medidas com mais atenção.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">B</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Bruno Martins</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">veio tudo certo, sem nenhum arranhão</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">J</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Juliana Ferreira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei na Gelaki para dar de presente. A pessoa gostou tanto que já usou no mesmo fim de semana.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">F</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Felipe Souza</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O cooler é bom. Cheio fica pesado pra tirar do carro, então prefiro colocar as bebidas quando já estou no lugar.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">B</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Beatriz Lima</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A cor é linda pessoalmente! Era o que eu mais tava com medo de ser diferente da foto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Lucas Ribeiro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Entrega rápida e produto conforme o pedido.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">F</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Fernanda Oliveira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Usei só uma vez por enquanto, mas gostei. Coube o que precisava levar pro passeio.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">G</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Gustavo Santos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">as rodinhas ajudam demais, meu antigo não tinha e era um sofrimento carregar tudo</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">P</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Patrícia Mendes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei do cuidado com a embalagem. Chegou tudo direitinho aqui.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">André Almeida</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Bonito e espaçoso. Só preciso arrumar um lugar melhor pra guardar, porque no armário que eu pensei não coube.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Larissa Nunes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">amei!! já quero levar pra praia</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">D</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Diego Barbosa</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Coloquei gelo e bebida de manhã e ainda tava gelada no fim do churrasco. Pra mim tá ótimo.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Renata Moreira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A bolsa térmica me atendeu bem. Consigo levar os lanches sem precisar carregar uma caixa maior.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">T</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Thiago Gomes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Primeira compra na Gelaki e deu tudo certo. O pedido chegou no prazo informado.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Amanda Carvalho</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei a do Pooh e fiquei apaixonada. O desenho é muito bonitinho, dá até dó de sujar hahaha</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Rodrigo Lopes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Bom acabamento. Ainda não fiz uma viagem longa com ele, usei mais aqui em casa mesmo.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Carolina Dias</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">chegou rapidinho aqui, gostei mto</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">E</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Eduardo Pereira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Já deixei separado pras pescarias. O tamanho ficou bom no carro junto com as outras coisas.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">D</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Débora Castro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Veio bem embalado. Achei que caberia mais coisa, mas tem que lembrar que o gelo também ocupa espaço.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Marcelo Azevedo</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Finalmente um cooler que não preciso ficar pedindo emprestado pro meu irmão</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">V</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Vanessa Teixeira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Tudo certo com a compra. Era exatamente a cor que eu queria.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">V</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Vinícius Cardoso</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei do cooler, mas cheio eu carrego com ajuda. Pra quem vai andar bastante, vale pensar nisso.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">G</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Gabriela Monteiro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A embalagem chegou meio amassada e fiquei preocupada, mas por dentro tava tudo intacto. Gostei bastante do produto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">H</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Henrique Fernandes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei pro aniversário aqui em casa. As bebidas ficaram separadas nele e liberou um espaço enorme na geladeira.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">T</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Tatiane Correia</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A bolsa é bonita e fácil de guardar depois do uso. Pra nossa rotina achei melhor que o cooler grande.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">P</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Pedro Henrique</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">curti demais, veio certinho</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">P</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Priscila Duarte</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Meu marido escolheu pelo tamanho e eu pela cor. No fim os dois ficaram satisfeitos rs</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Leonardo Freitas</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">É grande mesmo. Recomendo medir o porta-malas antes, principalmente se for levar mala junto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Aline Batista</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Amei o do Stitch! Comprei pra minha filha, mas acho que vou acabar usando mais que ela.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Matheus Vieira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O cooler já estreou no fim de semana. Bebida gelada e ninguém precisando entrar em casa toda hora.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">I</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Isabela Ramos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A mochila térmica é prática. Só não dá pra exagerar no peso se for passar muito tempo andando.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Caio Moura</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Chegou bem embalado e sem defeitos. Nada a reclamar.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Luciana Reis</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei sem saber se ia usar tanto e agora levo até quando vou passar o dia na casa da minha irmã.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">D</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Daniel Farias</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei. A entrega levou um dia a mais do que eu tinha previsto, mas chegou tudo certo.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Letícia Campos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">é mais bonito ao vivo adorei a cor</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">F</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Fábio Cunha</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Era o tamanho que faltava aqui. O outro era enorme pra levar só bebida e uns lanches.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">J</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Jéssica Moraes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O cooler é uma graça. Comprei mais pelo desenho mesmo, pra usar em passeios pequenos.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Alexandre Pinto</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Segunda vez comprando na Gelaki. Dessa vez peguei um maior pra quando a família toda se reúne.</p>
          </div>
        </div>
      </div>
      <div className="jsx-3148083873 trilha inversa" data-kids-movimento="sempre">
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">N</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Natália Barros</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Não tenho muito o que falar, veio como nas fotos e chegou no prazo. Gostei!</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Ricardo Tavares</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">As rodas ajudam no caminho do estacionamento até a área do churrasco. Pra colocar no carro ainda preciso levantar, claro.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Sabrina Melo</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Levei fruta, suco e os lanchinhos das crianças. Foi bom ter tudo junto em vez de várias sacolas.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">J</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">João Vitor</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">muito bom, meu pai ja tá querendo pegar emprestado kkkkk</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Cristiane Lopes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei da compra. Para duas pessoas o tamanho funcionou, mas para levar coisas de mais gente eu pegaria um maior.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">G</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Guilherme Rocha</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Veio bem protegido na caixa. Conferi assim que chegou e estava tudo em ordem.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">P</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Paula Andrade</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Escolhi o de personagem pra dar de presente e acertei. A reação quando abriu a caixa foi a melhor parte.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Renan Silveira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Bom pro uso que eu faço. Não testei quantos dias segura gelo, só uso em passeio de um dia.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">B</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Bianca Martins</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">chegou antes da viagem ainda bem pq eu deixei pra comprar em cima da hora</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Sérgio Nascimento</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Aqui em casa já virou o cooler do churrasco. Domingo é só colocar do lado da mesa e pronto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">F</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Flávia Ribeiro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A bolsa térmica cabe direitinho no espaço que tenho. Só achei a cor um pouco diferente na luz daqui.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">V</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Vitor Araujo</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei bastante do acabamento, principalmente olhando de perto. Não veio com marcas nem nada solto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Simone Pires</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Compra tranquila, entrega no prazo e produto bem embalado.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">O</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Otávio Lima</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O cooler é bom, mas ocupa espaço. Eu já sabia pelas medidas, então não foi surpresa.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Melissa Costa</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Tava namorando esse cooler fazia um tempão. Agora que chegou já tô inventando passeio pra usar</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">César Almeida</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">usei sábado inteiro e quando fui guardar ainda tinha gelo. gostei</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Raquel Fernandes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei para levar algumas coisas pro trabalho. A bolsa me atende bem e não preciso ocupar tanto espaço na geladeira de lá.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">I</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Igor Teixeira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Recebi hoje. Ainda não usei, mas a primeira impressão foi boa e veio tudo certinho.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Mônica Souza</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Eu queria um menor justamente pra não carregar coisa demais. Esse ficou na medida para nossos passeios.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Samuel Dias</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Produto bom. Levei um tempinho pra achar a melhor forma de organizar as garrafas e o gelo, depois ficou tranquilo.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">E</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Elisa Moreira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O do Pooh é lindo demais! Aqui em casa até quem não liga pra essas coisas achou bonito.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Márcio Vieira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei pra deixar na área da churrasqueira. Ficou prático e uso bem mais do que esperava.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Lívia Cardoso</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">veio super bem embaladinho, amei o cuidado</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Adriano Mendes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei de puxar o cooler em vez de carregar. Em escada não resolve, mas no caminho plano ajuda bastante.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">D</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Daniela Freitas</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Primeiro passeio com ele foi um piquenique. Couberam nossas bebidas e os potinhos sem precisar levar outra bolsa.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">W</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Wesley Batista</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Meu amigo gostou tanto do presente que ficou mostrando pra todo mundo. Valeu a escolha kkk</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Silvana Moura</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">É bonito, mas achei maior do que precisava. Vou usar quando tiver mais gente e deixar a bolsa pequena para o dia a dia.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Arthur Reis</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O pedido da Gelaki chegou certo, inclusive a cor. Já tive problema com isso em outra compra e dessa vez conferi na hora.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">T</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Tainá Nunes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">comprei pelo desenho e não me arrependo hahaha muito fofo</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Roberto Campos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Usei no sítio e atendeu bem. Coloquei as bebidas já geladas e fui completando conforme o pessoal pegava.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Cláudia Monteiro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Fiquei contente com a compra. Era para dar de presente, então foi bom receber a embalagem em boas condições.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">B</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Breno Carvalho</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Bem melhor do que levar bebida solta no carro. Agora fica tudo num lugar só e mais fácil de descarregar.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">Y</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Yasmin Correia</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei bastante, só queria ter escolhido o maior. A culpa foi minha que fui mais pela aparência e nem pensei no espaço.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">H</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Hugo Pereira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Sem enrolação: chegou, usei e gostei. O cooler faz o que eu precisava.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Márcia Duarte</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Achei fácil de limpar depois do passeio. Tirei tudo, limpei e deixei secando antes de guardar.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">N</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Nicolas Gomes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">é bom sim. só não dá pra encher até a boca e achar q vai ficar leve pra carregar rs</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">V</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Viviane Barros</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A entrega foi rápida aqui pra minha região. O cooler veio sem nenhuma marquinha, bem bonito.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Leandro Ramos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Levei no almoço de família e perguntaram onde comprei. Passei o nome da Gelaki porque realmente gostei do meu.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Cecília Torres</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Ainda usei pouco para avaliar melhor, mas chegou tudo certo. Por enquanto estou satisfeita.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Alex Santana</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">já usei duas vezes desde q chegou. só me arrependo de não ter comprado antes kkk</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">N</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Natália Barros</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Não tenho muito o que falar, veio como nas fotos e chegou no prazo. Gostei!</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Ricardo Tavares</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">As rodas ajudam no caminho do estacionamento até a área do churrasco. Pra colocar no carro ainda preciso levantar, claro.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Sabrina Melo</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Levei fruta, suco e os lanchinhos das crianças. Foi bom ter tudo junto em vez de várias sacolas.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">J</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">João Vitor</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">muito bom, meu pai ja tá querendo pegar emprestado kkkkk</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Cristiane Lopes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei da compra. Para duas pessoas o tamanho funcionou, mas para levar coisas de mais gente eu pegaria um maior.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">G</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Guilherme Rocha</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Veio bem protegido na caixa. Conferi assim que chegou e estava tudo em ordem.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">P</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Paula Andrade</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Escolhi o de personagem pra dar de presente e acertei. A reação quando abriu a caixa foi a melhor parte.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Renan Silveira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Bom pro uso que eu faço. Não testei quantos dias segura gelo, só uso em passeio de um dia.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">B</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Bianca Martins</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">chegou antes da viagem ainda bem pq eu deixei pra comprar em cima da hora</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Sérgio Nascimento</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Aqui em casa já virou o cooler do churrasco. Domingo é só colocar do lado da mesa e pronto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">F</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Flávia Ribeiro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A bolsa térmica cabe direitinho no espaço que tenho. Só achei a cor um pouco diferente na luz daqui.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">V</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Vitor Araujo</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei bastante do acabamento, principalmente olhando de perto. Não veio com marcas nem nada solto.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Simone Pires</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Compra tranquila, entrega no prazo e produto bem embalado.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">O</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Otávio Lima</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O cooler é bom, mas ocupa espaço. Eu já sabia pelas medidas, então não foi surpresa.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Melissa Costa</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Tava namorando esse cooler fazia um tempão. Agora que chegou já tô inventando passeio pra usar</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">César Almeida</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">usei sábado inteiro e quando fui guardar ainda tinha gelo. gostei</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Raquel Fernandes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei para levar algumas coisas pro trabalho. A bolsa me atende bem e não preciso ocupar tanto espaço na geladeira de lá.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">I</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Igor Teixeira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Recebi hoje. Ainda não usei, mas a primeira impressão foi boa e veio tudo certinho.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Mônica Souza</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Eu queria um menor justamente pra não carregar coisa demais. Esse ficou na medida para nossos passeios.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Samuel Dias</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Produto bom. Levei um tempinho pra achar a melhor forma de organizar as garrafas e o gelo, depois ficou tranquilo.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">E</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Elisa Moreira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O do Pooh é lindo demais! Aqui em casa até quem não liga pra essas coisas achou bonito.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Márcio Vieira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Comprei pra deixar na área da churrasqueira. Ficou prático e uso bem mais do que esperava.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Lívia Cardoso</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">veio super bem embaladinho, amei o cuidado</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Adriano Mendes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei de puxar o cooler em vez de carregar. Em escada não resolve, mas no caminho plano ajuda bastante.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">D</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Daniela Freitas</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Primeiro passeio com ele foi um piquenique. Couberam nossas bebidas e os potinhos sem precisar levar outra bolsa.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">W</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Wesley Batista</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Meu amigo gostou tanto do presente que ficou mostrando pra todo mundo. Valeu a escolha kkk</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">S</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Silvana Moura</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">É bonito, mas achei maior do que precisava. Vou usar quando tiver mais gente e deixar a bolsa pequena para o dia a dia.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Arthur Reis</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">O pedido da Gelaki chegou certo, inclusive a cor. Já tive problema com isso em outra compra e dessa vez conferi na hora.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">T</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Tainá Nunes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">comprei pelo desenho e não me arrependo hahaha muito fofo</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">R</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Roberto Campos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Usei no sítio e atendeu bem. Coloquei as bebidas já geladas e fui completando conforme o pessoal pegava.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Cláudia Monteiro</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Fiquei contente com a compra. Era para dar de presente, então foi bom receber a embalagem em boas condições.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">B</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Breno Carvalho</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Bem melhor do que levar bebida solta no carro. Agora fica tudo num lugar só e mais fácil de descarregar.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">Y</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Yasmin Correia</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Gostei bastante, só queria ter escolhido o maior. A culpa foi minha que fui mais pela aparência e nem pensei no espaço.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">H</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Hugo Pereira</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Sem enrolação: chegou, usei e gostei. O cooler faz o que eu precisava.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">M</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Márcia Duarte</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Achei fácil de limpar depois do passeio. Tirei tudo, limpei e deixei secando antes de guardar.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">N</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Nicolas Gomes</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">é bom sim. só não dá pra encher até a boca e achar q vai ficar leve pra carregar rs</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">V</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Viviane Barros</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">A entrega foi rápida aqui pra minha região. O cooler veio sem nenhuma marquinha, bem bonito.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">L</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Leandro Ramos</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Levei no almoço de família e perguntaram onde comprei. Passei o nome da Gelaki porque realmente gostei do meu.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">C</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Cecília Torres</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "4" } as CSSProperties} role="img" aria-label="4 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">Ainda usei pouco para avaliar melhor, mas chegou tudo certo. Por enquanto estou satisfeita.</p>
          </div>
        </div>
        <div className="jsx-3148083873 cartao" aria-hidden="true">
          <span className="jsx-3148083873 avatar inicial" aria-hidden="true">A</span>
          <div className="jsx-3148083873 corpo">
            <div className="jsx-3148083873 linha-nome">
              <span className="jsx-3148083873 nome">Alex Santana</span>
              <span className="jsx-3148083873 estrelas-txt" style={{ "--nota": "5" } as CSSProperties} role="img" aria-label="5 de 5">★★★★★</span>
            </div>
            <p className="jsx-3148083873 comentario">já usei duas vezes desde q chegou. só me arrependo de não ter comprado antes kkk</p>
          </div>
        </div>
      </div>
      <span className="jsx-3148083873 borda esquerda" aria-hidden="true" />
      <span className="jsx-3148083873 borda direita" aria-hidden="true" />
    </div>
  </section>
</main>
<footer className={"mt-12 w-full \x70x-5 pb-10 pt-8"} style={{ background: "var(--kids-fundo-suave)", color: "var(--kids-texto)" }}>
  <div className={"\x6dx-auto max-w-6xl"}>
    <div className={"mb-7 flex flex-col items-center gap-3 \x62order-b pb-7 text-center \x6dd:\x66lex-row \x6dd:\x69tems-start \x6dd:\x6austify-between \x6dd:\x67ap-8 \x6dd:\x74ext-left"} style={{ borderColor: "var(--kids-borda)" }}>
      <div className={"flex flex-col items-center gap-2 \x6dd:\x69tems-start"}>
        <a aria-label="Ir para a home" href="/">
          <img className="h-10 w-auto object-contain" style={{ color: "transparent" }} alt="Logo" loading="lazy" width="150" height="40" decoding="async" src="/site-assets/da3afb74f22ad006.png" />
        </a>
        <p className={"max-w-xs \x74ext-sm"} style={{ color: "var(--kids-texto-suave)" }}>Coolers com rodas, caixas térmicas, bolsas e garrafões para a praia, o camping e o churrasco.</p>
      </div>
      <p className={"max-w-sm \x74ext-sm \x6ceading-relaxed \x6dd:\x74ext-right"} style={{ color: "var(--kids-texto-suave)" }}>Gelaki Brasil, com envio rastreado para todo o Brasil e 7 dias para troca ou devolução.</p>
    </div>
    <div className={"grid gap-0 \x6dd:\x67rid-cols-3 \x6dd:\x67ap-8"}>
      <div className={"\x62order-b \x6dd:\x62order-0"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left \x6dd:\x70ointer-events-none \x6dd:\x70y-2"} type="button" aria-expanded="true">
          <span className={"kids-titulo text-[13px] uppercase \x74racking-wide"}>Loja</span>
          <svg className={"\x6dd:\x68idden"} style={{ transform: "rotate(180deg)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
        <div className={"block pb-4 \x6dd:\x62lock \x6dd:\x70b-0"}>
          <ul className={"flex flex-col gap-1 \x74ext-sm"}>
            <li>
              <a className="kids-link-rodape" href="/produtos">Todos os produtos</a>
            </li>
            <li>
              <a className="kids-link-rodape" href="/carrinho">Meu carrinho</a>
            </li>
            <li>
              <a className="kids-link-rodape" href="/blog">Blog</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={"\x62order-b \x6dd:\x62order-0"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left \x6dd:\x70ointer-events-none \x6dd:\x70y-2"} type="button" aria-expanded="true">
          <span className={"kids-titulo text-[13px] uppercase \x74racking-wide"}>Ajuda</span>
          <svg className={"\x6dd:\x68idden"} style={{ transform: "rotate(180deg)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
        <div className={"block pb-4 \x6dd:\x62lock \x6dd:\x70b-0"}>
          <ul className={"flex flex-col gap-1 \x74ext-sm"}>
            <li>
              <a className="kids-link-rodape" href="/rastreamento">Rastrear pedido</a>
            </li>
            <li>
              <a className="kids-link-rodape" href="/trocas-devolucoes">Trocas e devoluções</a>
            </li>
            <li>
              <a className="kids-link-rodape" href="/termos-e-politicas">Termos e políticas</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={"\x62order-b \x6dd:\x62order-0"} style={{ borderColor: "var(--kids-borda)" }}>
        <button className={"flex w-full items-center justify-between \x70y-4 text-left \x6dd:\x70ointer-events-none \x6dd:\x70y-2"} type="button" aria-expanded="true">
          <span className={"kids-titulo text-[13px] uppercase \x74racking-wide"}>Contato</span>
          <svg className={"\x6dd:\x68idden"} style={{ transform: "rotate(180deg)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
        <div className={"block pb-4 \x6dd:\x62lock \x6dd:\x70b-0"}>
          <div className={"flex flex-col gap-2 \x74ext-sm"}>
            <ul className="flex flex-col gap-2">
              <li>
                <a className="kids-link-rodape break-all" href="mailto:contato@gelakibrasil.com">contato@gelakibrasil.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className={"mt-6 flex flex-col items-center gap-3 \x6dd:\x66lex-row \x6dd:\x69tems-end \x6dd:\x6austify-between"}>
      <div>
        <p className={"mb-2 text-center text-[11px] \x66ont-semibold uppercase \x74racking-wide \x6dd:\x74ext-left"} style={{ color: "var(--kids-texto-suave)" }}>Formas de pagamento</p>
        <ul className={"flex flex-wrap items-center justify-center gap-2 \x6dd:\x6austify-start"} aria-label="Formas de pagamento aceitas">
          <li>
            <svg style={{ display: "block", borderRadius: "6px", border: "1px solid var(--kids-borda)" } as CSSProperties} width="46" height="30" viewBox="0 0 46 30" role="img" aria-label="Pix">
              <title>Pix</title>
              <rect width="46" height="30" rx="5" fill="#FFFFFF" />
              <path fill="#32BCAD" transform="translate(7 7) scale(0.667)" d="M5.283 18.36a3.505 3.505 0 0 0 2.493-1.032l3.6-3.6a.684.684 0 0 1 .946 0l3.613 3.613a3.504 3.504 0 0 0 2.493 1.032h.71l-4.56 4.56a3.647 3.647 0 0 1-5.156 0L4.85 18.36ZM18.428 5.627a3.505 3.505 0 0 0-2.493 1.032l-3.613 3.614a.67.67 0 0 1-.946 0l-3.6-3.6A3.505 3.505 0 0 0 5.283 5.64h-.434l4.573-4.572a3.646 3.646 0 0 1 5.156 0l4.559 4.559ZM1.068 9.422 3.79 6.699h1.492a2.483 2.483 0 0 1 1.744.722l3.6 3.6a1.73 1.73 0 0 0 2.443 0l3.614-3.613a2.482 2.482 0 0 1 1.744-.723h1.767l2.737 2.737a3.646 3.646 0 0 1 0 5.156l-2.736 2.736h-1.768a2.482 2.482 0 0 1-1.744-.722l-3.613-3.613a1.77 1.77 0 0 0-2.444 0l-3.6 3.6a2.483 2.483 0 0 1-1.744.722H3.791l-2.723-2.723a3.646 3.646 0 0 1 0-5.156" />
              <text x="33" y="19" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#32BCAD">pix</text>
            </svg>
          </li>
          <li>
            <svg style={{ display: "block", borderRadius: "6px", border: "1px solid var(--kids-borda)" } as CSSProperties} width="46" height="30" viewBox="0 0 46 30" role="img" aria-label="Visa">
              <title>Visa</title>
              <rect width="46" height="30" rx="5" fill="#FFFFFF" />
              <text x="23" y="19.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="800" fontStyle="italic" fill="#1A1F71" letterSpacing="0.5">VISA</text>
            </svg>
          </li>
          <li>
            <svg style={{ display: "block", borderRadius: "6px", border: "1px solid var(--kids-borda)" } as CSSProperties} width="46" height="30" viewBox="0 0 46 30" role="img" aria-label="Mastercard">
              <title>Mastercard</title>
              <rect width="46" height="30" rx="5" fill="#FFFFFF" />
              <circle cx="18.5" cy="15" r="8" fill="#EB001B" />
              <circle cx="27.5" cy="15" r="8" fill="#F79E1B" />
              <path d="M23 8.4a8 8 0 0 1 0 13.2 8 8 0 0 1 0-13.2Z" fill="#FF5F00" />
            </svg>
          </li>
          <li>
            <svg style={{ display: "block", borderRadius: "6px", border: "1px solid var(--kids-borda)" } as CSSProperties} width="46" height="30" viewBox="0 0 46 30" role="img" aria-label="Elo">
              <title>Elo</title>
              <rect width="46" height="30" rx="5" fill="#000000" />
              <circle cx="11" cy="15" r="2.2" fill="#FFCB05" />
              <circle cx="15.5" cy="10.5" r="2.2" fill="#00A4E0" />
              <circle cx="15.5" cy="19.5" r="2.2" fill="#EF4123" />
              <text x="29" y="19.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="#FFFFFF">elo</text>
            </svg>
          </li>
          <li>
            <svg style={{ display: "block", borderRadius: "6px", border: "1px solid var(--kids-borda)" } as CSSProperties} width="46" height="30" viewBox="0 0 46 30" role="img" aria-label="American Express">
              <title>American Express</title>
              <rect width="46" height="30" rx="5" fill="#016FD0" />
              <text x="23" y="18.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="800" fill="#FFFFFF" letterSpacing="0.4">AMEX</text>
            </svg>
          </li>
        </ul>
      </div>
      <p className={"inline-flex items-center gap-1.5 \x74ext-xs \x66ont-semibold"} style={{ color: "var(--kids-texto-suave)" }}><svg style={{ color: "var(--kids-cta)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>Ambiente seguro</p>
    </div>
    <div className={"mt-7 \x62order-t pt-5"} style={{ borderColor: "var(--kids-borda)" }}>
      <p className={"text-center \x74ext-xs \x6dd:\x74ext-left"} style={{ color: "var(--kids-texto-suave)" }}>Gelaki Brasil · CNPJ 19.633.664/0001-16 · Rua Safira, 40, São Joaquim, Contagem/MG, CEP 32113-030</p>
      <p className={"mt-1 text-center \x74ext-xs \x6dd:\x74ext-left"} style={{ color: "var(--kids-texto-suave)" }}>© 2026 Gelaki Brasil. Todos os direitos reservados. · <a href="/privacidade" className="underline">Privacidade e cookies</a></p>
    </div>
  </div>
</footer>
<div className={"fixed \x69nset-x-0 bottom-0 z-50 \x62order-t \x70x-4 \x70y-3 \x74ransition-transform"} style={{ background: "var(--kids-fundo)", borderColor: "var(--kids-borda)", boxShadow: "rgba(43, 27, 51, 0.1) 0px -6px 20px", transform: "translateY(0px)", transitionDuration: "var(--kids-motion-padrao)", transitionTimingFunction: "var(--kids-motion-curva)", paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" } as CSSProperties} aria-hidden="false">
  <div className={"\x6dx-auto flex max-w-3xl items-center gap-3"}>
    <img className="h-11 w-11 flex-shrink-0 rounded-xl object-cover" style={{ color: "transparent" }} alt="" loading="lazy" width="44" height="44" decoding="async" sizes="44px" srcSet="/site-assets/81bbeb2b87725fb9.webp 400w, /site-assets/ab325eff7fcfd3ee.webp 800w, /site-assets/e6165e2f1078e8fc.webp 1600w, /site-assets/62b91b6cf7e1c3b3.png 3840w" src="/site-assets/62b91b6cf7e1c3b3.png" />
    <div className="min-w-0 flex-1">
      <p className={"truncate \x74ext-xs"} style={{ color: "var(--kids-texto-suave)" }}>Mini Cooler IcedCar 45L Personalizado com Seu Carro - 1 unidade</p>
      <p className={"flex items-baseline gap-1.5 \x6ceading-tight"}>
        <span className={"kids-titulo \x74ext-base"}>R$ 79,00</span>
        <span className="text-[11px] line-through" style={{ color: "var(--kids-texto-suave)" }}>R$ 99,90</span>
      </p>
      <p className={"truncate text-[11px] \x66ont-semibold \x6ceading-tight"} style={{ color: "var(--kids-cta)" }}>ou R$ 75,05 no PIX</p>
    </div>
    <button className="kids-btn kids-btn-cta flex-shrink-0 disabled:opacity-60" type="button" tabIndex={0} onClick={() => openPanel("buy")}>Comprar agora</button>
  </div>
</div>
</Fragment>
</>);
  return (
    <>
      <style>{capturedCSS}</style>
      <div id="__next" data-site-import-carousel-root="1">
        <div className="flex min-h-screen flex-col __variable_6ef5b1" data-theme="kids" data-site-import-carousel-root="0">{carouselContent0}</div>

        {panel && <div ref={dialogRef}>
          {panel === "menu" && <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menu"><button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-black/40" onClick={closePanel}></button><nav className="absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col overflow-y-auto p-5" style={{"background": "var(--kids-fundo)", "boxShadow": "var(--kids-sombra-overlay)"} as CSSProperties}><div className="mb-4 flex items-center justify-between"><span className="kids-titulo text-lg">{"Categorias"}</span><button type="button" aria-label="Fechar menu" className="grid h-10 w-10 place-items-center rounded-full" onClick={closePanel}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"></path></svg></button></div><a className="kids-btn kids-btn-rosa mb-3 w-full" href="/produtos">{"Ver tudo"}</a><ul className="flex flex-col"><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/atacado"><span >{"Atacado"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"9"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/coolers-com-rodas"><span >{"Coolers com Rodas"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"15"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/dispensers-de-bebidas"><span >{"Dispensers de Bebidas"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"2"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/caixas-termicas"><span >{"Caixas Térmicas"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"45"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/coolers-playmate"><span >{"Coolers Playmate"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"131"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/bolsas-e-mochilas-termicas"><span >{"Bolsas e Mochilas Térmicas"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"181"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/copos-e-garrafas"><span >{"Copos e Garrafas"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"152"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/garrafoes-e-jarras"><span >{"Garrafões e Jarras"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"15"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/personagens"><span >{"Personagens"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"168"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/times-e-esportes"><span >{"Times e Esportes"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"169"}</span></a></li><li ><a className="flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold" href="/categoria/acessorios"><span >{"Acessórios"}</span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"142"}</span></a></li></ul><div className="mt-auto flex flex-col gap-1 pt-6 text-sm"><a className="px-3 py-2" href="/rastreamento">{"Rastrear pedido"}</a><a className="px-3 py-2" href="/trocas-devolucoes">{"Trocas e devoluções"}</a><a className="px-3 py-2" href="/termos-e-politicas">{"Termos e políticas"}</a></div></nav></div>}
          {panel === "search" && <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Buscar"><button type="button" aria-label="Fechar busca" className="absolute inset-0 bg-black/40" onClick={closePanel}></button><div className="absolute inset-x-0 top-0 flex max-h-[88vh] flex-col rounded-b-[28px] p-4 md:inset-x-auto md:left-1/2 md:top-6 md:max-h-[80vh] md:w-full md:max-w-2xl md:-translate-x-1/2 md:rounded-[28px] md:p-5" style={{"background": "var(--kids-fundo)", "boxShadow": "var(--kids-sombra-overlay)"} as CSSProperties}><form className="flex items-center gap-2"><input type="search" placeholder="Buscar produtos" aria-label="Buscar produtos" className="h-12 flex-1 rounded-full px-4 text-[15px] outline-none" style={{"background": "var(--kids-fundo-suave)", "border": "1px solid var(--kids-borda)"} as CSSProperties} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === "Enter") window.location.assign("/produtos?busca=" + encodeURIComponent(search)); }} /><button type="button" className="px-2 text-sm font-semibold" onClick={closePanel}>{"Cancelar"}</button></form><div className="mt-3 flex-1 overflow-y-auto"><div className="px-1 py-2"><div className="mt-4 first:mt-0"><p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Mais buscados"}</p><ul className="flex flex-wrap gap-2"><li ><button type="button" className="kids-selo" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties} onClick={() => setSearch("Caixa")}>{"Caixa"}</button></li><li ><button type="button" className="kids-selo" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties} onClick={() => setSearch("Bolsa")}>{"Bolsa"}</button></li><li ><button type="button" className="kids-selo" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties} onClick={() => setSearch("Copo")}>{"Copo"}</button></li><li ><button type="button" className="kids-selo" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties} onClick={() => setSearch("Caneca")}>{"Caneca"}</button></li><li ><button type="button" className="kids-selo" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties} onClick={() => setSearch("Kit")}>{"Kit"}</button></li><li ><button type="button" className="kids-selo" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties} onClick={() => setSearch("Mochila")}>{"Mochila"}</button></li></ul></div><div className="mt-4 first:mt-0"><p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Categorias"}</p><ul className="flex flex-wrap gap-2"><li ><a className="kids-selo" href="/categoria/atacado" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Atacado"}</a></li><li ><a className="kids-selo" href="/categoria/coolers-com-rodas" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Coolers com Rodas"}</a></li><li ><a className="kids-selo" href="/categoria/dispensers-de-bebidas" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Dispensers de Bebidas"}</a></li><li ><a className="kids-selo" href="/categoria/caixas-termicas" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Caixas Térmicas"}</a></li><li ><a className="kids-selo" href="/categoria/coolers-playmate" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Coolers Playmate"}</a></li><li ><a className="kids-selo" href="/categoria/bolsas-e-mochilas-termicas" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Bolsas e Mochilas Térmicas"}</a></li><li ><a className="kids-selo" href="/categoria/copos-e-garrafas" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Copos e Garrafas"}</a></li><li ><a className="kids-selo" href="/categoria/garrafoes-e-jarras" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Garrafões e Jarras"}</a></li><li ><a className="kids-selo" href="/categoria/personagens" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Personagens"}</a></li><li ><a className="kids-selo" href="/categoria/times-e-esportes" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Times e Esportes"}</a></li><li ><a className="kids-selo" href="/categoria/acessorios" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-texto)"} as CSSProperties}>{"Acessórios"}</a></li><li ><a className="kids-selo" href="/produtos?ordem=desconto" style={{"background": "var(--kids-fundo-suave)", "color": "var(--kids-sale)"} as CSSProperties}>{"Promoções"}</a></li></ul></div></div></div></div></div>}
          {panel === "payment" && <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Formas de pagamento"><button type="button" aria-label="Fechar" className="absolute inset-0" style={{"background": "rgba(43, 27, 51, 0.5)"} as CSSProperties} onClick={closePanel}></button><div className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-[28px] p-5 sm:max-w-md sm:rounded-[28px]" style={{"background": "var(--kids-fundo)"} as CSSProperties}><div className="mb-4 flex items-center justify-between"><h2 className="kids-titulo text-lg">{"Formas de pagamento"}</h2><button type="button" aria-label="Fechar" className="grid h-11 w-11 place-items-center rounded-full" style={{"background": "var(--kids-fundo-suave)"} as CSSProperties} onClick={closePanel}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"></path></svg></button></div><div className="mb-4 rounded-2xl p-4" style={{"background": "var(--kids-cta-suave)"} as CSSProperties}><p className="text-sm font-bold" style={{"color": "var(--kids-cta)"} as CSSProperties}>{"PIX · 5% de desconto"}</p><p className="mt-1 text-2xl font-bold" style={{"color": "var(--kids-cta)"} as CSSProperties}>{"R$ 75,05"}</p><p className="mt-1 text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"Aprovação na hora, sem precisar de cartão."}</p></div><p className="mb-3 rounded-xl px-3 py-2 text-sm" style={{"background": "var(--kids-fundo-suave)"} as CSSProperties}>{"Cartão a partir de R$ 90,00 em compras. Faltam "}<strong >{"R$ 11,00"}</strong>{" para parcelar."}</p><p className="mb-2 text-sm font-bold">{"Cartão de crédito"}</p><ul className="space-y-1"><li className="flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{"background": "var(--kids-fundo-suave)"} as CSSProperties}><span >{"1x de "}<strong >{"R$ 82,95"}</strong></span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"com juros"}</span></li><li className="flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{"background": "var(--kids-fundo-suave)"} as CSSProperties}><span >{"2x de "}<strong >{"R$ 47,80"}</strong></span><span className="text-xs" style={{"color": "var(--kids-texto-suave)"} as CSSProperties}>{"com juros"}</span></li></ul></div></div>}
          {panel === "cart" && <CartDrawer onClose={closePanel} onPersonalize={() => setPanel("personalize")} />}
          {panel === "zoom" && <div role="dialog" aria-modal="true" aria-label="Imagem ampliada" className="import-overlay import-zoom"><button className="import-close" aria-label="Fechar" onClick={closePanel}>×</button><img src={`/site-assets/${gallery[activeSlide0]}`} alt="Mini Cooler IcedCar ampliado" /><div className="flex gap-2">{gallery.map((image, i) => <button key={image} aria-label={`Ver imagem ${i + 1}`} aria-pressed={i === activeSlide0} onClick={() => setActiveSlide0(i)}><img src={`/site-assets/${image}`} alt="" className="h-14 w-14 object-contain" /></button>)}</div></div>}
          {(panel === "personalize" || panel === "buy") && <PersonalizeModal quantity={quantity} onClose={closePanel} />}
        </div>}

      </div>

    </>
  );
}
