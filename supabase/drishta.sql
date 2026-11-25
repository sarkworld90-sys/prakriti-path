-- =====================================================================
--  PRAKRITI PATH – दृष्टा · संस्थाओं की Inquiry (आवेदन)
--  Supabase → SQL Editor → New query → पूरी फ़ाइल paste → Run (दोबारा चलाना सुरक्षित)
-- =====================================================================

create extension if not exists pgcrypto;
create sequence if not exists pp_drishta_seq start 1001;

create table if not exists public.pp_drishta_enquiries (
  id          uuid primary key default gen_random_uuid(),
  enquiry_no  text unique not null default ('DRS-' || nextval('pp_drishta_seq')),
  name        text not null check (char_length(name) between 2 and 100),
  org_name    text not null check (char_length(org_name) between 2 and 150),
  phone       text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email       text,
  org_type    text not null,
  purpose     text not null,
  service     text,
  details     text,
  utm         jsonb,
  status      text not null default 'new'
                check (status in ('new','contacted','meeting','proposal','active','completed','closed')),
  admin_note  text,
  created_at  timestamptz not null default now()
);
create index if not exists pp_drishta_status_idx on public.pp_drishta_enquiries(status, created_at desc);

alter table public.pp_drishta_enquiries enable row level security;
revoke all on public.pp_drishta_enquiries from anon, authenticated;

create or replace function public.pp_book_drishta(
  p_name text, p_org text, p_phone text, p_email text, p_org_type text,
  p_purpose text, p_service text, p_details text, p_utm jsonb
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_phone  text := right(regexp_replace(coalesce(p_phone,''), '\D', '', 'g'), 10);
  v_recent int;
  v_no     text;
  v_utm    jsonb := '{}'::jsonb;
  k        text;
begin
  if char_length(trim(coalesce(p_name,''))) < 2 then raise exception 'invalid_name'; end if;
  if char_length(trim(coalesce(p_org,''))) < 2 then raise exception 'invalid_org'; end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then raise exception 'invalid_phone'; end if;
  if p_org_type not in ('private','corporate','school','college','education','ngo','trust','hospital',
                        'startup','government','pilot','social','small','enterprise','other')
    then raise exception 'invalid_org_type'; end if;
  if p_purpose not in ('assessment','consultation','demo','project','observer')
    then raise exception 'invalid_purpose'; end if;
  if p_service is not null and p_service not in ('observation','assessment','cost','hr','tech','growth','unsure')
    then raise exception 'invalid_service'; end if;

  select count(*) into v_recent from public.pp_drishta_enquiries
   where phone = v_phone and created_at > now() - interval '1 day';
  if v_recent >= 3 then raise exception 'too_many'; end if;

  if jsonb_typeof(p_utm) = 'object' then
    foreach k in array array['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid'] loop
      if p_utm ? k and jsonb_typeof(p_utm->k) = 'string' then
        v_utm := v_utm || jsonb_build_object(k, left(p_utm->>k, 200));
      end if;
    end loop;
  end if;

  insert into public.pp_drishta_enquiries
    (name, org_name, phone, email, org_type, purpose, service, details, utm)
  values
    (left(trim(p_name),100), left(trim(p_org),150), v_phone,
     nullif(left(trim(coalesce(p_email,'')),120),''), p_org_type, p_purpose, p_service,
     nullif(left(trim(coalesce(p_details,'')),2000),''), nullif(v_utm, '{}'::jsonb))
  returning enquiry_no into v_no;

  return json_build_object('enquiry_no', v_no);
end $$;

revoke all on function public.pp_book_drishta(text,text,text,text,text,text,text,text,jsonb) from public;
grant execute on function public.pp_book_drishta(text,text,text,text,text,text,text,text,jsonb) to anon, authenticated;

-- =====================================================================
--  ADMIN: नए आवेदन देखें
--   select enquiry_no, name, org_name, phone, org_type, purpose, service, created_at
--     from pp_drishta_enquiries where status = 'new' order by created_at desc;
--  ईमेल पर सूचना चाहिए तो: Supabase → Database → Webhooks → इस table पर INSERT
--  (या Integrations में email service जोड़कर) — README देखें।
-- =====================================================================
