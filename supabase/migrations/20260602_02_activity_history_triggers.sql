-- Migration 2/3: Trigger-Funktion log_changes() + Trigger auf kunden/pipeline
-- Spec: SPEC_activity_history.md
--
-- Wichtig: text-Felder werden via coalesce(x, '') verglichen, damit NULL und
-- '' als gleichwertig gelten (Forms schicken oft '' wo DB NULL hat).

create or replace function public.log_changes()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email     text;
  v_kunde     uuid;
  v_pipeline  uuid;
  v_old_email text;
  v_new_email text;
begin
  select email into v_email from auth.users where id = auth.uid();

  if tg_table_name = 'kunden' then
    v_kunde := coalesce(new.id, old.id);
  elsif tg_table_name = 'pipeline' then
    v_pipeline := coalesce(new.id, old.id);
  end if;

  -- ============================================================
  -- INSERT
  -- ============================================================
  if tg_op = 'INSERT' then
    insert into public.activity_history
      (kunde_id, pipeline_id, event_type, author_id, author_email)
      values (v_kunde, v_pipeline, 'insert', auth.uid(), v_email);
    return new;
  end if;

  -- ============================================================
  -- UPDATE: pro echt geändertem Feld eine Zeile
  -- ============================================================
  if tg_op = 'UPDATE' then

    if tg_table_name = 'kunden' then

      if coalesce(new.firma, '') <> coalesce(old.firma, '') then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'firma', old.firma, new.firma, auth.uid(), v_email);
      end if;

      if coalesce(new.ansprechpartner, '') <> coalesce(old.ansprechpartner, '') then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'ansprechpartner', old.ansprechpartner, new.ansprechpartner, auth.uid(), v_email);
      end if;

      if coalesce(new.branche, '') <> coalesce(old.branche, '') then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'branche', old.branche, new.branche, auth.uid(), v_email);
      end if;

      if coalesce(new.telefon, '') <> coalesce(old.telefon, '') then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'telefon', old.telefon, new.telefon, auth.uid(), v_email);
      end if;

      if coalesce(new.email, '') <> coalesce(old.email, '') then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'email', old.email, new.email, auth.uid(), v_email);
      end if;

      if coalesce(new.notiz, '') <> coalesce(old.notiz, '') then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'notiz', old.notiz, new.notiz, auth.uid(), v_email);
      end if;

      if coalesce(new.status::text, '') <> coalesce(old.status::text, '') then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'status', old.status::text, new.status::text, auth.uid(), v_email);
      end if;

      if new.anlagengroesse_kwp is distinct from old.anlagengroesse_kwp then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'anlagengroesse_kwp', old.anlagengroesse_kwp::text, new.anlagengroesse_kwp::text, auth.uid(), v_email);
      end if;

      if new.letzter_kontakt is distinct from old.letzter_kontakt then
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'letzter_kontakt', old.letzter_kontakt::text, new.letzter_kontakt::text, auth.uid(), v_email);
      end if;

      if new.bearbeiter_id is distinct from old.bearbeiter_id then
        select email into v_old_email from auth.users where id = old.bearbeiter_id;
        select email into v_new_email from auth.users where id = new.bearbeiter_id;
        insert into public.activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (
            v_kunde, 'update', 'bearbeiter',
            coalesce(v_old_email, '(unbekannt)'),
            coalesce(v_new_email, '(unbekannt)'),
            auth.uid(), v_email
          );
      end if;

    elsif tg_table_name = 'pipeline' then

      if coalesce(new.firma, '') <> coalesce(old.firma, '') then
        insert into public.activity_history (pipeline_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_pipeline, 'update', 'firma', old.firma, new.firma, auth.uid(), v_email);
      end if;

      if coalesce(new.notiz, '') <> coalesce(old.notiz, '') then
        insert into public.activity_history (pipeline_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_pipeline, 'update', 'notiz', old.notiz, new.notiz, auth.uid(), v_email);
      end if;

      if coalesce(new.status::text, '') <> coalesce(old.status::text, '') then
        insert into public.activity_history (pipeline_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_pipeline, 'update', 'status', old.status::text, new.status::text, auth.uid(), v_email);
      end if;

      if new.volumen_eur is distinct from old.volumen_eur then
        insert into public.activity_history (pipeline_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_pipeline, 'update', 'volumen_eur', old.volumen_eur::text, new.volumen_eur::text, auth.uid(), v_email);
      end if;

      if new.angebotsdatum is distinct from old.angebotsdatum then
        insert into public.activity_history (pipeline_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_pipeline, 'update', 'angebotsdatum', old.angebotsdatum::text, new.angebotsdatum::text, auth.uid(), v_email);
      end if;

      if new.bearbeiter_id is distinct from old.bearbeiter_id then
        select email into v_old_email from auth.users where id = old.bearbeiter_id;
        select email into v_new_email from auth.users where id = new.bearbeiter_id;
        insert into public.activity_history (pipeline_id, event_type, field, old_value, new_value, author_id, author_email)
          values (
            v_pipeline, 'update', 'bearbeiter',
            coalesce(v_old_email, '(unbekannt)'),
            coalesce(v_new_email, '(unbekannt)'),
            auth.uid(), v_email
          );
      end if;

    end if;

    return new;
  end if;

  -- DELETE: CASCADE räumt activity_history-Einträge automatisch.
  return old;
end;
$$;

drop trigger if exists trg_kunden_audit on public.kunden;
create trigger trg_kunden_audit
  after insert or update or delete on public.kunden
  for each row execute function public.log_changes();

drop trigger if exists trg_pipeline_audit on public.pipeline;
create trigger trg_pipeline_audit
  after insert or update or delete on public.pipeline
  for each row execute function public.log_changes();
