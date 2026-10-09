/**
 * Eventos de produto, preparados sem nenhuma ferramenta instalada.
 *
 * O site ainda não tem Google Analytics, Google Tag Manager nem Meta Pixel.
 * Este módulo não carrega nenhum script nem inventa IDs: ele só repassa o
 * evento se a ferramenta já estiver na página —
 *  - GTM: `window.dataLayer.push({ event, ...params })`;
 *  - GA4 (gtag.js): `window.gtag("event", name, params)`.
 * Sem nenhuma delas (hoje), a chamada não faz nada.
 *
 * Regras: nunca enviar dados pessoais (nome, e-mail, telefone, mensagem) e só
 * disparar eventos de sucesso depois que a ação realmente aconteceu. Quando um
 * banner de consentimento for adicionado, ele deve controlar a ferramenta, não
 * estas chamadas.
 */

type Params = Record<string, string | number | boolean>;

type AnalyticsWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  gtag?: (command: "event", name: string, params?: Params) => void;
};

export function trackEvent(name: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  try {
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, ...params });
    else if (typeof w.gtag === "function") w.gtag("event", name, params);
  } catch {
    // Falha de analytics nunca pode quebrar a página.
  }
}
