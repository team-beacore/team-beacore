-- Leads capturados pelo formulário público do site.
--
-- Modelo de segurança (mesmo padrão já usado em projects/clients/feedbacks):
--   - RLS habilitado
--   - anon/authenticated podem apenas INSERT (sem SELECT/UPDATE/DELETE)
--   - leitura exclusivamente via RPC SECURITY DEFINER validada por admin_is_admin()

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text,
  need text not null,
  goal text not null,
  message text not null,
  source text not null default 'unknown',
  created_at timestamptz not null default now(),

  constraint leads_name_len_check
    check (char_length(trim(name)) between 2 and 120),
  constraint leads_email_check
    check (char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint leads_whatsapp_check
    check (whatsapp is null or char_length(trim(whatsapp)) between 8 and 32),
  constraint leads_need_check
    check (need in (
      'site',
      'landing-page',
      'sistema',
      'automacao',
      'ecommerce',
      'produto-digital',
      'nao-sei'
    )),
  constraint leads_goal_check
    check (goal in (
      'mais-clientes',
      'vender-online',
      'presenca-digital',
      'automatizar-operacao',
      'nova-solucao',
      'outro'
    )),
  constraint leads_message_len_check
    check (char_length(trim(message)) between 10 and 2000),
  constraint leads_source_check
    check (char_length(source) <= 64)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Visitante anônimo pode registrar um lead...
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public" on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- ...e nada mais. Nenhuma policy de SELECT/UPDATE/DELETE é criada de propósito:
-- com RLS ativo e sem policy, essas operações são negadas para todos os papéis
-- que passam por RLS (anon e authenticated), inclusive via PostgREST.

create or replace function public.admin_list_leads()
returns table (
  id uuid,
  name text,
  email text,
  whatsapp text,
  need text,
  goal text,
  message text,
  source text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  return query
    select l.id, l.name, l.email, l.whatsapp, l.need, l.goal, l.message, l.source, l.created_at
    from public.leads l
    order by l.created_at desc;
end;
$$;

revoke all on function public.admin_list_leads() from public, anon, authenticated;
grant execute on function public.admin_list_leads() to authenticated;
