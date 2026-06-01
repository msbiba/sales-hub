"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function PasswortNeuPage() {
  const router = useRouter();
  const [passwort, setPasswort] = useState("");
  const [passwort2, setPasswort2] = useState("");
  const [fehler, setFehler] = useState<string | null>(null);
  const [laedt, setLaedt] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFehler(null);

    if (passwort.length < 6) {
      setFehler("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }
    if (passwort !== passwort2) {
      setFehler("Passwoerter stimmen nicht ueberein");
      return;
    }

    setLaedt(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: passwort });

    if (error) {
      setFehler(error.message);
      setLaedt(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8"
      >
        <h1 className="mb-6 text-center text-xl font-bold">
          Neues Passwort setzen
        </h1>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Neues Passwort
          </label>
          <input
            type="password"
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Wiederholen
          </label>
          <input
            type="password"
            value={passwort2}
            onChange={(e) => setPasswort2(e.target.value)}
            required
            minLength={6}
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
          {laedt ? "Bitte warten..." : "Passwort speichern"}
        </button>
      </form>
    </div>
  );
}
