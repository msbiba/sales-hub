"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "sw-cookie-consent-v2";
const CONSENT_EVENT = "sw-cookie-consent-change";

export default function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    function check() {
      try {
        setAllowed(localStorage.getItem(STORAGE_KEY) === "all");
      } catch {
        setAllowed(false);
      }
    }
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-4NVZYT5KCY"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4NVZYT5KCY');
        `}
      </Script>
    </>
  );
}
