create table if not exists public.cms_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_cms_content_updated_at on public.cms_content;
create trigger trg_cms_content_updated_at
before update on public.cms_content
for each row
execute procedure public.set_updated_at();

alter table public.cms_content enable row level security;

drop policy if exists "Open read access" on public.cms_content;
drop policy if exists "Open write access" on public.cms_content;
drop policy if exists "Open update access" on public.cms_content;
drop policy if exists "Public read access" on public.cms_content;
drop policy if exists "Authenticated insert access" on public.cms_content;
drop policy if exists "Authenticated update access" on public.cms_content;

create policy "Public read access"
on public.cms_content
for select
to anon, authenticated
using (true);

create policy "Authenticated insert access"
on public.cms_content
for insert
to authenticated
with check (true);

create policy "Authenticated update access"
on public.cms_content
for update
to authenticated
using (true)
with check (true);

grant usage on schema public to anon, authenticated;
grant select on table public.cms_content to anon, authenticated;
grant insert, update on table public.cms_content to authenticated;

insert into public.cms_content (id, content)
values (
  'main',
  '{}'::jsonb
)
on conflict (id) do nothing;
