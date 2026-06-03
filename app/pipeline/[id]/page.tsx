import { getPipelineEintrag } from "@/lib/data";
import PipelineDetailClient from "./pipeline-detail-client";
import { getCurrentUserProfile } from "@/lib/auth/role";
import Historie from "@/app/kunden/[id]/historie";

export const dynamic = "force-dynamic";

export default async function PipelineDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mock?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const mockMode = sp.mock ?? 'normal';
  const [eintrag, profile] = await Promise.all([
    getPipelineEintrag(id, mockMode),
    getCurrentUserProfile(),
  ]);

  if (!eintrag) {
    return <p>Pipeline-Eintrag nicht gefunden</p>;
  }

  const canEdit = profile?.role !== "buchhaltung";

  return (
    <>
      <PipelineDetailClient eintrag={eintrag} canEdit={canEdit} />
      <Historie entityType="pipeline" entityId={eintrag.id} />
    </>
  );
}
