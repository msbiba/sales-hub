-- Migration 1/2: activity_history Tabelle + RLS-Policies
-- Spec: SPEC_activity_history.md

create table if not exists public.activity_history (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  kunde_id      uuid references public.kunden(id) on delete cascade,
  pipeline_id   uuid references public.pipeline(id) on delete cascade,
  event_type    text not null check (event_type in ('insert','update')),
  field         text,
  old_value     text,
  new_value     text,
  author_id     uuid references auth.users(id) on delete set null,
  author_email  text,
  constraint activity_history_exactly_one_parent
    check ((kunde_id is not null) <> (pipeline_id is not null))
);

-- Partial-Indizes pro Eltern-Typ, sortiert nach Zeit DESC für Detailseiten-Query
create index if not exists idx_activity_history_kunde
  on public.activity_history (kunde_id, created_at desc)
  where kunde_id is not null;

create index if not exists idx_activity_history_pipeline
  on public.activity_history (pipeline_id, created_at desc)
  where pipeline_id is not null;

-- RLS aktivieren
alter table public.activity_history enable row level security;

-- Lese-Policy: Vererbung via EXISTS-Subquery auf Eltern-Tabelle.
-- Bestehende kunden/pipeline-RLS filtert automatisch nach Rolle
-- (admin=alles, bearbeiter=eigene via bearbeiter_id=auth.uid(), buchhaltung=alles lesend).
drop policy if exists "history_read_via_parent_kunde" on public.activity_history;
create policy "history_read_via_parent_kunde"
  on public.activity_history for select
  to authenticated
  using (
    kunde_id is not null
    and exists (select 1 from public.kunden k where k.id = activity_history.kunde_id)
  );

drop policy if exists "history_read_via_parent_pipeline" on public.activity_history;
create policy "history_read_via_parent_pipeline"
  on public.activity_history for select
  to authenticated
  using (
    pipeline_id is not null
    and exists (select 1 from public.pipeline p where p.id = activity_history.pipeline_id)
  );

-- Keine INSERT/UPDATE/DELETE-Policy:
-- App-Kontext kann nicht schreiben. Nur Trigger (SECURITY DEFINER) füllt Tabelle.
