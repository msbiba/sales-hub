#!/usr/bin/env node
/**
 * Seed-Script: legt Ben, Clara, Anna (bearbeiter) und Bibi (buchhaltung) an.
 *
 * Voraussetzungen:
 * - .env.local enthaelt SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL
 * - DB-Migration §1-§4 wurde ausgefuehrt (profiles + Trigger existieren)
 *
 * Aufruf: node scripts/seed-users.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// .env.local laden (ohne dotenv-Dep)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
try {
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  });
} catch {
  console.error("Konnte .env.local nicht lesen:", envPath);
  process.exit(1);
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error("FEHLER: NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt");
  process.exit(1);
}

const admin = createClient(URL, KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "Solarwerk2026!";

const SEED = [
  { email: "ben@solarwerk.de",   full_name: "Ben Schmidt",   role: "bearbeiter" },
  { email: "clara@solarwerk.de", full_name: "Clara Weber",   role: "bearbeiter" },
  { email: "anna@solarwerk.de",  full_name: "Anna Mueller",  role: "bearbeiter" },
  { email: "bibi@solarwerk.de",  full_name: "Bibi Hartmann", role: "buchhaltung" },
];

async function upsertUser({ email, full_name, role }) {
  // 1. User anlegen (oder existierende ID holen)
  let userId;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });

  if (createErr) {
    if (/already.*registered|exists/i.test(createErr.message)) {
      // Bereits angelegt → ID via listUsers holen
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (listErr) throw listErr;
      const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (!existing) throw new Error(`User ${email} weder anlegbar noch findbar`);
      userId = existing.id;
      console.log(`  existing: ${email} (${userId})`);
    } else {
      throw createErr;
    }
  } else {
    userId = created.user.id;
    console.log(`  created : ${email} (${userId})`);
  }

  // 2. Profile updaten: full_name + Rolle (Trigger setzt nur Default-Rolle)
  const { error: upErr } = await admin
    .from("profiles")
    .update({ full_name, role })
    .eq("id", userId);

  if (upErr) throw upErr;
}

async function main() {
  console.log("Seeding users...");
  for (const seed of SEED) {
    try {
      await upsertUser(seed);
    } catch (e) {
      console.error(`FEHLER bei ${seed.email}:`, e.message);
      process.exitCode = 1;
    }
  }
  console.log("Done. Passwort fuer alle: " + PASSWORD);
}

main();
