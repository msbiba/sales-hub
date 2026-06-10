"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateKunde, type ValidationErrors } from "@/lib/validation";

const initialFormData = {
  firma: "",
  ansprechpartner: "",
  branche: "",
  anlagengroesse_kwp: "",
  status: "aktiv",
  telefon: "",
  email: "",
  notiz: "",
};

export default function NeuerKundeClient() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[e.target.name as keyof ValidationErrors];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const errs = validateKunde(formData);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/kunden", {
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
      setTimeout(() => router.push("/"), 2000);
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

  const fieldClass = (name: keyof ValidationErrors) =>
    `w-full rounded-md border px-3 py-2 text-sm ${
      fieldErrors[name] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Neuen Kunden anlegen</h1>

      {success && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-300 p-3 text-sm text-green-800">
          Kunde wurde angelegt.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-50 border border-red-300 p-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firma"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Firma *
            </label>
            <input
              type="text"
              id="firma"
              name="firma"
              value={formData.firma}
              onChange={handleChange}
              aria-invalid={fieldErrors.firma ? true : undefined}
              aria-describedby={fieldErrors.firma ? "firma-error" : undefined}
              className={fieldClass("firma")}
            />
            {fieldErrors.firma && (
              <p id="firma-error" role="alert" className="mt-1 text-xs text-red-600">
                {fieldErrors.firma}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="ansprechpartner"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Ansprechpartner *
            </label>
            <input
              type="text"
              id="ansprechpartner"
              name="ansprechpartner"
              value={formData.ansprechpartner}
              onChange={handleChange}
              aria-invalid={fieldErrors.ansprechpartner ? true : undefined}
              aria-describedby={
                fieldErrors.ansprechpartner ? "ansprechpartner-error" : undefined
              }
              className={fieldClass("ansprechpartner")}
            />
            {fieldErrors.ansprechpartner && (
              <p
                id="ansprechpartner-error"
                role="alert"
                className="mt-1 text-xs text-red-600"
              >
                {fieldErrors.ansprechpartner}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="branche"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Branche *
            </label>
            <input
              type="text"
              id="branche"
              name="branche"
              value={formData.branche}
              onChange={handleChange}
              aria-invalid={fieldErrors.branche ? true : undefined}
              aria-describedby={fieldErrors.branche ? "branche-error" : undefined}
              className={fieldClass("branche")}
            />
            {fieldErrors.branche && (
              <p id="branche-error" role="alert" className="mt-1 text-xs text-red-600">
                {fieldErrors.branche}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="anlagengroesse_kwp"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Anlagengroesse (kWp) *
            </label>
            <input
              type="number"
              inputMode="numeric"
              id="anlagengroesse_kwp"
              name="anlagengroesse_kwp"
              value={formData.anlagengroesse_kwp}
              onChange={handleChange}
              aria-invalid={fieldErrors.anlagengroesse_kwp ? true : undefined}
              aria-describedby={
                fieldErrors.anlagengroesse_kwp
                  ? "anlagengroesse_kwp-error"
                  : undefined
              }
              className={fieldClass("anlagengroesse_kwp")}
            />
            {fieldErrors.anlagengroesse_kwp && (
              <p
                id="anlagengroesse_kwp-error"
                role="alert"
                className="mt-1 text-xs text-red-600"
              >
                {fieldErrors.anlagengroesse_kwp}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="aktiv">Aktiv</option>
              <option value="interessent">Interessent</option>
              <option value="in_wartung">In Wartung</option>
              <option value="beschwerde">Beschwerde</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="telefon"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Telefon *
            </label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              autoComplete="tel"
              aria-invalid={fieldErrors.telefon ? true : undefined}
              aria-describedby={fieldErrors.telefon ? "telefon-error" : undefined}
              className={fieldClass("telefon")}
            />
            {fieldErrors.telefon && (
              <p id="telefon-error" role="alert" className="mt-1 text-xs text-red-600">
                {fieldErrors.telefon}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              E-Mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={fieldClass("email")}
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label
            htmlFor="notiz"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Notiz
          </label>
          <textarea
            id="notiz"
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
            {isSubmitting ? "Wird gespeichert…" : "Kunde anlegen"}
          </button>
        </div>
      </form>
    </div>
  );
}
