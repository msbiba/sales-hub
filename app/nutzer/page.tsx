import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/role";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import NutzerClient from "./nutzer-client";
import type { Profile } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nutzer · Solarwerk Sued",
};

export default async function NutzerPage() {
  const adminProfile = await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, last_login_at, created_at, updated_at")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Fehler beim Laden der Nutzer: {error.message}
      </div>
    );
  }

  return <NutzerClient profiles={(data as Profile[]) ?? []} currentUserId={adminProfile.id} />;
}
