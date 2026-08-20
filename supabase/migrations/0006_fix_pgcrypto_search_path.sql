create or replace function public.validate_feedback_token(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_token public.feedback_tokens%rowtype;
  v_project public.projects%rowtype;
  v_client_name text;
begin
  if p_token is null or length(p_token) <> 64 then
    return jsonb_build_object('valid', false, 'reason', 'invalid');
  end if;

  v_hash := encode(digest(p_token, 'sha256'), 'hex');

  select * into v_token
  from public.feedback_tokens
  where token_hash = v_hash;

  if not found then
    return jsonb_build_object('valid', false, 'reason', 'invalid');
  end if;

  if v_token.revoked_at is not null then
    return jsonb_build_object('valid', false, 'reason', 'revoked');
  end if;

  if v_token.used_at is not null then
    return jsonb_build_object('valid', false, 'reason', 'used');
  end if;

  if v_token.expires_at <= now() then
    return jsonb_build_object('valid', false, 'reason', 'expired');
  end if;

  select * into v_project from public.projects where id = v_token.project_id;
  select name into v_client_name from public.clients where id = v_token.client_id;

  return jsonb_build_object(
    'valid', true,
    'client_name', v_client_name,
    'project', jsonb_build_object(
      'id', v_project.id,
      'name', v_project.name,
      'category', v_project.category,
      'description', v_project.description,
      'technologies', v_project.technologies,
      'demo_url', v_project.demo_url,
      'github_url', v_project.github_url,
      'image', v_project.image,
      'accent', v_project.accent
    )
  );
end;
$$;

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

create or replace function public.submit_feedback(p_token text, p_content text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
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