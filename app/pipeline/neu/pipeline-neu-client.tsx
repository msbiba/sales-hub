"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validatePipeline, type PipelineErrors } from "@/lib/validation";

type KundeOption = { id: string; firma: string };

const initialFormData = {
  customer_id: "",
  firma: "",
  volumen_eur: "",
  angebotsdatum: "",
  status: "",
  notiz: "",
};

export default function PipelineNeuClient({ kunden }: { kunden: KundeOption[] }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<PipelineErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Beim Kunden-Wechsel: firma automatisch setzen
      if (name === "customer_id") {
        const k = kunden.find((k) => k.id === value);
        next.firma = k?.firma ?? "";
      }
      return next;
    });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof PipelineErrors];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const errs = validatePipeline(formData);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Speichern fehlgeschlagen");
      }

      setSuccess(true);
      setFormData(initialFormData);
      router.refresh();
      setTimeout(() => router.push("/pipeline"), 2000);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Speichern fehlgeschlagen, bitte erneut versuchen");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Speichern fehlgeschlagen, bitte erneut versuchen"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass = (name: keyof PipelineErrors) =>
    `w-full rounded-md border px-3 py-2 text-sm ${
      fieldErrors[name] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Neuen Pipeline-Eintrag anlegen</h1>

      {success && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-300 p-3 text-sm text-green-800">
          Pipeline-Eintrag wurde angelegt.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-300 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Kunde *
            </label>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              className={fieldClass("customer_id")}
            >
              <option value="">Bitte Kunde waehlen…</option>
              {kunden.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.firma}
                </option>
              ))}
            </select>
            {fieldErrors.customer_id && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.customer_id}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Volumen (EUR) *
            </label>
            <input
              type="number"
              name="volumen_eur"
              value={formData.volumen_eur}
              onChange={handleChange}
              className={fieldClass("volumen_eur")}
            />
            {fieldErrors.volumen_eur && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.volumen_eur}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Angebotsdatum *
            </label>
            <input
              type="date"
              name="angebotsdatum"
              value={formData.angebotsdatum}
              onChange={handleChange}
              className={fieldClass("angebotsdatum")}
            />
            {fieldErrors.angebotsdatum && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.angebotsdatum}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={fieldClass("status")}
            >
              <option value="">Bitte waehlen…</option>
              <option value="erstkontakt">Erstkontakt</option>
              <option value="angebot_raus">Angebot raus</option>
              <option value="verhandlung">Verhandlung</option>
              <option value="gewonnen">Gewonnen</option>
              <option value="verloren">Verloren</option>
              <option value="loeschbar">Loeschbar</option>
            </select>
            {fieldErrors.status && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.status}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Notiz
          </label>
          <textarea
            name="notiz"
            value={formData.notiz}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Wird gespeichert…" : "Pipeline-Eintrag anlegen"}
          </button>
        </div>
      </form>
    </div>
  );
}
