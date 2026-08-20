create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  project_id text not null references public.projects (id) on delete restrict,
  token_id uuid not null references public.feedback_tokens (id) on delete restrict,
  content text not null check (char_length(content) between 10 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, project_id),
  unique (token_id)
);

create index if not exists feedbacks_project_status_idx on public.feedbacks (project_id, status);

create trigger feedbacks_set_updated_at
  before update on public.feedbacks
  for each row
  execute function public.set_updated_at();

alter table public.feedbacks enable row level security;

create or replace function public.submit_feedback(p_token text, p_content text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_token public.feedback_tokens%rowtype;
  v_client_status text;
  v_project_published boolean;
  v_link_exists boolean;
  v_content text;
  v_feedback_id uuid;
begin
  if p_token is null or length(p_token) <> 64 then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  v_hash := encode(digest(p_token, 'sha256'), 'hex');

  select * into v_token
  from public.feedback_tokens
  where token_hash = v_hash
  for update;

  if not found then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  if v_token.revoked_at is not null then
    return jsonb_build_object('success', false, 'reason', 'revoked');
  end if;

  if v_token.used_at is not null then
    return jsonb_build_object('success', false, 'reason', 'used');
  end if;

  if v_token.expires_at <= now() then
    return jsonb_build_object('success', false, 'reason', 'expired');
  end if;

  select status into v_client_status from public.clients where id = v_token.client_id;

  if v_client_status is null or v_client_status <> 'active' then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  select published into v_project_published from public.projects where id = v_token.project_id;

  if v_project_published is null or not v_project_published then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  select exists (
    select 1 from public.client_projects
    where client_id = v_token.client_id and project_id = v_token.project_id
  ) into v_link_exists;

  if not v_link_exists then
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;

  select 1 from public.feedbacks
  where client_id = v_token.client_id and project_id = v_token.project_id
  into v_feedback_id;

  if found then
    return jsonb_build_object('success', false, 'reason', 'already_submitted');
  end if;

  v_content := trim(p_content);

  if v_content is null or char_length(v_content) < 10 or char_length(v_content) > 2000 then
    return jsonb_build_object('success', false, 'reason', 'invalid_content');
  end if;

  insert into public.feedbacks (client_id, project_id, token_id, content)
  values (v_token.client_id, v_token.project_id, v_token.id, v_content)
  returning id into v_feedback_id;

  update public.feedback_tokens
  set used_at = now()
  where id = v_token.id;

  return jsonb_build_object('success', true, 'feedback_id', v_feedback_id, 'status', 'pending');
exception
  when unique_violation then
    return jsonb_build_object('success', false, 'reason', 'already_submitted');
  when others then
    raise warning 'submit_feedback: erro interno: %', sqlerrm;
    return jsonb_build_object('success', false, 'reason', 'internal');
end;
$$;

grant execute on function public.submit_feedback(text, text) to anon, authenticated;