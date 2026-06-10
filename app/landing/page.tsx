import type { Metadata } from "next";
import Hero from "./hero";
import Stakes from "./stakes";
import Mechanism from "./mechanism";
import SocialProof from "./social-proof";
import Testimonials from "./testimonials-client";
import Benefits from "./benefits";
import Rechner from "./rechner-client";
import Faq from "./faq-client";
import Comparison from "./comparison";
import CtaFinal from "./cta-final";
import FoerderTicker from "./foerder-ticker";
import LandingFooter from "./landing-footer";

export const metadata: Metadata = {
  title:
    "Photovoltaik für Gewerbedächer — Festpreis · Eigene Monteure · 20 Jahre Garantie",
  description:
    "Solarwerk-Süd plant und montiert Photovoltaik für Hallendächer in Süddeutschland. Festpreis, eigene Monteure, 20 Jahre Garantie. Kostenlose Dach-Analyse.",
  openGraph: {
    title: "Photovoltaik fürs Hallendach — Festpreis statt Überraschungen",
    description:
      "480+ Gewerbeanlagen in Süddeutschland. Festpreis-Garantie, eigene Monteure, 20 Jahre Wartung inklusive.",
    type: "website",
  },
};

type SearchParams = Promise<{ v?: string }>;

export default async function LandingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { v } = await searchParams;

  return (
    <>
      <Hero variant={v} />
      <FoerderTicker />
      <Stakes />
      <Mechanism />
      <SocialProof />
      <Testimonials />
      <Benefits />
      <Rechner />
      <Faq />
      <Comparison />
      <CtaFinal />
      <LandingFooter />
    </>
  );
}
