import { getHistory, HistoryEntityType } from "@/lib/history";
import HistorieClient from "./historie-client";

/**
 * Server Component — lädt Aktivitäts-Historie aus Supabase und rendert
 * sie als ausklappbaren <details>-Block. Wird sowohl auf der Kunden-
 * als auch auf der Pipeline-Detailseite eingebunden.
 *
 * Sichtbarkeit wird automatisch über RLS-Vererbung gesteuert:
 *   - admin sieht alles
 *   - bearbeiter sieht nur Historie zu eigenen Datensätzen
 *   - buchhaltung sieht alle (read-only)
 */
export default async function Historie({
  entityType,
  entityId,
}: {
  entityType: HistoryEntityType;
  entityId: string;
}) {
  const entries = await getHistory(entityType, entityId);
  return <HistorieClient entries={entries} />;
}
