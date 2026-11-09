// Campaign UTMs kept for the order record (no personal data).
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
const KEY = "icedcar_utms";

export function captureUtms() {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  const saved = getUtms();
  UTM_KEYS.forEach((k) => { const v = p.get(k); if (v) saved[k] = v.slice(0, 200); });
  localStorage.setItem(KEY, JSON.stringify(saved));
}

export function getUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
