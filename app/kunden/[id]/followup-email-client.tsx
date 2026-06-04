"use client";

import { useState, useRef } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const EMAIL_TYPEN = [
  { value: "nachfass", label: "Nachfass-E-Mail" },
  { value: "angebot", label: "Angebot nachfassen" },
  { value: "termin", label: "Terminvereinbarung" },
  { value: "beschwerde_antwort", label: "Antwort auf Beschwerde" },
  { value: "statusupdate", label: "Projektstatus-Update" },
  { value: "wartungserinnerung", label: "Wartungserinnerung" },
  { value: "upselling", label: "Upselling/Cross-Selling" },
  { value: "projektabschluss", label: "Projektabschluss" },
];

const TON_OPTIONEN = [
  { value: "formell", label: "Formell (Sie)" },
  { value: "locker", label: "Locker (Du)" },
  { value: "neutral", label: "Neutral" },
];

const MAX_GENERIERUNGEN = 5;

function parseEmailResponse(raw: string): { betreff: string; body: string } {
  const separatorIdx = raw.indexOf("\n---\n");
  if (separatorIdx !== -1) {
    const before = raw.slice(0, separatorIdx).trim();
    const after = raw.slice(separatorIdx + 5).trim();
    return { betreff: before.replace(/^BETREFF:\s*/i, ""), body: after };
  }

  const altIdx = raw.indexOf("---\n");
  if (altIdx > 0) {
    const before = raw.slice(0, altIdx).trim();
    const after = raw.slice(altIdx + 4).trim();
    return { betreff: before.replace(/^BETREFF:\s*/i, ""), body: after };
  }

  return { betreff: "", body: raw };
}

export default function FollowupEmailClient({
  kundeId,
}: {
  kundeId: string;
}) {
  const [emailTyp, setEmailTyp] = useState("");
  const [ton, setTon] = useState("");
  const [zusatzKontext, setZusatzKontext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [betreff, setBetreff] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(MAX_GENERIERUNGEN);
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const receivedDataRef = useRef(false);

  const canGenerate = emailTyp !== "" && ton !== "" && remaining > 0 && !isGenerating;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setBetreff("");
    setEmailBody("");
    setHasGenerated(false);
    setCopied(false);
    receivedDataRef.current = false;

    try {
      const res = await fetch("/api/ai/followup-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kundeId,
          emailTyp,
          ton,
          zusatzKontext: zusatzKontext || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unbekannter Fehler" }));
        setError(data.error || `Fehler ${res.status}`);
        setIsGenerating(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("Keine Antwort vom Server");
        setIsGenerating(false);
        return;
      }

      const decoder = new TextDecoder();
      let rawText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        rawText += decoder.decode(value, { stream: true });
        receivedDataRef.current = true;
        const parsed = parseEmailResponse(rawText);
        setBetreff(parsed.betreff);
        setEmailBody(parsed.body);
      }

      setHasGenerated(true);
      setRemaining((r) => r - 1);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Verbindung unterbrochen");
      if (receivedDataRef.current) {
        setHasGenerated(true);
        setRemaining((r) => r - 1);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    const text = betreff
      ? `Betreff: ${betreff}\n\n${emailBody}`
      : emailBody;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";
  const labelCls = "mb-1 block text-sm text-gray-500";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>E-Mail-Typ *</label>
          <select
            value={emailTyp}
            onChange={(e) => setEmailTyp(e.target.value)}
            className={inputCls}
            disabled={isGenerating}
          >
            <option value="">— Bitte waehlen —</option>
            {EMAIL_TYPEN.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Ton *</label>
          <select
            value={ton}
            onChange={(e) => setTon(e.target.value)}
            className={inputCls}
            disabled={isGenerating}
          >
            <option value="">— Bitte waehlen —</option>
            {TON_OPTIONEN.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>
            Zusaetzlicher Kontext
            <span className="ml-2 text-xs text-gray-400">
              {zusatzKontext.length}/500
            </span>
          </label>
          <textarea
            value={zusatzKontext}
            onChange={(e) => setZusatzKontext(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder='z.B. "War letzte Woche vor Ort, hat neues Dach erwaehnt"'
            className={inputCls}
            disabled={isGenerating}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? "Generiere..." : "E-Mail generieren"}
        </button>
        <span className="text-xs text-gray-500">
          {remaining > 0
            ? `${remaining} von ${MAX_GENERIERUNGEN} Generierungen verbleibend`
            : "Limit erreicht. Seite neu laden fuer weitere Generierungen."}
        </span>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {(isGenerating || hasGenerated) && (
        <div className="mt-4 space-y-3">
          <div>
            <label className={labelCls}>Betreff</label>
            <input
              type="text"
              value={betreff}
              onChange={(e) => setBetreff(e.target.value)}
              placeholder={
                hasGenerated && !betreff
                  ? "Betreff manuell eingeben"
                  : "Wird generiert..."
              }
              className={inputCls}
              readOnly={isGenerating}
            />
          </div>
          <div>
            <label className={labelCls}>E-Mail-Text</label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={10}
              className={inputCls}
              readOnly={isGenerating}
            />
          </div>

          {hasGenerated && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Kopiert!" : "In Zwischenablage kopieren"}
              </button>
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" />
                  Neu generieren
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
