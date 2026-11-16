
"use strict";

// ==========================================
// BON QURAN - COMPLETE MAIN APPLICATION
// ==========================================

const CONFIG = window.BON_QURAN_CONFIG || {};

const state = {
  supabase: null,
  language: "ar",
  surahs: [],
  currentSurah: null,
  requestNumber: 0
};

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

const messages = {
  ar: {
    search: "ابحث عن سورة...",
    loading: "جارٍ التحميل...",
    unavailable: "إعدادات قاعدة البيانات غير مكتملة.",
    empty: "لم يتم العثور على سورة.",
    back: "العودة إلى السور",
    error: "تعذر تحميل البيانات.",
    noAyahs: "لا توجد آيات لهذه السورة في قاعدة البيانات.",
    noTranslation: "الترجمة غير متوفرة بعد.",
    pending: "لم يتم التحقق من المصدر بعد",
    verified: "تم التحقق",
    sourceNotice: "يرجى التأكد من صحة النص قبل اعتماده."
  },
  am: {
    search: "ሱራ ፈልግ...",
    loading: "በመጫን ላይ...",
    unavailable: "የDatabase ቅንብር አልተሟላም።",
    empty: "ሱራ አልተገኘም።",
    back: "ወደ ሱራዎች ተመለስ",
    error: "መረጃውን መጫን አልተቻለም።",
    noAyahs: "ለዚህ ሱራ በDatabase ውስጥ አንቀጾች አልተገኙም።",
    noTranslation: "ትርጉሙ ገና አልተገኘም።",
    pending: "ምንጩ ገና አልተረጋገጠም",
    verified: "ተረጋግጧል",
    sourceNotice: "ጽሑፉን ከመጠቀም በፊት ትክክለኛነቱን ያረጋግጡ።"
  },
  en: {
    search: "Search Surah...",
    loading: "Loading...",
    unavailable: "Database configuration is incomplete.",
    empty: "No Surah found.",
    back: "Back to Surahs",
    error: "Could not load data.",
    noAyahs: "No Ayahs found for this Surah.",
    noTranslation: "Translation not available yet.",
    pending: "Source not yet verified",
    verified: "Verified",
    sourceNotice: "Please verify the text before relying on it."
  },
  om: {
    search: "Suuraa barbaadi...",
    loading: "Fe'aa jira...",
    unavailable: "Qindaa'inni kuusdeetaa guutuu miti.",
    empty: "Suuraan hin argamne.",
    back: "Gara Suuraawwanitti deebi'i",
    error: "Odeeffannoo fe'uun hin danda'amne.",
    noAyahs: "Aayatonni suuraa kanaa kuusdeetaa keessatti hin argamne.",
    noTranslation: "Hiikni ammaaf hin jiru.",
    pending: "Maddi isaa ammaaf hin mirkanoofne",
    verified: "Mirkanaa'eera",
    sourceNotice: "Osoo hin fayyadamin dura sirrii ta'uu isaa mirkaneessi."
  }
};

function message(key) {
  return messages[state.language]?.[key] || messages.en[key] || key;
}

function showStatus(text) {
  const list = $("surahList");
  if (!list) return;

  list.innerHTML = `
    <div class="status-message">
      ${escapeHTML(text)}
    </div>
  `;
}

// ==========================================
// SUPABASE CONNECTION
// ==========================================

async function loadSupabaseLibrary() {
  if (!CONFIG.configured || !CONFIG.url || !CONFIG.anonKey) {
    showStatus(message("unavailable"));
    return;
  }

  try {
    if (!window.supabase) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("Supabase library could not load."));

        document.head.appendChild(script);
      });
    }

    state.supabase = window.supabase.createClient(
      CONFIG.url,
      CONFIG.anonKey
    );

    await loadSurahs();

  } catch (error) {
    console.error("Bon Quran connection error:", error);
    showStatus(message("error") + " " + error.message);
  }
}

// ==========================================
// LOAD SURAH LIBRARY
// ==========================================

async function loadSurahs() {
  showStatus(message("loading"));

  const { data, error } = await state.supabase
    .from("surahs")
    .select("id, arabic_name, transliteration")
    .order("id", { ascending: true });

  if (error) {
    console.error("Surah loading error:", error);
    showStatus(message("error") + " " + error.message);
    return;
  }

  state.surahs = data || [];

  if (state.surahs.length === 0) {
    showStatus(message("empty"));
    return;
  }

  renderSurahs();
}

