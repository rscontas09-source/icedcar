import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { advertisingAllowed, setAdvertisingChoice } from "@/lib/advertising";
export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [
    { title: "Privacidade e cookies | IcedCar Gelaki Brasil" },
    { name: "description", content: "Como o IcedCar utiliza dados de compra e escolhas de cookies de publicidade." },
    { property: "og:title", content: "Privacidade e cookies | IcedCar" },
    { property: "og:description", content: "Dados necessários à compra, medição Meta e suas escolhas de publicidade." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Privacy,
});
function Privacy() {
  return <main className="mx-auto max-w-3xl space-y-6 px-5 py-12 pb-36 text-foreground">
    <Link to="/" className="underline">Gelaki Brasil · Voltar à loja</Link>
    <h1 className="text-3xl font-bold">Privacidade e cookies</h1>
    <p>Atualizado em 7 de novembro de 2026.</p>
    <h2 className="text-xl font-bold">Compra e pagamento</h2>
    <p>Nome, contato, CPF, endereço e personalização são utilizados para processar seu pedido e pagamento pela Masterfy. A escolha de publicidade é independente da compra.</p>
    <h2 className="text-xl font-bold">Publicidade Meta</h2>
    <p>Com base no legítimo interesse (LGPD, art. 7º, IX), carregamos o Pixel da Meta (Facebook e Instagram). Ele recebe visitas, compras confirmadas, valor em reais, identificador do evento e dados técnicos, como endereço IP, navegador e página visitada. A Meta pode usar cookies para medição, atribuição e otimização de anúncios. Não enviamos nome, e-mail, CPF, telefone, endereço ou dados do cartão como correspondência de clientes.</p>
    <h2 className="text-xl font-bold">Suas escolhas</h2>
    <p>Você pode recusar a qualquer momento no botão abaixo, e isso não impede a compra. A recusa interrompe novos eventos imediatamente; eventos bloqueados não são enviados posteriormente. Respeitamos o sinal Global Privacy Control do navegador. A escolha, data, região identificada e versão deste aviso ficam registradas neste navegador, junto à referência de permissão dos eventos observados. Limpar o armazenamento do navegador remove esses registros locais.</p>
    <Choice />
    <p>Não há envio de eventos de publicidade pelo servidor neste site. Pagamentos concluídos com a página fechada podem não ser medidos.</p>
    <p>Saiba mais sobre o tratamento pela Meta em <a className="underline" href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer">Política de Privacidade da Meta</a>.</p>
  </main>;
}
function Choice() {
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => setOn(advertisingAllowed()), []);
  if (on === null) return null;
  return <div className="rounded-xl border p-4">
    <p className="font-semibold">Medição de publicidade: {on ? "ativada" : "desativada"}</p>
    <button type="button" className="mt-2 rounded-lg border px-4 py-2 font-semibold" onClick={() => { setAdvertisingChoice(!on); setOn(!on); }}>
      {on ? "Recusar publicidade" : "Permitir publicidade"}
    </button>
  </div>;
}
