-- प्रकृति पथ — Founding Members फॉर्म में नए कॉलम (आयु, लिंग, जुड़ने का भाव, अपेक्षा)
-- Supabase → SQL Editor → New query → पेस्ट करें → Run

alter table public.founding_members
  add column if not exists age_group text check (age_group is null or char_length(age_group) <= 20),
  add column if not exists gender    text check (gender is null or char_length(gender) <= 30),
  add column if not exists interests text[],
  add column if not exists message   text check (message is null or char_length(message) <= 1000);

grant insert on public.founding_members to anon, authenticated;
