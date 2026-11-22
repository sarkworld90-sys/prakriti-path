-- प्रकृति पथ — Level 2: Profiles + Journals
-- Supabase → SQL Editor → New query → पूरा कोड पेस्ट करें → Run

-- ===== 1. Profiles (हर User की प्रोफाइल) =====
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "apni profile dekhein" on public.profiles;
create policy "apni profile dekhein" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "apni profile badlein" on public.profiles;
create policy "apni profile badlein" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Google से नया User आते ही उसकी Profile अपने आप बन जाए
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== 2. Journals (हर दिन का उत्तर — पूरी तरह निजी) =====
create table if not exists public.journals (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  entry_date  date not null,
  question    text not null,
  answer      text not null check (char_length(answer) between 1 and 10000),
  mood        text check (mood is null or char_length(mood) <= 20),
  learned     text check (learned is null or char_length(learned) <= 5000),
  action      text check (action is null or char_length(action) <= 5000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, entry_date)
);

alter table public.journals enable row level security;

-- हर User केवल अपना Journal पढ़/लिख/बदल/मिटा सकता है
drop policy if exists "apna journal padhein" on public.journals;
create policy "apna journal padhein" on public.journals
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "apna journal likhein" on public.journals;
create policy "apna journal likhein" on public.journals
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "apna journal badlein" on public.journals;
create policy "apna journal badlein" on public.journals
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "apna journal mitayein" on public.journals;
create policy "apna journal mitayein" on public.journals
  for delete to authenticated using (auth.uid() = user_id);

-- updated_at अपने आप अपडेट हो
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists journals_touch on public.journals;
create trigger journals_touch before update on public.journals
  for each row execute function public.touch_updated_at();
