create table if not exists public.admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_emails enable row level security;

alter table public.feedbacks
  add column if not exists moderated_at timestamptz,
  add column if not exists moderated_by uuid;

create or replace function public.admin_is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails
    where email = coalesce(auth.jwt() ->> 'email', '')
  );
$$;

create or replace function public.admin_list_feedbacks(p_status text default null)
returns table (
  id uuid,
  content text,
  status text,
  created_at timestamptz,
  moderated_at timestamptz,
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
           c.name, c.company, f.project_id, p.name, p.image
    from public.feedbacks f
    join public.clients c on c.id = f.client_id
    join public.projects p on p.id = f.project_id
    where p_status is null or f.status = p_status
    order by (f.status = 'pending') desc, f.created_at desc;
end;
$$;

create or replace function public.admin_approve_feedback(p_feedback_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  select status into v_status
  from public.feedbacks
  where id = p_feedback_id;

  if not found then
    return jsonb_build_object('success', false, 'reason', 'not_found');
  end if;

  if v_status = 'approved' then
    return jsonb_build_object('success', true, 'status', 'approved');
  end if;

  if v_status = 'rejected' then
    return jsonb_build_object('success', false, 'reason', 'already_rejected');
  end if;

  update public.feedbacks
  set status = 'approved', moderated_at = now(), moderated_by = auth.uid()
  where id = p_feedback_id;

  return jsonb_build_object('success', true, 'status', 'approved');
end;
$$;

create or replace function public.admin_reject_feedback(p_feedback_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  if not public.admin_is_admin() then
    raise exception 'not_authorized';
  end if;

  select status into v_status
  from public.feedbacks
  where id = p_feedback_id;

  if not found then
    return jsonb_build_object('success', false, 'reason', 'not_found');
  end if;

  if v_status = 'rejected' then
    return jsonb_build_object('success', true, 'status', 'rejected');
  end if;

  if v_status = 'approved' then
    return jsonb_build_object('success', false, 'reason', 'already_approved');
  end if;

  update public.feedbacks
  set status = 'rejected', moderated_at = now(), moderated_by = auth.uid()
  where id = p_feedback_id;

  return jsonb_build_object('success', true, 'status', 'rejected');
end;
$$;

create or replace function public.get_approved_project_feedbacks(p_project_id text)
returns table (id uuid, content text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select f.id, f.content, f.created_at
  from public.feedbacks f
  where f.project_id = p_project_id
    and f.status = 'approved'
  order by f.created_at asc;
$$;

revoke all on function public.admin_is_admin() from public, anon, authenticated;
revoke all on function public.admin_list_feedbacks(text) from public, anon, authenticated;
revoke all on function public.admin_approve_feedback(uuid) from public, anon, authenticated;
revoke all on function public.admin_reject_feedback(uuid) from public, anon, authenticated;

grant execute on function public.admin_is_admin() to authenticated;
grant execute on function public.admin_list_feedbacks(text) to authenticated;
grant execute on function public.admin_approve_feedback(uuid) to authenticated;
grant execute on function public.admin_reject_feedback(uuid) to authenticated;
grant execute on function public.get_approved_project_feedbacks(text) to anon, authenticated;