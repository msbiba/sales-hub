import { getPipeline } from "@/lib/data";
import PipelineClient from "./pipeline-client";

export const dynamic = "force-dynamic";

export default function PipelinePage() {
  const eintraege = getPipeline();
  return <PipelineClient eintraege={eintraege} />;
}
