import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types";

/**
 * Liefert das Profile des aktuell eingeloggten Users (cached pro Request).
 * Liefert null wenn nicht eingeloggt oder Profile-Row fehlt.
 */
export const getCurrentUserProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, last_login_at, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return data as Profile;
});

/**
 * Wirft Redirect (`/login` wenn unauth, `/403` wenn Rolle nicht passt).
 * In Server-Components am Anfang aufrufen.
 */
export async function requireRole(
  allowed: UserRole | UserRole[]
): Promise<Profile> {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/login");

  const allowedList = Array.isArray(allowed) ? allowed : [allowed];
  if (!allowedList.includes(profile.role)) redirect("/403");
  if (!profile.is_active) redirect("/login?inactive=1");

  return profile;
}
