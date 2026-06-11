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
        <p className="text-fs-2 font-semibold text-[var(--leaf)]">
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
      <p className="text-fs-3 font-semibold text-[var(--ink)]">
        Dach-Vorschau in 24 h
      </p>
      <p className="mt-1 text-fs-2 text-[var(--muted)]">
        Wir analysieren Ihr Hallendach per Satellitenbild und schicken Ihnen
        eine erste Einschätzung — kostenlos.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_2fr]">
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
          autoComplete="postal-code"
          className="rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-fs-2 text-[var(--ink)] outline-none focus:border-[var(--steel)]"
        />
        <input
          type="text"
          value={hausnummer}
          onChange={(e) => setHausnummer(e.target.value)}
          placeholder="Nr."
          aria-label="Hausnummer (optional)"
          autoComplete="address-line2"
          className="rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-fs-2 text-[var(--ink)] outline-none focus:border-[var(--steel)]"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail für Rückmeldung"
          aria-label="E-Mail-Adresse"
          autoComplete="email"
          className="col-span-2 rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-fs-2 text-[var(--ink)] outline-none focus:border-[var(--steel)] sm:col-span-1"
        />
      </div>
      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="btn-secondary focus-ring mt-4 w-full text-fs-2 sm:w-auto"
      >
        {status.kind === "submitting"
          ? "Wird gesendet …"
          : "Satelliten-Vorschau anfordern"}
      </button>
      {status.kind === "error" && (
        <p className="mt-3 text-fs-2 text-red-600">{status.message}</p>
      )}
      <p className="mt-3 text-fs-1 text-[var(--muted)]">
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
