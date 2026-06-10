import type { Metadata } from "next";
import Hero from "./hero";
import Stakes from "./stakes";
import Mechanism from "./mechanism";
import SocialProof from "./social-proof";
import Benefits from "./benefits";
import Rechner from "./rechner-client";
import Faq from "./faq-client";
import Comparison from "./comparison";
import CtaFinal from "./cta-final";
import FoerderTicker from "./foerder-ticker";
import LandingFooter from "./landing-footer";

const SITE_URL = "https://slscrm.vercel.app";
const OG_IMAGE =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80";

export const metadata: Metadata = {
  title:
    "Photovoltaik für Gewerbedächer — Festpreis · Eigene Monteure · 20 Jahre Garantie",
  description:
    "Solarwerk-Süd plant und montiert Photovoltaik für Hallendächer in Süddeutschland. Festpreis, eigene Monteure, 20 Jahre Garantie. Kostenlose Dach-Analyse.",
  alternates: {
    canonical: `${SITE_URL}/landing`,
  },
  openGraph: {
    title: "Photovoltaik fürs Hallendach — Festpreis statt Überraschungen",
    description:
      "480+ Gewerbeanlagen in Süddeutschland. Festpreis-Garantie, eigene Monteure, 20 Jahre Wartung inklusive.",
    type: "website",
    url: `${SITE_URL}/landing`,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Photovoltaik auf einem Gewerbedach in Süddeutschland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photovoltaik fürs Hallendach — Festpreis statt Überraschungen",
    description:
      "480+ Gewerbeanlagen in Süddeutschland. Festpreis, eigene Monteure, 20 Jahre Garantie.",
    images: [OG_IMAGE],
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
      <Benefits />
      <Rechner />
      <Faq />
      <Comparison />
      <CtaFinal />
      <LandingFooter />
    </>
  );
}
