insert into public.admin_emails (email)
values ('equipebeacore@gmail.com')
on conflict (email) do nothing;