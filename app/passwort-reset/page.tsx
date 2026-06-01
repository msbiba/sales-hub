"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function PasswortResetPage() {
  const [email, setEmail] = useState("");
  const [fehler, setFehler] = useState<string | null>(null);
  const [erfolg, setErfolg] = useState(false);
  const [laedt, setLaedt] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFehler(null);
    setLaedt(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/passwort-neu`,
    });

    if (error) {
      setFehler(error.message);
      setLaedt(false);
      return;
    }

    setErfolg(true);
    setLaedt(false);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8"
      >
        <h1 className="mb-6 text-center text-xl font-bold">
          Passwort zuruecksetzen
        </h1>

        {erfolg ? (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            E-Mail mit Reset-Link wurde versendet. Bitte Posteingang pruefen.
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600">
              E-Mail eingeben, wir senden einen Link zum Zuruecksetzen.
            </p>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {fehler && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {fehler}
              </div>
            )}

            <button
              type="submit"
              disabled={laedt}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {laedt ? "Bitte warten..." : "Reset-Link senden"}
            </button>
          </>
        )}

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-xs text-blue-600 hover:underline"
          >
            Zurueck zum Login
          </Link>
        </div>
      </form>
    </div>
  );
}
