-- Categories managed from the admin panel + project status & contribution tags
-- Apply with: psql "$DATABASE_URL" -f db/migrations/0002_categories_status_contributions.sql

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
