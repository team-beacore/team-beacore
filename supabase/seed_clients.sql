insert into public.clients (name, company, email, status)
values ('Beacore Test Client', 'Beacore', 'teste@beacore.dev', 'active')
on conflict (email) do nothing;

insert into public.client_projects (client_id, project_id)
select c.id, p.id
from public.clients c
cross join public.projects p
where c.email = 'teste@beacore.dev'
  and p.id = 'microfix'
on conflict (client_id, project_id) do nothing;