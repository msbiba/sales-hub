import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/role";
import NeuerKundeClient from "./neuer-kunde-client";

export const metadata: Metadata = {
  title: "Neuer Kunde · Solarwerk Sued",
};

export default async function NeuerKundePage() {
  await requireRole(["admin", "bearbeiter"]);
  return <NeuerKundeClient />;
}
