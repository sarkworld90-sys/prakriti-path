-- =====================================================================
--  PRAKRITI PATH MARGDARSHAN — Online / Offline Classes & Sessions
--  Booking / Enquiry Database
--
--  कैसे चलाएँ: Supabase → SQL Editor → New query → पूरी फ़ाइल paste → Run
--  (दोबारा चलाना सुरक्षित है)
-- =====================================================================

create extension if not exists pgcrypto;
create sequence if not exists pp_enquiry_seq start 1001;

create table if not exists public.pp_enquiries (
  id            uuid primary key default gen_random_uuid(),
  enquiry_no    text unique not null default ('PPM-' || nextval('pp_enquiry_seq')),
  program       text not null,
  mode          text not null check (mode in ('online','offline','any')),
  name          text not null check (char_length(name) between 2 and 100),
  phone         text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email         text,
  city          text,
  org_name      text,          -- कंपनी / विभाग / संस्था
  team_size     int,           -- कितने लोग
  preferred_time text,
  language      text,
  concern       text,          -- अपने मन की बात (वैकल्पिक)
  source        text,          -- कहाँ से आए: website / quiz / book / yatra21
  quiz_result   text,          -- Prakriti Quiz का परिणाम (अगर quiz से आए)
  status        text not null default 'new'
                  check (status in ('new','contacted','scheduled','completed','paid','cancelled')),
  admin_note    text,
  created_at    timestamptz not null default now()
);
-- पुरानी table हो तो नए columns और नियम जोड़ें
alter table public.pp_enquiries add column if not exists source text;
alter table public.pp_enquiries add column if not exists quiz_result text;
alter table public.pp_enquiries drop constraint if exists pp_enquiries_program_check;
alter table public.pp_enquiries add constraint pp_enquiries_program_check
  check (program in ('free_call','individual','prakriti','group','yatra21','corporate','department'));

create index if not exists pp_enq_status_idx on public.pp_enquiries(status, created_at desc);
create index if not exists pp_enq_phone_idx  on public.pp_enquiries(phone);

alter table public.pp_enquiries enable row level security;
revoke all on public.pp_enquiries from anon, authenticated;

drop function if exists public.pp_book_enquiry(text,text,text,text,text,text,text,int,text,text,text);

-- Website केवल यह function बुला सकती है — table को कोई सीधे नहीं पढ़ सकता
create or replace function public.pp_book_enquiry(
  p_program text, p_mode text, p_name text, p_phone text, p_email text, p_city text,
  p_org text, p_team int, p_time text, p_language text, p_concern text,
  p_source text default null, p_quiz text default null
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_phone text := right(regexp_replace(coalesce(p_phone,''), '\D', '', 'g'), 10);
  v_recent int;
  v_no text;
begin
  if char_length(trim(coalesce(p_name,''))) < 2 then raise exception 'invalid_name'; end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then raise exception 'invalid_phone'; end if;
  if p_program not in ('free_call','individual','prakriti','group','yatra21','corporate','department') then raise exception 'invalid_program'; end if;
  if p_mode not in ('online','offline','any') then raise exception 'invalid_mode'; end if;
  if p_program in ('corporate','department') and coalesce(trim(p_org),'') = '' then raise exception 'invalid_org'; end if;

  -- एक नंबर से दिन में अधिकतम 3 आवेदन (spam रोकने के लिए)
  select count(*) into v_recent from public.pp_enquiries
   where phone = v_phone and created_at > now() - interval '1 day';
  if v_recent >= 3 then raise exception 'too_many'; end if;

  insert into public.pp_enquiries
    (program, mode, name, phone, email, city, org_name, team_size, preferred_time, language, concern, source, quiz_result)
  values
    (p_program, p_mode, left(trim(p_name),100), v_phone,
     nullif(left(trim(coalesce(p_email,'')),120),''), nullif(left(trim(coalesce(p_city,'')),80),''),
     nullif(left(trim(coalesce(p_org,'')),150),''),
     case when p_team between 1 and 100000 then p_team end,
     nullif(left(trim(coalesce(p_time,'')),80),''), nullif(left(trim(coalesce(p_language,'')),40),''),
     nullif(left(trim(coalesce(p_concern,'')),1500),''),
     nullif(left(regexp_replace(coalesce(p_source,''), '[^a-z0-9_-]', '', 'g'),30),''),
     nullif(left(trim(coalesce(p_quiz,'')),120),''))
  returning enquiry_no into v_no;

  return json_build_object('enquiry_no', v_no);
end $$;

revoke all on function public.pp_book_enquiry(text,text,text,text,text,text,text,int,text,text,text,text,text) from public;
grant execute on function public.pp_book_enquiry(text,text,text,text,text,text,text,int,text,text,text,text,text) to anon, authenticated;

-- =====================================================================
--  ADMIN (Supabase Table Editor → pp_enquiries)
--   नए आवेदन:  select * from pp_enquiries where status = 'new' order by created_at;
--   बात हो गई: update pp_enquiries set status = 'contacted' where enquiry_no = 'PPM-1001';
-- =====================================================================

-- =====================================================================
--  ONLINE भुगतान (Razorpay) — भुगतान का रिकॉर्ड
--  यह table केवल server (Vercel API route, service role key) लिखता है।
-- =====================================================================
create table if not exists public.pp_payments (
  id            uuid primary key default gen_random_uuid(),
  enquiry_no    text not null references public.pp_enquiries(enquiry_no),
  program       text not null,
  amount_paise  int  not null check (amount_paise > 0),
  rz_order_id   text unique not null,
  rz_payment_id text unique,
  status        text not null default 'created' check (status in ('created','paid','failed')),
  created_at    timestamptz not null default now(),
  paid_at       timestamptz
);
alter table public.pp_payments enable row level security;
revoke all on public.pp_payments from anon, authenticated;

-- भुगतान देखें:
--   select p.enquiry_no, e.name, e.phone, p.program, p.amount_paise/100 as rupees, p.status, p.paid_at
--     from pp_payments p join pp_enquiries e using (enquiry_no) order by p.created_at desc;
