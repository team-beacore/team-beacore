create or replace function public.submit_feedback(
  p_token text,
  p_author_name text,
  p_author_email text,
  p_content text,
  p_publish_author_name boolean default false
)
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
  v_author_name text;
  v_author_email text;
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

  v_author_name := trim(coalesce(p_author_name, ''));

  if v_author_name = '' or char_length(v_author_name) < 2 or char_length(v_author_name) > 120 then
    return jsonb_build_object('success', false, 'reason', 'invalid_author_name');
  end if;

  v_author_email := lower(trim(coalesce(p_author_email, '')));

  if v_author_email = '' or char_length(v_author_email) > 254
     or v_author_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return jsonb_build_object('success', false, 'reason', 'invalid_author_email');
  end if;

  v_content := trim(p_content);

  if v_content is null or char_length(v_content) < 10 or char_length(v_content) > 2000 then
    return jsonb_build_object('success', false, 'reason', 'invalid_content');
  end if;

  insert into public.feedbacks (
    client_id, project_id, token_id, content,
    author_name, author_email, publish_author_name
  )
  values (
    v_token.client_id, v_token.project_id, v_token.id, v_content,
    v_author_name, v_author_email, coalesce(p_publish_author_name, false)
  )
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

drop function if exists public.submit_feedback(text, text);

grant execute on function public.submit_feedback(text, text, text, text, boolean) to anon, authenticated;

drop function if exists public.get_approved_project_feedbacks(text);

create or replace function public.get_approved_project_feedbacks(p_project_id text)
returns table (id uuid, content text, author_name text, company text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select f.id, f.content,
         case when f.publish_author_name then f.author_name else null end as author_name,
         case when f.publish_author_name then c.company else null end as company,
         f.created_at
  from public.feedbacks f
  left join public.clients c on c.id = f.client_id
  where f.project_id = p_project_id
    and f.status = 'approved'
  order by f.created_at asc;
$$;

grant execute on function public.get_approved_project_feedbacks(text) to anon, authenticated;

drop function if exists public.admin_list_feedbacks(text);

create or replace function public.admin_list_feedbacks(p_status text default null)
returns table (
  id uuid,
  content text,
  status text,
  created_at timestamptz,
  moderated_at timestamptz,
  author_name text,
  author_email text,
  publish_author_name boolean,
  client_name text,
  client_company text,
  project_id text,
  project_name text,
  project_image text
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
    select f.id, f.content, f.status, f.created_at, f.moderated_at,
           f.author_name, f.author_email, f.publish_author_name,
           c.name, c.company, f.project_id, p.name, p.image
    from public.feedbacks f
    join public.clients c on c.id = f.client_id
    join public.projects p on p.id = f.project_id
    where p_status is null or f.status = p_status
    order by (f.status = 'pending') desc, f.created_at desc;
end;
$$;

revoke all on function public.admin_list_feedbacks(text) from public, anon, authenticated;
grant execute on function public.admin_list_feedbacks(text) to authenticated;