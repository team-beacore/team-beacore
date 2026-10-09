-- Leads da página /servicos/gestao-de-trafego-pago.
--
-- Amplia os valores aceitos em `need` e `goal` (CHECK constraints da 0011).
-- Não altera nem apaga linhas existentes: todo valor antigo continua válido.
--
-- Enquanto esta migration não for aplicada, o site continua registrando os
-- leads de tráfego pago com need = 'nao-sei' e um objetivo equivalente (ver
-- submitTrafficLead em src/lib/leads.ts); canal, empresa, site e objetivo
-- ficam no início de `message`, e o canal também em `source`.

alter table public.leads drop constraint if exists leads_need_check;
alter table public.leads add constraint leads_need_check
  check (need in (
    'site',
    'landing-page',
    'sistema',
    'automacao',
    'ecommerce',
    'produto-digital',
    'nao-sei',
    'trafego-pago'
  ));

alter table public.leads drop constraint if exists leads_goal_check;
alter table public.leads add constraint leads_goal_check
  check (goal in (
    'mais-clientes',
    'vender-online',
    'presenca-digital',
    'automatizar-operacao',
    'nova-solucao',
    'outro',
    'gerar-leads',
    'conversas-mensagens',
    'reconhecimento-marca',
    'melhorar-campanhas'
  ));
