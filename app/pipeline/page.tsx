import type { Metadata } from "next";
import { getPipeline } from "@/lib/data";
import PipelineClient from "./pipeline-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pipeline · Solarwerk Sued",
};

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ mock?: string }>;
}) {
  const params = await searchParams;
  const mockMode = params.mock ?? 'normal';
  const eintraege = await getPipeline(mockMode);
  return <PipelineClient eintraege={eintraege} />;
}
