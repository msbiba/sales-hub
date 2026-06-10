"use client";

import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function SatellitePreview() {
  const [plz, setPlz] = useState("");
  const [hausnummer, setHausnummer] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^\d{5}$/.test(plz)) {
      setStatus({ kind: "error", message: "PLZ muss 5 Ziffern haben." });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "satellit",
          plz,
          hausnummer,
          email: email || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Fehler beim Senden");
      }
      setStatus({ kind: "success" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unbekannter Fehler";
      setStatus({ kind: "error", message });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="rounded-lg border border-[var(--leaf)]/30 bg-white p-5">
        <p className="text-sm font-semibold text-[var(--leaf)]">
          ✓ Vielen Dank. Wir melden uns innerhalb von 24 h mit einer ersten
          Satelliten-Einschätzung Ihres Dachs.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-[var(--line)] bg-white p-5"
    >
      <p className="text-[15px] font-semibold text-[var(--ink)]">
        Dach-Vorschau in 24 h
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Wir analysieren Ihr Hallendach per Satellitenbild und schicken Ihnen
        eine erste Einschätzung — kostenlos.
      </p>
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-[1fr_100px] gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            required
            value={plz}
            onChange={(e) => setPlz(e.target.value.replace(/\D/g, ""))}
            placeholder="PLZ"
            aria-label="Postleitzahl"
            className="focus-ring rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--steel)]"
          />
          <input
            type="text"
            value={hausnummer}
            onChange={(e) => setHausnummer(e.target.value)}
            placeholder="Nr."
            aria-label="Hausnummer (optional)"
            className="focus-ring rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--steel)]"
          />
        </div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail für Rückmeldung"
          aria-label="E-Mail-Adresse"
          className="focus-ring w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--steel)]"
        />
      </div>
      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50 sm:w-auto"
      >
        {status.kind === "submitting"
          ? "Wird gesendet …"
          : "Satelliten-Vorschau anfordern"}
      </button>
      {status.kind === "error" && (
        <p className="mt-3 text-sm text-red-600">{status.message}</p>
      )}
      <p className="mt-3 text-xs text-[var(--muted)]">
        Wir verwenden Ihre Daten ausschließlich für die Dach-Einschätzung.
        Details in der{" "}
        <a
          href="/datenschutz"
          className="underline underline-offset-2 hover:text-[var(--ink)]"
        >
          Datenschutzerklärung
        </a>
        .
      </p>
    </form>
  );
}
