import { describe, expect, it } from "vitest";
import { NOTICE_VERSION, permitsAdvertising, purchaseIsConfirmed } from "./advertising";
describe("advertising permission", () => {
  const accepted = { allowed: true, at: "2026-11-07", region: "BR", notice: NOTICE_VERSION };
  it("requires explicit advertising acceptance", () => {
    expect(permitsAdvertising(null, false)).toBe(false);
    expect(permitsAdvertising({ ...accepted, allowed: false }, false)).toBe(false);
    expect(permitsAdvertising(accepted, false)).toBe(true);
  });
  it("GPC overrides acceptance", () => expect(permitsAdvertising(accepted, true)).toBe(false));
  it("counts paid payments only, never generated PIX or processing cards", () => {
    expect(purchaseIsConfirmed("PAID", 9495)).toBe(true);
    expect(purchaseIsConfirmed("PROCESSING", 9495)).toBe(false);
    expect(purchaseIsConfirmed("PENDING", 9495)).toBe(false);
    expect(purchaseIsConfirmed("PAID", 0)).toBe(false);
  });
});