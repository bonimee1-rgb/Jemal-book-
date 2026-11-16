
(function () {
  "use strict";

  // BON QURAN - SUPABASE CONFIGURATION

  const SUPABASE_URL =
    "https://jemfdazltrnwhdfkldyy.supabase.co";

  // Paste your FULL Supabase Publishable Key below.
  // It must start with sb_publishable_
  const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_YOUR_REAL_PUBLISHABLE_KEY_HERE";

  // Check configuration
  const configured =
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_URL.endsWith(".supabase.co") &&
    SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_") &&
    !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_");

  // Bon Quran settings
  window.BON_QURAN_CONFIG = Object.freeze({
    url: SUPABASE_URL,
    anonKey: SUPABASE_PUBLISHABLE_KEY,
    configured: configured,
    appName: "Bon Quran",
    version: "1.0.0",
    defaultLanguage: "ar",
    supportedLanguages: [
      "ar",
      "am",
      "en",
      "om"
    ]
  });

  // Configuration status
  if (configured) {
    console.log("Bon Quran: Supabase configuration loaded.");
  } else {
    console.error(
      "Bon Quran: Supabase URL or Publishable Key is missing."
    );
  }

})();
