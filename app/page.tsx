import { getKunden } from "@/lib/data";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const kunden = await getKunden();

  return <DashboardClient kunden={kunden} />;
}
