import { afterEach, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({ inputValidator: () => ({ handler: (fn: unknown) => fn }), handler: (fn: unknown) => fn }),
}));
vi.mock("@tanstack/react-start/server", () => ({ getRequestHeader: () => "127.0.0.1" }));

import { createPixPayment, createCardPayment } from "./payment.functions";

const data = {
  order: { quantity: 1, items: [{ lado: "Frente", tipo: "Carro", marca: "VW", modelo: "Gol", ano: "2020", cor: "Branco", placa: "TESTE", prioridade: false }] },
  payer: { name: "Teste Integracao", email: "teste@example.com", phone: "11999999999", taxId: "52998224725" },
  address: { zipCode: "01001000", state: "SP", city: "Sao Paulo", district: "Se", street: "Praca da Se", number: "100" },
};

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

it("creates PIX with ConnectPay using the server-calculated R$94.95", async () => {
  vi.stubEnv("CONNECTPAY_API_SECRET", "test-only");
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "12345678-1234-1234-1234-123456789012", pix: { payload: "pix-test" } })));
  vi.stubGlobal("fetch", fetchMock);
  const result = await createPixPayment({ data });
  expect(fetchMock.mock.calls[0]?.[0]).toBe("https://api.connectpay.vc/v1/transactions");
  expect(JSON.parse(fetchMock.mock.calls[0]?.[1].body).total_amount).toBe(94.95);
  expect(result).toMatchObject({ ok: true, id: "cp_12345678-1234-1234-1234-123456789012", amount: 9495 });
});

it("keeps credit card payments on Masterfy", async () => {
  vi.stubEnv("MASTERFY_API_KEY", "test-only");
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "cardtest123", status: "PROCESSING" })));
  vi.stubGlobal("fetch", fetchMock);
  await createCardPayment({ data: { ...data, card: { token: "test-token-only", installments: 1 } } });
  expect(fetchMock.mock.calls[0]?.[0]).toBe("https://api.masterfypagamentos.com/v1/payment");
  expect(JSON.parse(fetchMock.mock.calls[0]?.[1].body).method).toBe("CREDIT_CARD");
});