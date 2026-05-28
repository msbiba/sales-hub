import { getKunden } from "@/lib/data";
import PipelineNeuClient from "./pipeline-neu-client";

export const dynamic = "force-dynamic";

export default async function NeuerPipelineEintragPage() {
  const kunden = await getKunden();
  const kundenOptions = kunden.map((k) => ({ id: k.id, firma: k.firma }));
  return <PipelineNeuClient kunden={kundenOptions} />;
}
