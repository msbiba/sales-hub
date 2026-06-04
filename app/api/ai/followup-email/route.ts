import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_EMAIL_TYPEN = [
  "nachfass",
  "angebot",
  "termin",
  "beschwerde_antwort",
  "statusupdate",
  "wartungserinnerung",
  "upselling",
  "projektabschluss",
] as const;

const ALLOWED_TON = ["formell", "locker", "neutral"] as const;

const EMAIL_TYP_LABELS: Record<string, string> = {
  nachfass: "Nachfass-E-Mail",
  angebot: "Angebot nachfassen/senden",
  termin: "Terminvereinbarung",
  beschwerde_antwort: "Antwort auf Beschwerde",
  statusupdate: "Projektstatus-Update",
  wartungserinnerung: "Wartungserinnerung",
  upselling: "Upselling/Cross-Selling",
  projektabschluss: "Projektabschluss-Mitteilung",
};

const TON_LABELS: Record<string, string> = {
  formell: "formell (Siezen)",
  locker: "locker (Duzen)",
  neutral: "sachlich/neutral",
};

const SYSTEM_PROMPT = `Du bist ein Vertriebs-Assistent fuer Solarwerk Sued GmbH, einen Anbieter von Photovoltaik-Anlagen fuer Gewerbe und Landwirtschaft. Du schreibst professionelle Follow-up-E-Mails an Bestandskunden und Interessenten.

Regeln:
- Antworte IMMER im folgenden Format, exakt so:
  BETREFF: [passender E-Mail-Betreff]
  ---
  [E-Mail-Body]
- Beginne den Body mit passender Anrede basierend auf dem gewaehlten Ton
- Beziehe dich konkret auf vorhandene Kundendaten (Anlagengroesse, letzte Interaktion, Pipeline-Status)
- Schliesse mit Signatur: [Absender-Name], Solarwerk Sued GmbH
- Halte den Body zwischen 80-200 Woertern
- Verwende keine Platzhalter wie [DATUM] oder [NAME] — nutze die echten Daten
- Schreibe auf Deutsch`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "KI-Feature nicht konfiguriert. Bitte API-Key hinterlegen." },
      { status: 500 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return Response.json({ error: "Profil nicht gefunden" }, { status: 401 });
  }
  if (profile.role === "buchhaltung") {
    return Response.json({ error: "Keine Berechtigung" }, { status: 403 });
  }

  let body: {
    kundeId?: string;
    emailTyp?: string;
    ton?: string;
    zusatzKontext?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Ungueltiger Request-Body" },
      { status: 400 }
    );
  }

  const { kundeId, emailTyp, ton, zusatzKontext } = body;

  if (!kundeId || typeof kundeId !== "string") {
    return Response.json({ error: "kundeId fehlt" }, { status: 400 });
  }
  if (
    !emailTyp ||
    !(ALLOWED_EMAIL_TYPEN as readonly string[]).includes(emailTyp)
  ) {
    return Response.json({ error: "Ungueltiger emailTyp" }, { status: 400 });
  }
  if (!ton || !(ALLOWED_TON as readonly string[]).includes(ton)) {
    return Response.json({ error: "Ungueltiger ton" }, { status: 400 });
  }
  if (zusatzKontext && typeof zusatzKontext === "string" && zusatzKontext.length > 500) {
    return Response.json(
      { error: "Zusatzkontext darf max. 500 Zeichen haben" },
      { status: 400 }
    );
  }

  const { data: kunde, error: kundeError } = await supabase
    .from("kunden")
    .select(
      "firma, ansprechpartner, status, letzter_kontakt, notiz, anlagengroesse_kwp"
    )
    .eq("id", kundeId)
    .single();

  if (kundeError || !kunde) {
    return Response.json({ error: "Kunde nicht gefunden" }, { status: 404 });
  }

  const { data: pipelineEintraege, error: pipelineError } = await supabase
    .from("pipeline")
    .select("volumen_eur, status, angebotsdatum, notiz")
    .eq("customer_id", kundeId);

  if (pipelineError) {
    return Response.json(
      { error: "Pipeline-Daten konnten nicht geladen werden" },
      { status: 500 }
    );
  }
  if (!pipelineEintraege || pipelineEintraege.length === 0) {
    return Response.json(
      { error: "Keine Pipeline-Eintraege vorhanden" },
      { status: 400 }
    );
  }

  const pipelineText = pipelineEintraege
    .map(
      (e) =>
        `- ${e.status}: ${e.volumen_eur} EUR (Angebot: ${e.angebotsdatum})${e.notiz ? " — " + e.notiz : ""}`
    )
    .join("\n");

  const absender = profile.full_name || "Ihr Solarwerk Sued Team";

  const userPrompt = `Erstelle eine Follow-up-E-Mail vom Typ "${EMAIL_TYP_LABELS[emailTyp] || emailTyp}" im Ton "${TON_LABELS[ton] || ton}".

Kundendaten:
- Firma: ${kunde.firma}
- Ansprechpartner: ${kunde.ansprechpartner}
- Kundenstatus: ${kunde.status}
- Anlagengroesse: ${kunde.anlagengroesse_kwp} kWp
- Letzter Kontakt: ${kunde.letzter_kontakt}
- Notiz: ${kunde.notiz || "Keine Notiz vorhanden"}

Pipeline-Eintraege:
${pipelineText}

Absender: ${absender}${zusatzKontext ? "\nZusaetzlicher Kontext: " + zusatzKontext : ""}`;

  const openRouterResponse = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          request.headers.get("origin") || "http://localhost:3000",
        "X-Title": "Solarwerk Sued Sales Hub",
      },
      body: JSON.stringify({
        model: "~anthropic/claude-haiku-latest",
        stream: true,
        max_tokens: 1024,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    }
  );

  if (!openRouterResponse.ok) {
    const errorBody = await openRouterResponse.text().catch(() => "");
    let errorMessage = "E-Mail-Generierung fehlgeschlagen";
    if (openRouterResponse.status === 401)
      errorMessage = "Ungueltiger API-Key";
    if (openRouterResponse.status === 429)
      errorMessage =
        "Rate Limit erreicht, bitte spaeter erneut versuchen";
    console.error(
      `OpenRouter ${openRouterResponse.status}:`,
      errorBody
    );
    return Response.json(
      { error: `${errorMessage} (${openRouterResponse.status})` },
      { status: openRouterResponse.status }
    );
  }

  const openRouterBody = openRouterResponse.body;
  if (!openRouterBody) {
    return Response.json(
      { error: "Keine Antwort vom KI-Service" },
      { status: 502 }
    );
  }

  const reader = openRouterBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch {
        // stream interrupted — close gracefully
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
