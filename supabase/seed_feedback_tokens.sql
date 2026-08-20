insert into public.feedback_tokens (client_id, project_id, token_hash, expires_at)
select
  c.id,
  p.id,
  encode(digest('beacore-dev-token-microfix-' || repeat('0', 37), 'sha256'), 'hex'),
  now() + interval '7 days'
from public.clients c
cross join public.projects p
where c.email = 'teste@beacore.dev'
  and p.id = 'microfix'
  and exists (
    select 1 from public.client_projects cp
    where cp.client_id = c.id and cp.project_id = p.id
  )
on conflict (token_hash) do nothing;