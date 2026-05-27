import { getPipelineEintrag } from "@/lib/data";
import PipelineDetailClient from "./pipeline-detail-client";

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
  const eintrag = await getPipelineEintrag(Number(id), mockMode);

  if (!eintrag) {
    return <p>Pipeline-Eintrag nicht gefunden</p>;
  }

  return <PipelineDetailClient eintrag={eintrag} />;
}
