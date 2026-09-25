/**
 * Catálogo das opções comerciais do formulário.
 *
 * Os `value` são persistidos em `leads.need` / `leads.goal` e estão espelhados
 * nas CHECK constraints da migration 0011. Ao alterar um value aqui,
 * altere também a constraint correspondente no banco.
 */

export const needOptions = [
  { value: "site", label: "Criar um site", whatsapp: "a criação de um site" },
  {
    value: "landing-page",
    label: "Criar uma landing page",
    whatsapp: "a criação de uma landing page",
  },
  { value: "sistema", label: "Criar um sistema", whatsapp: "o desenvolvimento de um sistema" },
  {
    value: "automacao",
    label: "Automatizar um processo",
    whatsapp: "a automação de um processo",
  },
  { value: "ecommerce", label: "Criar uma loja virtual", whatsapp: "a criação de uma loja virtual" },
  {
    value: "produto-digital",
    label: "Criar um produto digital",
    whatsapp: "o desenvolvimento de um produto digital",
  },
  { value: "nao-sei", label: "Ainda não sei", whatsapp: "um projeto" },
] as const;

export const goalOptions = [
  { value: "mais-clientes", label: "Conseguir mais clientes" },
  { value: "vender-online", label: "Vender pela internet" },
  { value: "presenca-digital", label: "Profissionalizar minha presença digital" },
  { value: "automatizar-operacao", label: "Automatizar minha operação" },
  { value: "nova-solucao", label: "Criar uma nova solução" },
  { value: "outro", label: "Outro" },
] as const;

export type NeedValue = (typeof needOptions)[number]["value"];
export type GoalValue = (typeof goalOptions)[number]["value"];

export function needLabel(value: string): string {
  return needOptions.find((option) => option.value === value)?.label ?? value;
}

export function goalLabel(value: string): string {
  return goalOptions.find((option) => option.value === value)?.label ?? value;
}

/**
 * Mensagem de WhatsApp contextual à necessidade escolhida.
 * Sem necessidade selecionada, cai na mensagem padrão do site.
 */
export function whatsappMessageForNeed(value: string, fallback: string): string {
  const option = needOptions.find((item) => item.value === value);
  if (!option) return fallback;
  return `Olá! Gostaria de conversar com a Beacore sobre ${option.whatsapp}.`;
}
