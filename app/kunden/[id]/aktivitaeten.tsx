import { getAktivitaeten } from "@/lib/data";
import AktivitaetenClient from "./aktivitaeten-client";

export default async function Aktivitaeten({ kundeId }: { kundeId: string }) {
  const entries = await getAktivitaeten(kundeId);
  return <AktivitaetenClient entries={entries} />;
}
