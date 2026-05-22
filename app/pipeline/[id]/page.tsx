import { getPipelineEintrag } from "@/lib/data";
import PipelineDetailClient from "./pipeline-detail-client";

export const dynamic = "force-dynamic";

export default async function PipelineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eintrag = getPipelineEintrag(Number(id));

  if (!eintrag) {
    return <p>Pipeline-Eintrag nicht gefunden</p>;
  }

  return <PipelineDetailClient eintrag={eintrag} />;
}
