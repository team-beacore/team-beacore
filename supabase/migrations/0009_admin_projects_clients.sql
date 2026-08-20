create or replace function public.admin_list_projects()
returns table (
  id text,
  name text,
  category text,
  description text,
  technologies text[],
  demo_url text,
  github_url text,
  image text,
  accent text,
  featured boolean,
  published boolean,
  sort_order integer,
  created_at timestamptz,
  updated_at timestamptz
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
    select p.id, p.name, p.category, p.description, p.technologies,
           p.demo_url, p.github_url, p.image, p.accent,
           p.featured, p.published, p.sort_order, p.created_at, p.updated_at
    from public.projects p
    order by p.sort_order asc, p.id asc;
end;
$$;

create or replace function public.admin_create_project(
  p_id text,
  p_name text,
  p_category text,
  p_description text,
  p_technologies text[],
  p_demo_url text,
  p_github_url text,
  p_image text,
  p_accent text,
  p_featured boolean default false,
  p_published boolean default true,
  p_sort_order integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text;
  v_name text;
  v_description text;
  v_demo_url text;
  v_accent text;
  v_technologies text[];
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  v_id := lower(trim(coalesce(p_id, '')));
  v_name := trim(coalesce(p_name, ''));
  v_description := trim(coalesce(p_description, ''));
  v_demo_url := trim(coalesce(p_demo_url, ''));
  v_accent := trim(coalesce(p_accent, ''));

  if v_id = '' or v_id !~ '^[a-z0-9][a-z0-9-]*$' or char_length(v_id) > 80 then
    return jsonb_build_object('success', false, 'reason', 'invalid_id');
  end if;

  if v_name = '' or char_length(v_name) > 160 then
    return jsonb_build_object('success', false, 'reason', 'invalid_name');
  end if;

  if p_category is null or p_category not in ('site', 'aplicacao', 'produto', 'template') then
    return jsonb_build_object('success', false, 'reason', 'invalid_category');
  end if;

  if v_description = '' or char_length(v_description) > 4000 then
    return jsonb_build_object('success', false, 'reason', 'invalid_description');
  end if;

  if v_demo_url = '' or char_length(v_demo_url) > 500 then
    return jsonb_build_object('success', false, 'reason', 'invalid_demo_url');
  end if;

  if v_accent = '' or v_accent !~ '^#[0-9a-fA-F]{6}$' then
    return jsonb_build_object('success', false, 'reason', 'invalid_accent');
  end if;

  v_technologies := coalesce(p_technologies, '{}');

  if array_length(v_technologies, 1) > 30 then
    return jsonb_build_object('success', false, 'reason', 'invalid_technologies');
  end if;

  insert into public.projects (
    id, name, category, description, technologies,
    demo_url, github_url, image, accent, featured, published, sort_order
  )
  values (
    v_id, v_name, p_category, v_description, v_technologies,
    v_demo_url, nullif(trim(coalesce(p_github_url, '')), ''), nullif(trim(coalesce(p_image, '')), ''),
    v_accent, coalesce(p_featured, false), coalesce(p_published, true), coalesce(p_sort_order, 0)
  );

  return jsonb_build_object('success', true, 'id', v_id);
exception
  when unique_violation then
    return jsonb_build_object('success', false, 'reason', 'duplicate_id');
  when others then
    raise warning 'admin_create_project: erro interno: %', sqlerrm;
    return jsonb_build_object('success', false, 'reason', 'internal');
end;
$$;

create or replace function public.admin_update_project(
  p_id text,
  p_name text,
  p_category text,
  p_description text,
  p_technologies text[],
  p_demo_url text,
  p_github_url text,
  p_image text,
  p_accent text,
  p_featured boolean default false,
  p_published boolean default true,
  p_sort_order integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_description text;
  v_demo_url text;
  v_accent text;
  v_technologies text[];
  v_updated integer;
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  v_name := trim(coalesce(p_name, ''));
  v_description := trim(coalesce(p_description, ''));
  v_demo_url := trim(coalesce(p_demo_url, ''));
  v_accent := trim(coalesce(p_accent, ''));

  if v_name = '' or char_length(v_name) > 160 then
    return jsonb_build_object('success', false, 'reason', 'invalid_name');
  end if;

  if p_category is null or p_category not in ('site', 'aplicacao', 'produto', 'template') then
    return jsonb_build_object('success', false, 'reason', 'invalid_category');
  end if;

  if v_description = '' or char_length(v_description) > 4000 then
    return jsonb_build_object('success', false, 'reason', 'invalid_description');
  end if;

  if v_demo_url = '' or char_length(v_demo_url) > 500 then
    return jsonb_build_object('success', false, 'reason', 'invalid_demo_url');
  end if;

  if v_accent = '' or v_accent !~ '^#[0-9a-fA-F]{6}$' then
    return jsonb_build_object('success', false, 'reason', 'invalid_accent');
  end if;

  v_technologies := coalesce(p_technologies, '{}');

  if array_length(v_technologies, 1) > 30 then
    return jsonb_build_object('success', false, 'reason', 'invalid_technologies');
  end if;

  update public.projects
  set name = v_name,
      category = p_category,
      description = v_description,
      technologies = v_technologies,
      demo_url = v_demo_url,
      github_url = nullif(trim(coalesce(p_github_url, '')), ''),
      image = nullif(trim(coalesce(p_image, '')), ''),
      accent = v_accent,
      featured = coalesce(p_featured, false),
      published = coalesce(p_published, true),
      sort_order = coalesce(p_sort_order, 0)
  where id = p_id;

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    return jsonb_build_object('success', false, 'reason', 'not_found');
  end if;

  return jsonb_build_object('success', true, 'id', p_id);
exception
  when others then
    raise warning 'admin_update_project: erro interno: %', sqlerrm;
    return jsonb_build_object('success', false, 'reason', 'internal');
end;
$$;

create or replace function public.admin_list_clients()
returns table (
  id uuid,
  name text,
  company text,
  email text,
  phone text,
  avatar text,
  notes text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  project_ids text[]
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
    select c.id, c.name, c.company, c.email, c.phone, c.avatar, c.notes, c.status,
           c.created_at, c.updated_at,
           coalesce(
             (select array_agg(cp.project_id order by cp.project_id)
              from public.client_projects cp
              where cp.client_id = c.id),
             '{}'
           ) as project_ids
    from public.clients c
    order by c.name asc;
end;
$$;

create or replace function public.admin_create_client(
  p_name text,
  p_company text,
  p_email text,
  p_phone text,
  p_avatar text,
  p_notes text,
  p_status text default 'active'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_email text;
  v_client_id uuid;
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  v_name := trim(coalesce(p_name, ''));
  v_email := lower(trim(coalesce(p_email, '')));

  if v_name = '' or char_length(v_name) < 2 or char_length(v_name) > 120 then
    return jsonb_build_object('success', false, 'reason', 'invalid_name');
  end if;

  if v_email = '' or char_length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return jsonb_build_object('success', false, 'reason', 'invalid_email');
  end if;

  if p_status is null or p_status not in ('active', 'inactive') then
    return jsonb_build_object('success', false, 'reason', 'invalid_status');
  end if;

  insert into public.clients (name, company, email, phone, avatar, notes, status)
  values (
    v_name,
    nullif(trim(coalesce(p_company, '')), ''),
    v_email,
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_avatar, '')), ''),
    nullif(trim(coalesce(p_notes, '')), ''),
    p_status
  )
  returning id into v_client_id;

  return jsonb_build_object('success', true, 'id', v_client_id);
exception
  when unique_violation then
    return jsonb_build_object('success', false, 'reason', 'duplicate_email');
  when others then
    raise warning 'admin_create_client: erro interno: %', sqlerrm;
    return jsonb_build_object('success', false, 'reason', 'internal');
end;
$$;

create or replace function public.admin_update_client(
  p_client_id uuid,
  p_name text,
  p_company text,
  p_email text,
  p_phone text,
  p_avatar text,
  p_notes text,
  p_status text default 'active'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_email text;
  v_updated integer;
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  v_name := trim(coalesce(p_name, ''));
  v_email := lower(trim(coalesce(p_email, '')));

  if v_name = '' or char_length(v_name) < 2 or char_length(v_name) > 120 then
    return jsonb_build_object('success', false, 'reason', 'invalid_name');
  end if;

  if v_email = '' or char_length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return jsonb_build_object('success', false, 'reason', 'invalid_email');
  end if;

  if p_status is null or p_status not in ('active', 'inactive') then
    return jsonb_build_object('success', false, 'reason', 'invalid_status');
  end if;

  update public.clients
  set name = v_name,
      company = nullif(trim(coalesce(p_company, '')), ''),
      email = v_email,
      phone = nullif(trim(coalesce(p_phone, '')), ''),
      avatar = nullif(trim(coalesce(p_avatar, '')), ''),
      notes = nullif(trim(coalesce(p_notes, '')), ''),
      status = p_status
  where id = p_client_id;

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    return jsonb_build_object('success', false, 'reason', 'not_found');
  end if;

  return jsonb_build_object('success', true, 'id', p_client_id);
exception
  when unique_violation then
    return jsonb_build_object('success', false, 'reason', 'duplicate_email');
  when others then
    raise warning 'admin_update_client: erro interno: %', sqlerrm;
    return jsonb_build_object('success', false, 'reason', 'internal');
end;
$$;

create or replace function public.admin_set_client_projects(p_client_id uuid, p_project_ids text[])
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_exists boolean;
  v_missing_projects integer;
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  select exists (select 1 from public.clients where id = p_client_id)
  into v_client_exists;

  if not v_client_exists then
    return jsonb_build_object('success', false, 'reason', 'client_not_found');
  end if;

  select count(*) into v_missing_projects
  from unnest(coalesce(p_project_ids, '{}')) as pid
  where not exists (select 1 from public.projects where id = pid);

  if v_missing_projects > 0 then
    return jsonb_build_object('success', false, 'reason', 'project_not_found');
  end if;

  delete from public.client_projects
  where client_id = p_client_id
    and not (project_id = any(coalesce(p_project_ids, '{}')));

  insert into public.client_projects (client_id, project_id)
  select p_client_id, pid
  from unnest(coalesce(p_project_ids, '{}')) as pid
  on conflict (client_id, project_id) do nothing;

  return jsonb_build_object('success', true, 'client_id', p_client_id);
exception
  when others then
    raise warning 'admin_set_client_projects: erro interno: %', sqlerrm;
    return jsonb_build_object('success', false, 'reason', 'internal');
end;
$$;

create or replace function public.admin_list_feedback_tokens(p_client_id uuid, p_project_id text default null)
returns table (
  id uuid,
  client_id uuid,
  project_id text,
  status text,
  expires_at timestamptz,
  used_at timestamptz,
  revoked_at timestamptz,
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
    select t.id, t.client_id, t.project_id,
           case
             when t.revoked_at is not null then 'revoked'
             when t.used_at is not null then 'used'
             when t.expires_at <= now() then 'expired'
             else 'active'
           end as status,
           t.expires_at, t.used_at, t.revoked_at, t.created_at
    from public.feedback_tokens t
    where t.client_id = p_client_id
      and (p_project_id is null or t.project_id = p_project_id)
    order by t.created_at desc;
end;
$$;

revoke all on function public.admin_list_projects() from public, anon, authenticated;
revoke all on function public.admin_create_project(text, text, text, text, text[], text, text, text, text, boolean, boolean, integer) from public, anon, authenticated;
revoke all on function public.admin_update_project(text, text, text, text, text[], text, text, text, text, boolean, boolean, integer) from public, anon, authenticated;
revoke all on function public.admin_list_clients() from public, anon, authenticated;
revoke all on function public.admin_create_client(text, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.admin_update_client(uuid, text, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.admin_set_client_projects(uuid, text[]) from public, anon, authenticated;
revoke all on function public.admin_list_feedback_tokens(uuid, text) from public, anon, authenticated;

grant execute on function public.admin_list_projects() to authenticated;
grant execute on function public.admin_create_project(text, text, text, text, text[], text, text, text, text, boolean, boolean, integer) to authenticated;
grant execute on function public.admin_update_project(text, text, text, text, text[], text, text, text, text, boolean, boolean, integer) to authenticated;
grant execute on function public.admin_list_clients() to authenticated;
grant execute on function public.admin_create_client(text, text, text, text, text, text, text) to authenticated;
grant execute on function public.admin_update_client(uuid, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.admin_set_client_projects(uuid, text[]) to authenticated;
grant execute on function public.admin_list_feedback_tokens(uuid, text) to authenticated;

grant execute on function public.admin_generate_feedback_token(uuid, text) to authenticated;