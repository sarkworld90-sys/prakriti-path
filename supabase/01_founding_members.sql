-- प्रकृति पथ — Founding Members टेबल
-- Supabase → SQL Editor → New query → यह पूरा कोड पेस्ट करें → Run दबाएँ

create table if not exists public.founding_members (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 2 and 100),
  phone       text not null unique check (phone ~ '^[6-9][0-9]{9}$'),
  email       text unique check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  city        text check (city is null or char_length(city) <= 80),
  consent     boolean not null check (consent = true),
  created_at  timestamptz not null default now()
);

-- सुरक्षा: Row Level Security चालू
alter table public.founding_members enable row level security;

-- वेबसाइट से कोई भी केवल "जुड़" सकता है (insert)।
-- पढ़ने की कोई policy नहीं है — इसलिए सूची केवल आप Supabase Dashboard में देख सकते हैं।
drop policy if exists "website se judna" on public.founding_members;
create policy "website se judna"
  on public.founding_members
  for insert
  to anon
  with check (consent = true);
