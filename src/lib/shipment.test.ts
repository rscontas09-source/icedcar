import { describe, expect, it } from "vitest";
import { shipmentState, trackingCode } from "./shipment";

describe("rastreio IcedCar", () => {
  it("gera código IC...BR a partir do número do pedido", () => {
    expect(trackingCode("PEDIDO21010001")).toBe("IC021010001BR");
  });
  it("começa com pagamento aprovado e sem progresso", () => {
    const now = new Date("2026-11-09T12:00:00Z");
    const s = shipmentState(now, now);
    expect(s.done.length).toBe(1);
    expect(s.progress).toBe(0);
  });
});
