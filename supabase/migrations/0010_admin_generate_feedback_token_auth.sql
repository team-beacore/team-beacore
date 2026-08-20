create or replace function public.admin_generate_feedback_token(p_client_id uuid, p_project_id text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_raw text;
  v_client_status text;
  v_project_published boolean;
  v_link_exists boolean;
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  select status into v_client_status from public.clients where id = p_client_id;

  if v_client_status is null then
    raise exception 'cliente não encontrado';
  end if;

  if v_client_status <> 'active' then
    raise exception 'cliente inativo';
  end if;

  select published into v_project_published from public.projects where id = p_project_id;

  if v_project_published is null then
    raise exception 'projeto não encontrado';
  end if;

  if not v_project_published then
    raise exception 'projeto não publicado';
  end if;

  select exists (
    select 1 from public.client_projects
    where client_id = p_client_id and project_id = p_project_id
  ) into v_link_exists;

  if not v_link_exists then
    raise exception 'cliente não vinculado ao projeto';
  end if;

  update public.feedback_tokens
  set revoked_at = now()
  where client_id = p_client_id
    and project_id = p_project_id
    and used_at is null
    and revoked_at is null;

  v_raw := encode(gen_random_bytes(32), 'hex');

  insert into public.feedback_tokens (client_id, project_id, token_hash, expires_at)
  values (
    p_client_id,
    p_project_id,
    encode(digest(v_raw, 'sha256'), 'hex'),
    now() + interval '7 days'
  );

  return v_raw;
end;
$$;

revoke all on function public.admin_generate_feedback_token(uuid, text) from public, anon;
grant execute on function public.admin_generate_feedback_token(uuid, text) to authenticated;