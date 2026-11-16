
/**
 * BON QURAN - SUPABASE CONFIGURATION
 *
 * Enter your own Supabase Project URL and Publishable Key.
 * NEVER put a service_role or secret key in this file.
 */

(function () {
  "use strict";

  const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";

  const SUPABASE_PUBLISHABLE_KEY =sb_publishable_4X1EqtdSb5TxRrp445x-Gw_cj5cfxGC
  

  const isConfigured =
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_URL.includes(".supabase.co") &&
    SUPABASE_PUBLISHABLE_KEY.length > 20 &&
    !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_");

  window.BON_QURAN_CONFIG = Object.freeze({
    url: SUPABASE_URL,
    anonKey: SUPABASE_PUBLISHABLE_KEY,
    configured: isConfigured,
    appName: "Bon Quran",
    version: "1.0.0",
    defaultLanguage: "ar",
    supportedLanguages: ["ar", "am", "en", "om"]
  });

  if (!isConfigured) {
    console.warn(
      "Bon Quran: Add your Supabase Project URL and Publishable Key."
    );
  }
})();
