alter table public.feedbacks
  add column if not exists author_name text,
  add column if not exists author_email text,
  add column if not exists publish_author_name boolean not null default false;

update public.feedbacks f
set author_name = c.name,
    author_email = c.email
from public.clients c
where f.client_id = c.id
  and f.author_name is null;

alter table public.feedbacks
  alter column author_name set not null,
  alter column author_email set not null;

alter table public.feedbacks
  add constraint feedbacks_author_name_len_check
    check (char_length(trim(author_name)) between 2 and 120),
  add constraint feedbacks_author_email_check
    check (char_length(author_email) <= 254 and author_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');