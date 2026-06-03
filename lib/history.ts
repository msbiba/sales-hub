import { createSupabaseServerClient } from './supabase/server';

export type HistoryEventType = 'insert' | 'update';

export type HistoryEntry = {
  id: string;
  created_at: string;
  event_type: HistoryEventType;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  author_email: string | null;
};

export type HistoryEntityType = 'kunde' | 'pipeline';

/**
 * Liest Aktivitäts-Historie für einen Kunden oder Pipeline-Eintrag.
 * Sortierung: neueste zuerst (created_at desc).
 * RLS-Vererbung filtert automatisch nach Rolle:
 *   - admin: alle Einträge
 *   - bearbeiter: nur Einträge zu eigenen Kunden/Pipeline (bearbeiter_id = auth.uid())
 *   - buchhaltung: alle Einträge (hat SELECT auf kunden/pipeline)
 */
export async function getHistory(
  entityType: HistoryEntityType,
  entityId: string
): Promise<HistoryEntry[]> {
  const supabase = await createSupabaseServerClient();
  const column = entityType === 'kunde' ? 'kunde_id' : 'pipeline_id';

  const { data, error } = await supabase
    .from('activity_history')
    .select('id, created_at, event_type, field, old_value, new_value, author_email')
    .eq(column, entityId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('history fetch error:', error.message);
    return [];
  }

  return (data ?? []) as HistoryEntry[];
}
