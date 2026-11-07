export const PIXEL_ID = "1739921440581791";
export const CONSENT_KEY = "icedcar-advertising-v1";
export const NOTICE_VERSION = "2026-11-07-meta-v1";
export type ConsentRecord = { allowed: boolean; at: string; region: string; notice: string; previousAcceptance?: string };
type Pixel = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push?: Pixel; loaded: boolean; version: string };
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }
export function permitsAdvertising(record: ConsentRecord | null, gpc: boolean) {
  return !gpc && record?.allowed === true && record.notice === NOTICE_VERSION;
}
export function purchaseIsConfirmed(status: string, amount: number) {
  return status === "PAID" && Number.isSafeInteger(amount) && amount > 0;
}
export function readConsent(): ConsentRecord | null {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch { return null; }
}
export function advertisingAllowed() {
  return permitsAdvertising(readConsent(), (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
}
export function initializePixel() {
  if (!advertisingAllowed()) return;
  if (window.fbq) { window.fbq("consent", "grant"); return; }
  const pixel: Pixel = Object.assign((...args: unknown[]) => {
    if (pixel.callMethod) pixel.callMethod(...args); else pixel.queue.push(args);
  }, { queue: [] as unknown[][], loaded: true, version: "2.0" });
  pixel.push = pixel; window.fbq = pixel; window._fbq = pixel;
  pixel("init", PIXEL_ID, {}, { agent: "lovable" });
  const script = document.createElement("script"); script.src = "https://connect.facebook.net/en_US/fbevents.js"; script.async = true; document.head.appendChild(script);
}
export function reportConfirmedPurchase(status: string, amount: number, paymentId: string) {
  if (!paymentId || !purchaseIsConfirmed(status, amount)) return;
  const key = `icedcar-purchase-observed-${paymentId}`;
  if (localStorage.getItem(key)) return;
  // Observe once even when refused: later acceptance never replays a blocked outcome.
  localStorage.setItem(key, JSON.stringify({ at: new Date().toISOString(), consent: readConsent(), permitted: advertisingAllowed() }));
  if (!advertisingAllowed()) return;
  initializePixel();
  window.fbq?.("track", "Purchase", { value: amount / 100, currency: "BRL" }, { eventID: `icedcar_purchase_${paymentId}` });
}