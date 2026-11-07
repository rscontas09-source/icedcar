import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CONSENT_KEY, NOTICE_VERSION, advertisingAllowed, initializePixel, readConsent } from "@/lib/advertising";

export function AdvertisingConsent() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [region, setRegion] = useState("XX");
  const location = useLocation();
  useEffect(() => {
    setOpen(!readConsent()); setReady(true);
    const sync = () => {
      if (advertisingAllowed()) initializePixel(); else window.fbq?.("consent", "revoke");
    };
    sync(); window.addEventListener("storage", sync);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    fetch("/cdn-cgi/trace", { signal: controller.signal }).then(async r => {
      if (!r.ok) return;
      const text = await r.text(); const host = text.match(/^h=(.+)$/m)?.[1]; const loc = text.match(/^loc=([A-Z]{2})$/m)?.[1];
      if (host === window.location.hostname && loc && loc !== "T1") setRegion(loc);
    }).catch(() => undefined).finally(() => clearTimeout(timer));
    return () => { controller.abort(); clearTimeout(timer); window.removeEventListener("storage", sync); };
  }, []);
  useEffect(() => {
    if (!ready || !advertisingAllowed()) return;
    initializePixel(); window.fbq?.("track", "PageView");
  }, [location.pathname, ready]);
  const choose = (allowed: boolean) => {
    const previous = readConsent();
    const record = { allowed, at: new Date().toISOString(), region, notice: NOTICE_VERSION,
      previousAcceptance: previous?.allowed ? previous.at : previous?.previousAcceptance };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    if (advertisingAllowed()) { initializePixel(); window.fbq?.("track", "PageView"); }
    else window.fbq?.("consent", "revoke");
    setOpen(false);
  };
  if (!ready) return null;
  return <>
    <Button variant="outline" className="fixed bottom-3 left-3 z-[90]" onClick={() => setOpen(true)}>Cookies</Button>
    {open && <section aria-label="Escolhas de cookies" className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background px-4 py-5 text-foreground shadow-lg">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-lg font-bold">Sua privacidade</h2>
        <p className="mt-2 text-sm">Cookies essenciais mantêm a compra funcionando. Com sua permissão, compartilhamos visitas e compras confirmadas com a Meta para medir e melhorar anúncios. Você pode recusar ou mudar sua escolha a qualquer momento em Cookies.</p>
        <Link className="mt-2 inline-block text-sm underline" to="/privacidade">Privacidade e cookies</Link>
        <div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" size="lg" onClick={() => choose(false)}>Recusar publicidade</Button><Button variant="outline" size="lg" onClick={() => choose(true)}>Aceitar publicidade</Button></div>
      </div>
    </section>}
  </>;
}