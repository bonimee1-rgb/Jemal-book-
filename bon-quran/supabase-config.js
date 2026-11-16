
(function () {
  "use strict";

  const SUPABASE_URL =
    "https://jemfdazltrnwhdfkldyy.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ከSupabaseየCopyያደረግኸውንሙሉቁልፍ";

  const configured =
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_URL.endsWith(".supabase.co") &&
    SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_") &&
    SUPABASE_PUBLISHABLE_KEY.length > 20;

  window.BON_QURAN_CONFIG = Object.freeze({
    url: SUPABASE_URL,
    anonKey: SUPABASE_PUBLISHABLE_KEY,
    configured: configured,
    appName: "Bon Quran",
    version: "1.0.0",
    defaultLanguage: "ar",
    supportedLanguages: ["ar", "am", "en", "om"]
  });

  console.log("Bon Quran config:", configured);
})();
