-- Roles supported by ALIGN
create type public.app_role as enum (
  'student',
  'faculty',
  'mentor',
  'admin'
);

-- Application profile information.
-- Passwords/emails remain managed by Supabase Auth.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  organization text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Application authorization role.
create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,

  role public.app_role not null default 'student',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- Remove generic client permissions.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_roles from anon, authenticated;

-- Logged-in users can read/update their own profile.
grant select, update on table public.profiles to authenticated;

-- Logged-in users can read their own role.
grant select on table public.user_roles to authenticated;

-- Backend/admin access.
grant select, insert, update, delete
on table public.profiles
to service_role;

grant select, insert, update, delete
on table public.user_roles
to service_role;

-- User can only see their own profile.
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

-- User can only edit their own profile.
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- User can see their own role but cannot change it.
create policy "Users can read own role"
on public.user_roles
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Automatically create profile + default role after signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin

  insert into public.profiles (
    id,
    full_name,
    organization
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'organization'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (
    user_id,
    role
  )
  values (
    new.id,
    'student'::public.app_role
  )
  on conflict (user_id) do nothing;

  return new;

end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();