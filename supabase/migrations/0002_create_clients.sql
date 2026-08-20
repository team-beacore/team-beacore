create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null unique,
  phone text,
  avatar text,
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_status_idx on public.clients (status);

create trigger clients_set_updated_at
  before update on public.clients
  for each row
  execute function public.set_updated_at();

create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  project_id text not null references public.projects (id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (client_id, project_id)
);

create index if not exists client_projects_client_id_idx on public.client_projects (client_id);
create index if not exists client_projects_project_id_idx on public.client_projects (project_id);

alter table public.clients enable row level security;
alter table public.client_projects enable row level security;