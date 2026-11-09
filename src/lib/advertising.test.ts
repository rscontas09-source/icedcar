import { describe, expect, it } from "vitest";
import { NOTICE_VERSION, permitsAdvertising, purchaseIsConfirmed } from "./advertising";
describe("advertising permission", () => {
  const accepted = { allowed: true, at: "2026-11-07", region: "BR", notice: NOTICE_VERSION };
  it("measures by default and stops after the visitor refuses", () => {
    expect(permitsAdvertising(null, false)).toBe(true);
    expect(permitsAdvertising({ ...accepted, allowed: false }, false)).toBe(false);
    expect(permitsAdvertising(accepted, false)).toBe(true);
  });
  it("GPC always blocks", () => expect(permitsAdvertising(null, true)).toBe(false));
  it("counts paid payments only, never generated PIX or processing cards", () => {
    expect(purchaseIsConfirmed("PAID", 9495)).toBe(true);
    expect(purchaseIsConfirmed("PROCESSING", 9495)).toBe(false);
    expect(purchaseIsConfirmed("PENDING", 9495)).toBe(false);
    expect(purchaseIsConfirmed("PAID", 0)).toBe(false);
  });
});