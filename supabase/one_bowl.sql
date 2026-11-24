-- =====================================================================
--  ONE BOWL OF WATER — एक कटोरी पानी, एक जीवन के नाम
--  Prakriti Path · Supabase Database (Phase 1)
--
--  कैसे चलाएँ: Supabase Dashboard → SQL Editor → New query →
--  यह पूरी फ़ाइल paste करें → Run.  (दोबारा चलाना सुरक्षित है)
--
--  सुरक्षा का तरीका:
--   • सभी tables पर RLS चालू है और आम visitor (anon) को कोई table
--     सीधे पढ़ने/लिखने की अनुमति नहीं है।
--   • Website केवल नीचे दिए 4 functions बुलाती है। ये functions
--     जाँच करके ही data डालते हैं, और किसी का mobile/नाम बाहर नहीं देते।
--   • Reach / Pledge / Reported / Verified — चारों आँकड़े अलग-अलग
--     रखे जाते हैं, कभी आपस में नहीं मिलाए जाते।
-- =====================================================================

create extension if not exists pgcrypto;

create sequence if not exists obw_participant_seq start 100001;
create sequence if not exists obw_application_seq start 1001;
create sequence if not exists obw_ambassador_seq  start 1;

-- ---------------------------------------------------------------------
-- 1. Ambassadors (आवेदन + स्वीकृत Ambassadors, पूरी hierarchy)
-- ---------------------------------------------------------------------
create table if not exists public.bowl_ambassadors (
  id              uuid primary key default gen_random_uuid(),
  application_no  text unique not null default ('OBW-APP-' || nextval('obw_application_seq')),
  ambassador_code text unique,                 -- Approve होने पर मिलेगा, जैसे OBW-A-00001
  name            text not null check (char_length(name) between 2 and 100),
  phone           text not null unique check (phone ~ '^[6-9][0-9]{9}$'),
  email           text,
  photo_path      text,
  level           text not null check (level in (
                    'national','state','district','assembly','block',
                    'panchayat','ward','institutional','campus')),
  state           text not null,
  district        text,
  assembly        text,
  block           text,
  panchayat_ward  text,
  occupation      text,
  social_profile  text,
  motivation      text,
  referred_by     text,                        -- किसी Ambassador के code से आया हो
  parent_id       uuid references public.bowl_ambassadors(id),  -- Admin टीम में जोड़ेगा
  status          text not null default 'pending'
                    check (status in ('pending','approved','rejected','suspended')),
  auth_user_id    uuid,                        -- Phase 2: Login से जोड़ने के लिए
  approved_at     timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists bowl_amb_status_idx on public.bowl_ambassadors(status);
create index if not exists bowl_amb_state_idx  on public.bowl_ambassadors(state, district);

-- ---------------------------------------------------------------------
-- 2. Participants (आम नागरिक जो अभियान से जुड़े = संकल्प)
-- ---------------------------------------------------------------------
create table if not exists public.bowl_participants (
  id               uuid primary key default gen_random_uuid(),
  campaign_id      text unique not null default ('OBW-' || nextval('obw_participant_seq')),
  name             text not null check (char_length(name) between 2 and 100),
  phone            text not null unique check (phone ~ '^[6-9][0-9]{9}$'),
  state            text not null,
  district         text,
  village_city     text not null,
  bowls_pledged    int  not null check (bowls_pledged between 1 and 100),
  participant_type text not null default 'individual'
                     check (participant_type in ('individual','school','office','shop','other')),
  referred_by      text,                       -- Ambassador code (QR / link से)
  created_at       timestamptz not null default now()
);
create index if not exists bowl_part_state_idx on public.bowl_participants(state, district);
create index if not exists bowl_part_ref_idx   on public.bowl_participants(referred_by);

-- ---------------------------------------------------------------------
-- 3. Bowl Reports (कटोरी रखने की फोटो-रिपोर्ट → Admin Verify करेगा)
-- ---------------------------------------------------------------------
create table if not exists public.bowl_reports (
  id             uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.bowl_participants(id) on delete cascade,
  photo_path     text not null,
  latitude       numeric(9,6),
  longitude      numeric(9,6),
  status         text not null default 'pending'
                   check (status in ('pending','verified','rejected')),
  verified_by    uuid,
  verified_at    timestamptz,
  admin_note     text,
  created_at     timestamptz not null default now()
);
create index if not exists bowl_rep_status_idx on public.bowl_reports(status);
create index if not exists bowl_rep_part_idx   on public.bowl_reports(participant_id);

-- ---------------------------------------------------------------------
-- 4. Reach Logs (Ambassador ने कितने लोगों तक संदेश पहुँचाया) — Phase 2
--    Dashboard से Ambassador यहाँ entry करेंगे। अभी table तैयार रखी है।
-- ---------------------------------------------------------------------
create table if not exists public.bowl_reach_logs (
  id              uuid primary key default gen_random_uuid(),
  ambassador_id   uuid not null references public.bowl_ambassadors(id) on delete cascade,
  reach           int  not null default 0 check (reach >= 0),
  offline_pledges int  not null default 0 check (offline_pledges >= 0),
  activity        text,
  log_date        date not null default current_date,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- RLS: सब बंद। Website केवल functions से बात करेगी।
-- ---------------------------------------------------------------------
alter table public.bowl_ambassadors  enable row level security;
alter table public.bowl_participants enable row level security;
alter table public.bowl_reports      enable row level security;
alter table public.bowl_reach_logs   enable row level security;

revoke all on public.bowl_ambassadors, public.bowl_participants,
              public.bowl_reports, public.bowl_reach_logs from anon, authenticated;

-- =====================================================================
--  FUNCTION 1: अभियान से जुड़ें (Join Campaign) → Unique Campaign ID
-- =====================================================================
create or replace function public.obw_join(
  p_name text, p_phone text, p_state text, p_district text,
  p_place text, p_bowls int, p_type text, p_ref text
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_phone text := right(regexp_replace(coalesce(p_phone,''), '\D', '', 'g'), 10);
  v_ref   text;
  v_row   public.bowl_participants;
begin
  if char_length(trim(coalesce(p_name,''))) < 2 then raise exception 'invalid_name'; end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then raise exception 'invalid_phone'; end if;
  if coalesce(trim(p_state),'') = '' then raise exception 'invalid_state'; end if;
  if coalesce(trim(p_place),'') = '' then raise exception 'invalid_place'; end if;
  if p_bowls is null or p_bowls < 1 or p_bowls > 100 then raise exception 'invalid_bowls'; end if;

  -- पहले से जुड़े हैं? तो वही ID लौटाएँ
  select * into v_row from public.bowl_participants where phone = v_phone;
  if found then
    return json_build_object('campaign_id', v_row.campaign_id, 'existing', true);
  end if;

  -- Referral केवल तभी मानें जब वह किसी स्वीकृत Ambassador का code हो
  select ambassador_code into v_ref from public.bowl_ambassadors
   where ambassador_code = upper(trim(p_ref)) and status = 'approved';

  insert into public.bowl_participants
    (name, phone, state, district, village_city, bowls_pledged, participant_type, referred_by)
  values
    (left(trim(p_name),100), v_phone, left(trim(p_state),60), nullif(left(trim(coalesce(p_district,'')),80),''),
     left(trim(p_place),120), p_bowls,
     case when p_type in ('individual','school','office','shop','other') then p_type else 'individual' end,
     v_ref)
  returning * into v_row;

  return json_build_object('campaign_id', v_row.campaign_id, 'existing', false);
end $$;

-- =====================================================================
--  FUNCTION 2: कटोरी की फोटो-रिपोर्ट (Campaign ID + mobile से जाँच)
-- =====================================================================
create or replace function public.obw_report(
  p_campaign_id text, p_phone text, p_photo_path text, p_lat numeric, p_lng numeric
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_phone text := right(regexp_replace(coalesce(p_phone,''), '\D', '', 'g'), 10);
  v_pid   uuid;
  v_today int;
begin
  select id into v_pid from public.bowl_participants
   where campaign_id = upper(trim(p_campaign_id)) and phone = v_phone;
  if v_pid is null then raise exception 'not_found'; end if;

  if p_photo_path is null or p_photo_path not like 'reports/' || upper(trim(p_campaign_id)) || '/%' then
    raise exception 'invalid_photo';
  end if;

  select count(*) into v_today from public.bowl_reports
   where participant_id = v_pid and created_at > now() - interval '1 day';
  if v_today >= 5 then raise exception 'too_many'; end if;

  insert into public.bowl_reports (participant_id, photo_path, latitude, longitude)
  values (v_pid, p_photo_path,
          case when p_lat between -90 and 90 then p_lat end,
          case when p_lng between -180 and 180 then p_lng end);

  return json_build_object('ok', true);
end $$;

-- =====================================================================
--  FUNCTION 3: Ambassador आवेदन → Application No. (Admin Approve करेगा)
-- =====================================================================
create or replace function public.obw_apply_ambassador(
  p_name text, p_phone text, p_email text, p_photo_path text, p_level text,
  p_state text, p_district text, p_assembly text, p_block text, p_panchayat text,
  p_occupation text, p_social text, p_motivation text, p_ref text
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_phone text := right(regexp_replace(coalesce(p_phone,''), '\D', '', 'g'), 10);
  v_row   public.bowl_ambassadors;
begin
  if char_length(trim(coalesce(p_name,''))) < 2 then raise exception 'invalid_name'; end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then raise exception 'invalid_phone'; end if;
  if coalesce(trim(p_state),'') = '' then raise exception 'invalid_state'; end if;
  if p_level not in ('national','state','district','assembly','block','panchayat','ward','institutional','campus')
    then raise exception 'invalid_level'; end if;
  if p_photo_path is not null and p_photo_path not like 'ambassadors/%' then raise exception 'invalid_photo'; end if;

  select * into v_row from public.bowl_ambassadors where phone = v_phone;
  if found then
    return json_build_object('application_no', v_row.application_no, 'status', v_row.status, 'existing', true);
  end if;

  insert into public.bowl_ambassadors
    (name, phone, email, photo_path, level, state, district, assembly, block, panchayat_ward,
     occupation, social_profile, motivation, referred_by)
  values
    (left(trim(p_name),100), v_phone, nullif(left(trim(coalesce(p_email,'')),120),''), p_photo_path, p_level,
     left(trim(p_state),60),
     nullif(left(trim(coalesce(p_district,'')),80),''),  nullif(left(trim(coalesce(p_assembly,'')),80),''),
     nullif(left(trim(coalesce(p_block,'')),80),''),     nullif(left(trim(coalesce(p_panchayat,'')),80),''),
     nullif(left(trim(coalesce(p_occupation,'')),120),''), nullif(left(trim(coalesce(p_social,'')),300),''),
     nullif(left(trim(coalesce(p_motivation,'')),1000),''), nullif(upper(trim(coalesce(p_ref,''))),''))
  returning * into v_row;

  return json_build_object('application_no', v_row.application_no, 'status', v_row.status, 'existing', false);
end $$;

-- =====================================================================
--  FUNCTION 4: National Impact Dashboard (केवल गिनती, कोई निजी जानकारी नहीं)
-- =====================================================================
create or replace function public.obw_stats()
returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'ambassadors',  (select count(*) from bowl_ambassadors where status = 'approved'),
    'participants', (select count(*) from bowl_participants),
    'reach',        (select coalesce(sum(reach),0) from bowl_reach_logs),
    'pledges',      (select count(*) from bowl_participants)
                    + (select coalesce(sum(offline_pledges),0) from bowl_reach_logs),
    'reported',     (select count(*) from bowl_reports),
    'verified',     (select count(*) from bowl_reports where status = 'verified'),
    'bowls_pledged',(select coalesce(sum(bowls_pledged),0) from bowl_participants),
    'states', coalesce((
      select json_agg(s order by s.participants desc) from (
        select p.state,
               count(*) as participants,
               count(distinct p.district) filter (where p.district is not null) as districts,
               (select count(*) from bowl_reports r join bowl_participants p2 on p2.id = r.participant_id
                 where p2.state = p.state and r.status = 'verified') as verified
          from bowl_participants p group by p.state
          order by count(*) desc limit 15) s), '[]'::json),
    'updated_at', now()
  );
$$;

revoke all on function public.obw_join, public.obw_report,
                       public.obw_apply_ambassador, public.obw_stats from public;
grant execute on function public.obw_join, public.obw_report,
                          public.obw_apply_ambassador, public.obw_stats to anon, authenticated;

-- =====================================================================
--  STORAGE: फोटो के लिए private bucket (5 MB तक, केवल image)
--  Public नहीं — फोटो केवल Admin Supabase Dashboard से देख सकेगा।
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('one-bowl', 'one-bowl', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "obw upload photos" on storage.objects;
create policy "obw upload photos" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'one-bowl'
    and (name like 'reports/OBW-%/%' or name like 'ambassadors/%')
  );

-- =====================================================================
--  ADMIN के काम (अभी SQL Editor से, Phase 2 में Admin Panel से)
-- =====================================================================
-- नए आवेदन देखें:
--   select application_no, name, phone, level, state, district, created_at
--     from bowl_ambassadors where status = 'pending' order by created_at;
--
-- Ambassador Approve करें (Unique Ambassador ID अपने-आप बनेगी):
--   update bowl_ambassadors
--      set status = 'approved', approved_at = now(),
--          ambassador_code = 'OBW-A-' || lpad(nextval('obw_ambassador_seq')::text, 5, '0')
--    where application_no = 'OBW-APP-1001' and ambassador_code is null;
--
-- फोटो-रिपोर्ट Verify करें:
--   update bowl_reports set status = 'verified', verified_at = now() where id = '...';
