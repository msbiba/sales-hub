import type { Metadata } from "next";
import { getKunden } from "@/lib/data";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard · Solarwerk Sued",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mock?: string }>;
}) {
  const params = await searchParams;
  const mockMode = params.mock ?? 'normal';
  const kunden = await getKunden(mockMode);

  return <DashboardClient kunden={kunden} />;
}
