# Prompts

Zentrale, versionierte Ablage aller LLM-Prompts der Sales-Hub-App.

## Konvention

- **Format**: JSON, Chat-Messages-Array (`[{role, content}, ...]`).
- **Variablen**: Mustache-Syntax `{{variable}}`. Optionale Bloecke `{{#var}}...{{/var}}`.
- **Quelle der Wahrheit**: Diese Dateien werden von der App (`app/api/**`) UND von Promptfoo-Evals (`promptfooconfig.yaml`) gelesen. Nicht duplizieren.
- **Versionierung**: Aenderungen via PR. CI laeuft Promptfoo-Eval automatisch bei Aenderung im `prompts/`-Ordner.

## Aktuelle Prompts

| Datei | Verwendung | Variablen |
|-------|------------|-----------|
| `followup-email.json` | `app/api/ai/followup-email/route.ts` | `emailTypLabel`, `tonLabel`, `firma`, `ansprechpartner`, `status`, `anlagengroesse_kwp`, `letzter_kontakt`, `notiz`, `pipelineText`, `absender`, `zusatzKontext` |