function renderSurahs() {
  const search = $("searchInput");
  const list = $("surahList");

  if (!search || !list) return;

  const query = search.value.trim().toLowerCase();

  const filtered = state.surahs.filter((surah) => {
    const searchable = [
      surah.arabic_name,
      surah.transliteration,
      surah.id
    ].join(" ").toLowerCase();

    return searchable.includes(query);
  });

  if (!filtered.length) {
    showStatus(message("empty"));
    return;
  }

  list.innerHTML = filtered.map((surah) => `
    <article
      class="surah-card"
      data-surah-id="${Number(surah.id)}"
      role="button"
      tabindex="0"
    >
      <span class="surah-number">
        ${Number(surah.id)}
      </span>

      <div class="surah-info">
        <strong>
          ${escapeHTML(surah.transliteration || "Surah")}
        </strong>
        <small>Surah ${Number(surah.id)}</small>
      </div>

      <span class="surah-arabic" lang="ar" dir="rtl">
        ${escapeHTML(surah.arabic_name || "")}
      </span>
    </article>
  `).join("");

  list.querySelectorAll(".surah-card").forEach((card) => {
    const open = () => {
      openSurah(Number(card.dataset.surahId));
    };

    card.addEventListener("click", open);

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

// ==========================================
// LOAD AYAH AND TRANSLATION DATA
// ==========================================

async function openSurah(surahId) {
  if (!state.supabase) return;

  const surah = state.surahs.find(
    (item) => Number(item.id) === Number(surahId)
  );

  if (!surah) return;

  state.currentSurah = surah;

  const requestId = ++state.requestNumber;

  $("surahList").parentElement.hidden = true;
  $("searchInput").parentElement.hidden = true;
  $("reader").hidden = false;

  $("surahTitle").textContent =
    `${surah.transliteration || ""} — ${surah.arabic_name || ""}`;

  $("ayahList").innerHTML = `
    <p class="loading">${escapeHTML(message("loading"))}</p>
  `;

  // IMPORTANT:
  // Load all Ayahs for this Surah.
  // Do not hide rows just because their status is not "verified".
  const { data: ayahs, error } = await state.supabase
    .from("ayahs")
    .select("id, surah_id, ayah_number, arabic_text, verification_status")
    .eq("surah_id", Number(surahId))
    .order("ayah_number", { ascending: true });

  if (requestId !== state.requestNumber) return;

  if (error) {
    console.error("Ayah loading error:", error);
    $("ayahList").textContent =
      message("error") + " " + error.message;
    return;
  }

  if (!ayahs || ayahs.length === 0) {
    $("ayahList").textContent = message("noAyahs");
    return;
  }

  let translations = [];

  if (state.language !== "ar") {
    const ayahIds = ayahs.map((ayah) => ayah.id);

    const { data, error: translationError } =
      await state.supabase
        .from("translations")
        .select("ayah_id, language_code, translated_text")
        .in("ayah_id", ayahIds)
        .eq("language_code", state.language);

    if (requestId !== state.requestNumber) return;

    if (translationError) {
      console.error("Translation loading error:", translationError);
    } else {
      translations = data || [];
    }
  }

  const translationMap = new Map(
    translations.map((item) => [
      String(item.ayah_id),
      item.translated_text
    ])
  );

  $("ayahList").innerHTML = `
    <div class="status-message">
      ${escapeHTML(message("sourceNotice"))}
    </div>
    ${ayahs.map((ayah) => {
      const translation = translationMap.get(String(ayah.id));

      const isVerified =
        String(ayah.verification_status || "").toLowerCase() === "verified";

      return `
        <article class="ayah">
          <p class="ayah-arabic" lang="ar" dir="rtl">
            ${escapeHTML(ayah.arabic_text || "")}

            <span class="ayah-number">
              ${Number(ayah.ayah_number)}
            </span>
          </p>

          ${state.language !== "ar" ? `
            <p class="ayah-translation">
              ${translation
                ? escapeHTML(translation)
                : escapeHTML(message("noTranslation"))}
            </p>
          ` : ""}

          <small class="verification-status">
            ${escapeHTML(
              isVerified ? message("verified") : message("pending")
            )}
          </small>
        </article>
      `;
    }).join("")}
  `;
}

// ==========================================
// LANGUAGE SELECTION
// ==========================================

function changeLanguage(language) {
  if (!messages[language]) return;

  state.language = language;

  document.documentElement.lang =
    language === "om" ? "om" : language;

  document.querySelectorAll(".language").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.lang === language
    );
  });

  if ($("searchInput")) {
    $("searchInput").placeholder = message("search");
  }

  if ($("backButton")) {
    $("backButton").textContent = "← " + message("back");
  }

  if (state.currentSurah) {
    openSurah(Number(state.currentSurah.id));
  } else if (state.surahs.length) {
    renderSurahs();
  }
}

// ==========================================
// BUTTON EVENTS
// ==========================================

function setupEvents() {
  $("searchInput")?.addEventListener("input", renderSurahs);

  document.querySelectorAll(".language").forEach((button) => {
    button.addEventListener("click", () => {
      changeLanguage(button.dataset.lang);
    });
  });

  $("themeButton")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  $("backButton")?.addEventListener("click", () => {
    state.requestNumber++;
    state.currentSurah = null;

    $("reader").hidden = true;
    $("surahList").parentElement.hidden = false;
    $("searchInput").parentElement.hidden = false;
  });
}

// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  changeLanguage("ar");
  loadSupabaseLibrary();
});
