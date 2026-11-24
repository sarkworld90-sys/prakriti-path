-- =====================================================================
--  FACEBOOK / INSTAGRAM ADS — /guidance page के leads
--  पहले margdarshan.sql चल चुकी हो। फिर यह फ़ाइल Run करें (दोबारा चलाना सुरक्षित)।
-- =====================================================================

-- कौन-सा ad / campaign से आया — यह भी सहेजें
alter table public.pp_enquiries add column if not exists utm jsonb;
alter table public.pp_enquiries add column if not exists landing text;

create or replace function public.pp_book_lead(
  p_name text, p_phone text, p_city text, p_concern text, p_time text, p_utm jsonb
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_phone  text := right(regexp_replace(coalesce(p_phone,''), '\D', '', 'g'), 10);
  v_recent int;
  v_no     text;
  v_utm    jsonb := '{}'::jsonb;
  v_src    text;
  k        text;
begin
  if char_length(trim(coalesce(p_name,''))) < 2 then raise exception 'invalid_name'; end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then raise exception 'invalid_phone'; end if;

  select count(*) into v_recent from public.pp_enquiries
   where phone = v_phone and created_at > now() - interval '1 day';
  if v_recent >= 3 then raise exception 'too_many'; end if;

  -- केवल जाने-पहचाने UTM keys, छोटे मान
  if jsonb_typeof(p_utm) = 'object' then
    foreach k in array array['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','ref'] loop
      if p_utm ? k and jsonb_typeof(p_utm->k) = 'string' then
        v_utm := v_utm || jsonb_build_object(k, left(p_utm->>k, 200));
      end if;
    end loop;
  end if;

  v_src := lower(coalesce(nullif(v_utm->>'utm_source',''), case when v_utm ? 'fbclid' then 'facebook' end, 'ads_page'));
  v_src := left(regexp_replace(v_src, '[^a-z0-9_-]', '', 'g'), 30);

  insert into public.pp_enquiries
    (program, mode, name, phone, city, preferred_time, concern, source, utm, landing)
  values
    ('free_call', 'online', left(trim(p_name),100), v_phone,
     nullif(left(trim(coalesce(p_city,'')),80),''),
     nullif(left(trim(coalesce(p_time,'')),80),''),
     nullif(left(trim(coalesce(p_concern,'')),1500),''),
     v_src, nullif(v_utm, '{}'::jsonb), '/guidance')
  returning enquiry_no into v_no;

  return json_build_object('enquiry_no', v_no);
end $$;

revoke all on function public.pp_book_lead(text,text,text,text,text,jsonb) from public;
grant execute on function public.pp_book_lead(text,text,text,text,text,jsonb) to anon, authenticated;

-- =====================================================================
--  ADS की रिपोर्ट (SQL Editor में चलाएँ)
-- =====================================================================
-- कौन-सा campaign / ad कितने leads दे रहा है:
--   select coalesce(utm->>'utm_campaign','—') as campaign, coalesce(utm->>'utm_content','—') as ad,
--          count(*) as leads, count(*) filter (where status in ('paid','completed')) as converted
--     from pp_enquiries where landing = '/guidance'
--    group by 1, 2 order by leads desc;
--
-- आज के नए leads:
--   select enquiry_no, name, phone, city, concern, utm->>'utm_campaign' as campaign, created_at
--     from pp_enquiries where landing = '/guidance' and created_at::date = current_date order by created_at desc;
