create table if not exists public.projects (
  id text primary key,
  name text not null,
  category text not null check (category in ('site', 'aplicacao', 'produto', 'template')),
  description text not null,
  technologies text[] not null default '{}',
  demo_url text not null,
  github_url text,
  image text,
  accent text not null,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_featured_idx on public.projects (featured);
create index if not exists projects_published_idx on public.projects (published) where published = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "projects_select_published" on public.projects
  for select
  to public
  using (published = true);