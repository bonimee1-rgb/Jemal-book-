
/**
 * BON QURAN - SUPABASE CONFIGURATION
 */

(function () {
  "use strict";

  // Supabase Dashboard > Project Settings > API
  const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";

  // Supabase Publishable key (NOT secret key)
  const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

  const configured =
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_URL.includes(".supabase.co") &&
    SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_");

  window.BON_QURAN_CONFIG = Object.freeze({
    url: SUPABASE_URL,
    anonKey: SUPABASE_PUBLISHABLE_KEY,
    configured: configured,
    appName: "Bon Quran",
    defaultLanguage: "ar",
    supportedLanguages: ["ar", "am", "en", "om"]
  });

  if (!configured) {
    console.error(
      "Bon Quran: Supabase URL or Publishable Key is missing."
    );
  }
})();
