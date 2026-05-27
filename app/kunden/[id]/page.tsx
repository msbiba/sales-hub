import { getKunde } from "@/lib/data";
import KundeDetailClient from "./kunde-detail-client";

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
  const kunde = await getKunde(id, mockMode);

  if (!kunde) {
    return <p>Kunde nicht gefunden</p>;
  }

  return <KundeDetailClient kunde={kunde} />;
}
