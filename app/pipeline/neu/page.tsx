import type { Metadata } from "next";
import { getKunden } from "@/lib/data";
import PipelineNeuClient from "./pipeline-neu-client";
import { requireRole } from "@/lib/auth/role";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Neuer Pipeline-Eintrag · Solarwerk Sued",
};

export default async function NeuerPipelineEintragPage() {
  await requireRole(["admin", "bearbeiter"]);
  const kunden = await getKunden();
  const kundenOptions = kunden.map((k) => ({ id: k.id, firma: k.firma }));
  return <PipelineNeuClient kunden={kundenOptions} />;
}
