-- TechScalor: full database setup for a fresh Supabase project (safe to re-run).
-- Run in Supabase → SQL Editor, or: psql "$DATABASE_URL" -f db/setup.sql


-- ---------- roles ----------
do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

drop policy if exists "read own roles" on public.user_roles;
create policy "read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin')
$$;

grant execute on function public.has_role(uuid, public.app_role) to authenticated, anon;
grant execute on function public.is_admin() to authenticated, anon;

-- default role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_roles (user_id, role) values (new.id, 'user')
  on conflict (user_id, role) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.user_roles (user_id, role)
select id, 'user' from auth.users on conflict do nothing;

-- ---------- projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Web',
  description text not null default '',
  author text,
  client_name text,
  client_country text,
  project_date date,
  languages text[] not null default '{}',
  live_url text,
  feature_image text,
  images text[] not null default '{}',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;

drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects
  for select to anon using (published = true);

drop policy if exists "authenticated read projects" on public.projects;
create policy "authenticated read projects" on public.projects
  for select to authenticated using (published = true or public.is_admin());

drop policy if exists "admins write projects" on public.projects;
create policy "admins write projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- contact messages ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  budget text,
  message text not null,
  created_at timestamptz not null default now()
);

grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;

drop policy if exists "anyone can submit contact" on public.contact_messages;
create policy "anyone can submit contact" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "admins read contact" on public.contact_messages;
create policy "admins read contact" on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "admins delete contact" on public.contact_messages;
create policy "admins delete contact" on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- ---------- newsletter ----------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, delete on public.newsletter_subscribers to authenticated;
grant all on public.newsletter_subscribers to service_role;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anyone can subscribe" on public.newsletter_subscribers;
create policy "anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers" on public.newsletter_subscribers
  for select to authenticated using (public.is_admin());

drop policy if exists "admins delete subscribers" on public.newsletter_subscribers;
create policy "admins delete subscribers" on public.newsletter_subscribers
  for delete to authenticated using (public.is_admin());

-- ---------- storage ----------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public read project images" on storage.objects;
create policy "public read project images" on storage.objects
  for select using (bucket_id = 'project-images');

drop policy if exists "admins upload project images" on storage.objects;
create policy "admins upload project images" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "admins update project images" on storage.objects;
create policy "admins update project images" on storage.objects
  for update to authenticated using (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "admins delete project images" on storage.objects;
create policy "admins delete project images" on storage.objects
  for delete to authenticated using (bucket_id = 'project-images' and public.is_admin());


create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;

drop policy if exists "public read enabled categories" on public.categories;
create policy "public read enabled categories" on public.categories
  for select to anon using (enabled = true);

drop policy if exists "authenticated read categories" on public.categories;
create policy "authenticated read categories" on public.categories
  for select to authenticated using (enabled = true or public.is_admin());

drop policy if exists "admins write categories" on public.categories;
create policy "admins write categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- projects: separate platform (category), status and contributions
alter table public.projects add column if not exists status text;
alter table public.projects add column if not exists contributions text[] not null default '{}';

-- seed default categories
insert into public.categories (name, sort_order) values
  ('Websites', 1),
  ('Mobile Apps', 2),
  ('SaaS', 3),
  ('E-Commerce', 4),
  ('AI', 5),
  ('Corporate', 6)
on conflict (name) do nothing;

-- keep existing project categories available as options
insert into public.categories (name, sort_order)
select distinct category, 100 from public.projects where coalesce(category, '') <> ''
on conflict (name) do nothing;
