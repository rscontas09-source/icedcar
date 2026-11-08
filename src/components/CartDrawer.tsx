import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { type Order, ORDER_KEY, brl, pixTotal, cardTotal, shipping } from "@/lib/order";

export function readOrder(): Order | null {
  try { const o = JSON.parse(sessionStorage.getItem(ORDER_KEY) || "null"); return o?.items?.length ? o : null; } catch { return null; }
}

export function CartDrawer({ onClose, onPersonalize }: { onClose: () => void; onPersonalize: () => void }) {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => setOrder(readOrder()), []);
  const remove = (n: number) => {
    if (!order) return;
    const items = order.items.filter((_, i) => i !== n);
    const next = items.length ? { quantity: items.length, items } : null;
    if (next) sessionStorage.setItem(ORDER_KEY, JSON.stringify(next)); else sessionStorage.removeItem(ORDER_KEY);
    setOrder(next);
  };
  return (
    <div className="import-overlay" data-theme="kids">
      <button className="import-backdrop" aria-label="Fechar carrinho" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-label="Carrinho" className="absolute inset-y-0 right-0 flex w-[92%] max-w-[420px] flex-col" style={{ background: "var(--kids-fundo)", boxShadow: "var(--kids-sombra-overlay)" }}>
        <header className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--kids-borda)" }}>
          <span className="kids-titulo text-lg">Seu carrinho{order ? ` (${order.items.length})` : ""}</span>
          <button type="button" aria-label="Fechar carrinho" className="grid h-11 w-11 place-items-center rounded-full" onClick={onClose}>✕</button>
        </header>
        {!order ? (
          <div className="flex-1 px-5 py-10 text-center">
            <p className="kids-titulo mb-1 text-base">Seu carrinho está vazio</p>
            <p className="mb-5 text-sm" style={{ color: "var(--kids-texto-suave)" }}>Personalize seu cooler com seu carro e seu nome.</p>
            <button type="button" className="kids-btn kids-btn-cta" onClick={onPersonalize}>Personalizar meu IcedCar</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {order.items.map((i, n) => (
                <div key={n} className="flex gap-3 rounded-2xl p-3" style={{ background: "var(--kids-fundo-suave)" }}>
                  <img src="/site-assets/1570458ae2415f83.webp" alt="" className="h-16 w-16 flex-shrink-0 rounded-xl object-contain" style={{ background: "#fff" }} />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="text-sm font-bold">Mini Cooler IcedCar 45L</p>
                    <p style={{ color: "var(--kids-texto-suave)" }}>{i.marca} {i.modelo} {i.ano} · {i.cor} · {i.lado}</p>
                    <p className="font-bold">Placa: “{i.placa}”{i.prioridade ? " · ⚡ Prioridade" : ""}</p>
                  </div>
                  <button type="button" aria-label="Remover" className="self-start text-xs underline" style={{ color: "var(--kids-sale)" }} onClick={() => remove(n)}>Remover</button>
                </div>
              ))}
              <button type="button" className="text-xs font-semibold underline" style={{ color: "var(--kids-rosa-texto)" }} onClick={onPersonalize}>Editar personalização</button>
            </div>
            <footer className="space-y-2 px-5 pb-5 pt-3" style={{ borderTop: "1px solid var(--kids-borda)" }}>
              <div className="flex justify-between text-sm"><span>Frete</span><span>{shipping(order) ? brl(shipping(order)) : "Grátis"}</span></div>
              <div className="flex justify-between text-lg font-bold"><span>Total no PIX</span><span style={{ color: "var(--kids-cta)" }}>{brl(pixTotal(order))}</span></div>
              <p className="text-right text-[11px]" style={{ color: "var(--kids-texto-suave)" }}>ou {brl(cardTotal(order))} em até 12x no cartão</p>
              <Link to="/checkout" className="kids-btn kids-btn-cta w-full">Finalizar compra</Link>
              <p className="text-center text-[11px] font-semibold" style={{ color: "var(--kids-texto-suave)" }}>🔒 Compra segura · 7 dias para troca</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
