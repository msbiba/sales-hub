import { getKunde, hatPipelineEintraege } from "@/lib/data";
import KundeDetailClient from "./kunde-detail-client";
import { getCurrentUserProfile } from "@/lib/auth/role";
import Historie from "./historie";

export default async function KundenDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mock?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const mockMode = sp.mock ?? 'normal';
  const [kunde, profile, hasPipeline] = await Promise.all([
    getKunde(id, mockMode),
    getCurrentUserProfile(),
    hatPipelineEintraege(id),
  ]);

  if (!kunde) {
    return <p>Kunde nicht gefunden</p>;
  }

  const canEdit = profile?.role !== "buchhaltung";

  return (
    <>
      <KundeDetailClient kunde={kunde} canEdit={canEdit} hasPipelineEintraege={hasPipeline} />
      <Historie entityType="kunde" entityId={kunde.id} />
    </>
  );
}
