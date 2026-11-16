
(function () {
  "use strict";

  const SUPABASE_URL =
    "https://jemfdazltrnwhdfkldyy.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_FULL_PUBLISHABLE_KEY_DwxbBvIxhvdGpA9oIic_QQ_5yDajyIT

  const configured =
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_URL.endsWith(".supabase.co") &&
    SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_") &&
    !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_");

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
      "Bon Quran: Supabase configuration is incomplete."
    );
  }
})();
