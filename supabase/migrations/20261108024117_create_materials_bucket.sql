insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do update
set public = excluded.public;